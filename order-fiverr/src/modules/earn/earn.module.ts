import { Module } from '@nestjs/common';

import { PaymentController } from './controller/payment.controller';
import { PaymentService } from './service/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/model/order.entity/order.entity';
import { PaymentEntity } from './model/payment.entity/payment.entity';
import { OrderService } from '../order/service/order.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PaymentEntity]), OrderModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class EarnModule {}
