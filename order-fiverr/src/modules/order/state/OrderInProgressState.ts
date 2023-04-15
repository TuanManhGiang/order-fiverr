import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
import { OrderCompleteState } from './OrderCompleteState';

export class OrderInProgressState extends IOrderState {
  constructor() {
    super();
    this.nameState = 'Inprogress';
  }
  nameState: string;
  changeState(order: Order) {
    order.setState(new OrderCompleteState());
  }
}
