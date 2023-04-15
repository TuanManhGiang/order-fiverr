import { Order } from '../model/order.entity/order.entity';
import * as moment from 'moment';
export default class HistoryOrderDTO {
  orderID: number;
  timeStart: Date;
  timeEnd: Date;
  statusOrder: string;
  paymentID: number;
  packageDetailID: number;
  reviewID: number;
  totalPrice: number;
  constructor(order: Order) {
    this.orderID = order.id;
    this.statusOrder = order.status;
    this.packageDetailID = order.packageDetailID;
    this.timeStart = this.getTimeNow();
    console.log(this.timeStart);
    this.timeEnd = moment().add(order.deliveryTime, 'days').toDate();
    this.totalPrice = 1;
  }
  private getTimeNow(): Date {
    return moment().toDate();
  }
  public withReview(reviewID: number): HistoryOrderDTO {
    this.reviewID = reviewID;
    return this;
  }
  public withpayment(paymentID: number): HistoryOrderDTO {
    this.paymentID = paymentID;
    return this;
  }
}
