import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './controller/ordercontroller.controller';
import { Order } from './model/order.entity/order.entity';
import { OrderService } from './service/order.service';
import { HistoryOrder } from './model/history-order.entity/history-order.entity';
import { OrderOfferState } from './state/OrderOfferState';
import { DataSource } from 'typeorm';
import { CacheModule } from '@nestjs/common';
import { RedisService } from './service/redis.service';


const redisStore = require('cache-manager-redis-store').redisStore;

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, HistoryOrder]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost', //default host
      port: 6379, //default port
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    RedisService,
    OrderOfferState,
  ],
  exports: [OrderService, RedisService],
})
export class OrderModule {
  constructor(private dataSource: DataSource) {

  }
}
