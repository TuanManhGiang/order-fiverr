import { Injectable } from '@nestjs/common';
import { Order } from 'src/modules/order/model/order.entity/order.entity';

@Injectable()
export class PaymentService {
  // buyer payment for fiverr
  deposit(order: Order) {
    order.deposit();
  }
  // fiverr payment for seller
  payment(order: Order) {}
  // return money for buyer if order cancel
  refund() {}
}
