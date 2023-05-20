import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../model/order.entity/order.entity';
import Stripe from 'stripe';
import { PaymentDTO } from 'src/modules/earn/DTO/payment.dto';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';

export abstract class IOrderState {
  public nameState: string;
  abstract changeState(order: Order): void;
  public confirm(order: Order): void {
    throw new HttpException('method not implement', HttpStatus.FORBIDDEN);
  }
  public cancel(order: Order): void {
    throw new HttpException('method not implement', HttpStatus.FORBIDDEN);
  }
  public complete(order: Order): void {
    throw new HttpException('method not implement', HttpStatus.FORBIDDEN);
  }
  public payment(order: Order): void {
    throw new HttpException('method not implement', HttpStatus.FORBIDDEN);
  }
  public async deposit(
    order: Order,
    chargeData: PaymentDTO,
  ): Promise<HistoryOrder> {
    throw new HttpException('method not implement', HttpStatus.FORBIDDEN);
  }
}
