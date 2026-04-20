import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, ChannelModel, ConsumeMessage } from 'amqplib';

type ConsumeOptions = {
  maxRetries?: number;
  prefetch?: number;
  deadLetterRoutingKey?: string;
};

@Injectable()
export class RabbitMqClientService implements OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqClientService.name);
  private connection?: ChannelModel;
  private channel?: Channel;
  private connectPromise?: Promise<Channel>;

  constructor(private readonly configService: ConfigService) {}

  async publish(
    routingKey: string,
    payload: Record<string, unknown>,
    options?: {
      headers?: Record<string, unknown>;
      persistent?: boolean;
    },
  ): Promise<void> {
    const channel = await this.getChannel();
    channel.publish(
      this.getExchangeName(),
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        contentType: 'application/json',
        persistent: options?.persistent ?? true,
        headers: options?.headers ?? {},
      },
    );
  }

  async consume(
    queueName: string,
    bindings: string[],
    handler: (
      payload: Record<string, unknown>,
      message: ConsumeMessage,
    ) => Promise<void>,
    options?: ConsumeOptions,
  ): Promise<void> {
    const channel = await this.getChannel();
    const exchange = this.getExchangeName();
    const dlx = this.getDeadLetterExchangeName();
    const deadLetterRoutingKey =
      options?.deadLetterRoutingKey ?? `${queueName}.failed`;
    const maxRetries = options?.maxRetries ?? 3;
    const prefetch =
      options?.prefetch ??
      this.configService.get<number>('RABBITMQ_PREFETCH', 20);

    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertExchange(dlx, 'topic', { durable: true });
    await channel.assertQueue(queueName, {
      durable: true,
      deadLetterExchange: dlx,
      deadLetterRoutingKey,
    });
    await channel.assertQueue(`${queueName}.dlq`, { durable: true });
    await channel.bindQueue(`${queueName}.dlq`, dlx, deadLetterRoutingKey);

    for (const binding of bindings) {
      await channel.bindQueue(queueName, exchange, binding);
    }

    await channel.prefetch(prefetch);
    await channel.consume(queueName, (message) => {
      if (!message) {
        return;
      }
      void this.processMessage({
        channel,
        message,
        handler,
        maxRetries,
        deadLetterRoutingKey,
        exchange,
        dlx,
      });
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  private async getChannel(): Promise<Channel> {
    if (this.channel) {
      return this.channel;
    }
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = this.createChannel();
    this.channel = await this.connectPromise;
    return this.channel;
  }

  private async createChannel(): Promise<Channel> {
    const url = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://localhost:5672',
    );
    this.connection = await amqp.connect(url);
    this.connection.on('error', (error: Error) => {
      this.logger.error(`RabbitMQ connection error: ${error.message}`);
    });
    this.connection.on('close', () => {
      this.logger.warn('RabbitMQ connection closed');
      this.connection = undefined;
      this.channel = undefined;
      this.connectPromise = undefined;
    });
    return this.connection.createChannel();
  }

  private async processMessage(params: {
    channel: Channel;
    message: ConsumeMessage;
    handler: (
      payload: Record<string, unknown>,
      message: ConsumeMessage,
    ) => Promise<void>;
    maxRetries: number;
    deadLetterRoutingKey: string;
    exchange: string;
    dlx: string;
  }): Promise<void> {
    const {
      channel,
      message,
      handler,
      maxRetries,
      deadLetterRoutingKey,
      exchange,
      dlx,
    } = params;

    try {
      const parsed: unknown = JSON.parse(message.content.toString());
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Invalid message payload');
      }
      await handler(parsed as Record<string, unknown>, message);
      channel.ack(message);
    } catch (error: unknown) {
      const messageHeaders = this.readHeaders(message);
      const rawRetryCount = messageHeaders['x-retry-count'];
      const contentType =
        typeof message.properties.contentType === 'string'
          ? message.properties.contentType
          : undefined;
      const retryCount =
        typeof rawRetryCount === 'number'
          ? rawRetryCount
          : Number(rawRetryCount ?? 0);

      if (retryCount < maxRetries) {
        const headers: Record<string, unknown> = {
          ...messageHeaders,
          'x-retry-count': retryCount + 1,
        };
        channel.publish(exchange, message.fields.routingKey, message.content, {
          contentType,
          persistent: true,
          headers,
        });
        channel.ack(message);
        return;
      }

      channel.publish(dlx, deadLetterRoutingKey, message.content, {
        contentType,
        persistent: true,
        headers: {
          ...messageHeaders,
          'x-failure-reason':
            error instanceof Error ? error.message : 'unknown',
          'x-original-routing-key': message.fields.routingKey,
        },
      });
      channel.ack(message);
      this.logger.error(
        `Message moved to DLQ (${deadLetterRoutingKey}) after ${retryCount} retries`,
      );
    }
  }

  private readHeaders(message: ConsumeMessage): Record<string, unknown> {
    const headers = message.properties.headers;
    if (!headers || typeof headers !== 'object' || Array.isArray(headers)) {
      return {};
    }
    return headers as Record<string, unknown>;
  }

  private getExchangeName(): string {
    return this.configService.get<string>(
      'RABBITMQ_EXCHANGE',
      'ecommerce.events',
    );
  }

  private getDeadLetterExchangeName(): string {
    return this.configService.get<string>('RABBITMQ_DLX', 'ecommerce.dlx');
  }
}
