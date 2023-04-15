import { Module } from '@nestjs/common';

import { PaymentController } from './controller/payment.controller';
import { PaymentService } from './service/payment.service';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class EarnModule {}
