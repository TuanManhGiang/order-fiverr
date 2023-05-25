import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../order.entity/order.entity';
@Entity()
export class HistoryOrder {
  constructor() {}
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (order) => order.id)
  @JoinColumn()
  orderID: number;

  @Column()
  timeStart: Date;

  @Column()
  timeEnd: Date;

  @Column()
  statusOrder: string;

  @Column({ nullable: true })
  paymentID: string;

  @Column({ nullable: true })
  reviewID: number;

  @Column()
  totalPrice: number;

}
