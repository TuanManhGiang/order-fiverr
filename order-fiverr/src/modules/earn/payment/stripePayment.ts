import { HistoryOrder } from 'src/modules/order/model/history-order.entity/history-order.entity';
import { Order } from 'src/modules/order/model/order.entity/order.entity';
import Stripe from 'stripe';
import { PaymentDTO } from '../DTO/payment.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentStripe {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(
      'sk_test_51MxQKYLH6eZhwXzcFT9vXcxuNW7ONr3YDYbmiAcTyXce79pJ0jowNR3T0tHbyQFD5FsDyhl9jM8IFLAISa4k8kKQ00jC8HI4aR',
      { apiVersion: '2022-11-15' },
    );
  }
  public async charge(chargeData: PaymentDTO): Promise<Stripe.Charge> {
    const charge = this.stripe.charges.create(chargeData).catch(function () {
      throw { '403': 'can not payment with stripe api ' };
    });
    return charge; // return json
  }
}
