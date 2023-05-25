import { HistoryOrder } from '../model/history-order.entity/history-order.entity';

export class OrderDTO {
  public id : number;
  public customerID: number;
  public jobPostID: number;
  public FreelancerID: number;
  public createTime: Date;
  public deliveryTime: number;
  public totalPrice: number;
  public status: string;
  public timeStart: Date;
  public timeEnd: Date;
  
}
