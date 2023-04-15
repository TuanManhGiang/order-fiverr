import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Order } from '../order.entity/order.entity';
@Entity()
export class HistoryOrder {
  constructor() {}
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (orderID) => orderID.historyOrder)
  orderID: number;

  @Column()
  timeStart: Date;

  @Column()
  timeEnd: Date;

  @Column()
  statusOrder: string;

  @Column({ nullable: true })
  paymentID: number;

  @Column({ nullable: true })
  reviewID: number;

  @Column()
  totalPrice: number;
  public withReview(reviewID: number): HistoryOrder {
    this.reviewID = reviewID;
    return this;
  }
  public withpayment(paymentID: number): HistoryOrder {
    this.paymentID = paymentID;
    return this;
  }
}
