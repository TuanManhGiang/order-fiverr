import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { order } from "./Order";

@Entity("history_order", { schema: "orderfiverr" })
export class historyOrder {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", { name: "timeStart" })
  time_start: Date;

  @Column("datetime", { name: "timeEnd" })
  time_end: Date;

  @Column("varchar", { name: "statusOrder", length: 255 })
  status_order: string;

  @Column("int", { name: "paymentID", nullable: true })
  payment_id: number | null;

  @Column("int", { name: "reviewID", nullable: true })
  review_id: number | null;

  @Column("int", { name: "totalPrice" })
  total_price: number;

  @ManyToOne(() => order, (order) => order.history_orders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "orderIDId", referencedColumnName: "id" }])
  order_id: order;
}
