import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IOrderState } from '../../state/IOrderState';
import { OrderCompleteState } from '../../state/OrderCompleteState';
import { OrderCancelState } from '../../state/OrderCancelState';
import { OrderInProgressState } from '../../state/OrderInProgressState';
import { OrderOfferState } from '../../state/OrderOfferState';
import { HistoryOrder } from '../history-order.entity/history-order.entity';
import Stripe from 'stripe';
import { PaymentDTO } from 'src/modules/earn/DTO/payment.dto';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  private state: IOrderState;
  // public offerOrderState: IOrderState;
  // public confirmOrderState: IOrderState;
  // public inProgressOrderState: IOrderState;
  // public compelteOrderState: IOrderState;
  public getState(): IOrderState {
    return this.state;
  }
  public setState(state: IOrderState) {
    //thay đổi trạng thái và thực thi logic ứng với mỗi trạng thái
    this.status = state.nameState;
    this.state = state;
  }
  constructor() {}
  public changeState() {
    this.state.changeState(this);
  }
  public confirm() {
    this.state.confirm(this);
  }
  private complete() {}
  public cancel() {
    this.state.cancel(this);
  }
  public checkPermission(id: number): Boolean {
    if (id == this.FreelancerID || id == this.customerID) return true;
    return false;
  }
  public payment() {
    this.state.payment(this);
  }
  public async deposit(chargeData: PaymentDTO): Promise<HistoryOrder> {
    return this.state.deposit(this, chargeData);
  }
  @Column()
  customerID: number;

  @Column()
  jobPostID: number;

  @Column()
  FreelancerID: number;

  @Column()
  createTime: Date;

  @Column()
  deliveryTime: number;

  @Column()
  totalPrice: number;

  @Column()
  byOrder: boolean;

  @Column()
  packageDetailID: number;

  @Column()
  status: string;
}
