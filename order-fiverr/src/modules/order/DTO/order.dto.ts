import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import { IOrderState } from '../state/IOrderState';

export class OrderDTO {
  public id: number;
  public customerID: string;
  public jobPostID: number;
  public FreelancerID: string;
  public createTime: Date;
  public deliveryTime: number;
  public totalPrice: number;
  public status: string;
  public packageDetailID: number;
}
