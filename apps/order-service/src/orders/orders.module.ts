import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogClientService } from 'src/common/services/catalog-client.service';
import { InventoryClientService } from 'src/common/services/inventory-client.service';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { RabbitMqClientService } from 'src/common/services/rabbitmq-client.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProcessedEvent } from './entities/processed-event.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymentEventsConsumer } from './payment-events.consumer';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Order, OrderItem, ProcessedEvent]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    InventoryClientService,
    CatalogClientService,
    PaymentClientService,
    RabbitMqClientService,
    PaymentEventsConsumer,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
