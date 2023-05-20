import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoryOrder } from './modules/order/model/history-order.entity/history-order.entity';
import { Order } from './modules/order/model/order.entity/order.entity';
import { OrderModule } from './modules/order/order.module';
import { EarnModule } from './modules/earn/earn.module';
import { PaymentEntity } from './modules/earn/model/payment.entity/payment.entity';
import { CacheModule } from '@nestjs/common';


const redisStore = require('cache-manager-redis-store').redisStore;
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: null,
      database: 'orderfiverr',
      entities: [Order, HistoryOrder, PaymentEntity],
      synchronize: true,
    }),

    
    // MongooseModule.forRoot('mongodb://localhost:27017/job-test'),
    OrderModule,
    EarnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
