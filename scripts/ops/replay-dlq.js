const amqp = require('amqplib');

async function main() {
  const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const sourceQueue = process.env.DLQ_NAME || 'order.payment.events.dlq';
  const targetExchange = process.env.RABBITMQ_EXCHANGE || 'ecommerce.events';
  const targetRoutingKey = process.env.REPLAY_ROUTING_KEY || 'payment.intent.succeeded';
  const limit = Number(process.env.REPLAY_LIMIT || 100);

  const conn = await amqp.connect(url);
  const ch = await conn.createChannel();

  await ch.assertQueue(sourceQueue, { durable: true });
  await ch.assertExchange(targetExchange, 'topic', { durable: true });

  let replayed = 0;
  for (let i = 0; i < limit; i += 1) {
    const msg = await ch.get(sourceQueue, { noAck: false });
    if (!msg) break;

    ch.publish(targetExchange, targetRoutingKey, msg.content, {
      contentType: msg.properties.contentType || 'application/json',
      persistent: true,
      headers: {
        ...(msg.properties.headers || {}),
        'x-replayed-from-dlq': sourceQueue,
      },
    });
    ch.ack(msg);
    replayed += 1;
  }

  await ch.close();
  await conn.close();
  console.log(`Replayed ${replayed} messages from ${sourceQueue}`);
}

main().catch((error) => {
  console.error('DLQ replay failed:', error);
  process.exit(1);
});
