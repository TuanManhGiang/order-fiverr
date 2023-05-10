import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';
import { PaymentDTO } from '../DTO/payment.dto';
import { OrderService } from 'src/modules/order/service/order.service';
import { HistoryOrder } from 'src/modules/order/model/history-order.entity/history-order.entity';
import { resolve } from 'path';
import { rejects } from 'assert';
import { order } from '../model/Order';

@Injectable()
export class PaymentService {
  constructor(private readonly orderService: OrderService) {}
  // buyer payment for fiverr
  async deposit(id: number, chargeData: PaymentDTO): Promise<HistoryOrder> {
    const order = await this.orderService.findById(id);
    chargeData.amount = order.totalPrice;
    const charge = order.deposit(chargeData); // thanh toán tùy vào state : offerState.deposit()
    return charge;
  }

  // fiverr payment for seller
  payment() {}
  // return money for buyer if order cancel
  refund() {}
}
