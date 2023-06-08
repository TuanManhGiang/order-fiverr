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
  public async charge(
    chargeData: PaymentDTO,
    idempotencyKey: any,
  ): Promise<Stripe.Charge> {
    chargeData.amount = 100 * chargeData.amount;
    const charge = this.stripe.charges.create(chargeData, {
      idempotencyKey: idempotencyKey, // Truyền mã xác nhận duy nhất vào option
    });
    return charge; // return json
  }
  public async payment(chargeData: PaymentDTO): Promise<Stripe.Transfer> {
    const transfer = await this.stripe.transfers.create({
      amount: chargeData.amount * 100,
      currency: 'usd',
      destination: 'acct_1NCPNrQ7A7ZXgPzO',
    });
    return transfer; // return json
  }
}
