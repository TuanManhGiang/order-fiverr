import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../model/order.entity/order.entity';
import Stripe from 'stripe';
import { PaymentDTO } from 'src/modules/earn/DTO/payment.dto';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import { OrderDTO } from '../DTO/order.dto';
import { StateService } from '../service/stateService.service';

export abstract class IOrderState {
  public nameState: string;
  abstract changeState(order: OrderDTO): IOrderState;
  public confirm(order: OrderDTO): void {
    throw new HttpException('order canceled', HttpStatus.FORBIDDEN);
  }
  public cancel(order: OrderDTO): void {
    throw new HttpException('order already cancel', HttpStatus.FORBIDDEN);
  }
  public delivery(order: OrderDTO): void {
    throw new HttpException('order already delivery', HttpStatus.FORBIDDEN);
  }
  public complete(order: OrderDTO): void {
    throw new HttpException('order complete', HttpStatus.FORBIDDEN);
  }
  public payment(
    order: OrderDTO,
    chargeData: PaymentDTO,
  ): Promise<HistoryOrder> {
    throw new HttpException('can not payment in here', HttpStatus.FORBIDDEN);
  }
  public async deposit(
    order: OrderDTO,
    chargeData: PaymentDTO,
  ): Promise<HistoryOrder> {
    throw new HttpException('method not implement', HttpStatus.FORBIDDEN);
  }
}
