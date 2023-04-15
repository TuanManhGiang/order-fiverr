import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../model/order.entity/order.entity';

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
  public deposit(order: Order): void {
    throw new HttpException('method not implement', HttpStatus.FORBIDDEN);
  }
}
