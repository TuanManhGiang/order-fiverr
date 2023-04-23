import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { historyOrder } from "./HistoryOrder";

@Entity("order", { schema: "orderfiverr" })
export class order {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "customerID" })
  customer_id: number;

  @Column("int", { name: "jobPostID" })
  job_post_id: number;

  @Column("int", { name: "FreelancerID" })
  freelancer_id: number;

  @Column("datetime", { name: "createTime" })
  create_time: Date;

  @Column("int", { name: "totalPrice" })
  total_price: number;

  @Column("tinyint", { name: "byOrder" })
  by_order: number;

  @Column("int", { name: "packageDetailID" })
  package_detail_id: number;

  @Column("varchar", { name: "status", length: 255 })
  status: string;

  @Column("int", { name: "deliveryTime" })
  delivery_time: number;

  @OneToMany(() => historyOrder, (history_order) => history_order.order_id)
  history_orders: historyOrder[];
}
