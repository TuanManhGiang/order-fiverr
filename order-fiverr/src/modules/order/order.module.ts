import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './controller/ordercontroller.controller';
import { Order } from './model/order.entity/order.entity';
import { OrderService } from './service/order.service';
import { HistoryOrder } from './model/history-order.entity/history-order.entity';
import { OrderOfferState } from './state/OrderOfferState';

@Module({
  imports: [TypeOrmModule.forFeature([Order, HistoryOrder])],
  controllers: [OrderController],
  providers: [OrderService, OrderOfferState],
  exports: [OrderService],
})
export class OrderModule {}
