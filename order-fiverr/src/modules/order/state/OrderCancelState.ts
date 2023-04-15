import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
import { OrderCompleteState } from './OrderCompleteState';

export class OrderCancelState extends IOrderState {
  constructor() {
    super();
    this.nameState = 'Cancel';
  }
  nameState: string;
  changeState(order: Order) {}

}
