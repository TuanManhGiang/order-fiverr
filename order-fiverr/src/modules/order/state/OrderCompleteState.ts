import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
export class OrderCompleteState extends IOrderState {
  constructor() {
    super();
    this.nameState = 'Completed';
  }
  nameState: string;
  changeState(order: Order) {}
}
