import { Order } from '../model/order.entity/order.entity';
import * as moment from 'moment';
export default class HistoryOrderDTO {
  orderID: number;
  timeStart: Date;
  timeEnd: Date;
  statusOrder: string;
  paymentID: string;
  packageDetailID: number;
  reviewID: number;
  totalPrice: number;
  constructor(order: Order, status: string) {
    this.orderID = order.id;
    this.packageDetailID = order.packageDetailID;

    this.statusOrder = status;
    this.timeStart = this.getTimeNow();
    console.log(this.timeStart);
    this.timeEnd = moment().add(order.deliveryTime, 'days').toDate();
    this.totalPrice = order.totalPrice;
  }
  private getTimeNow(): Date {
    return moment().toDate();
  }
}
