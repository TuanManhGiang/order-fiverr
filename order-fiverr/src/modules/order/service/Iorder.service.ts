import { OrderDTO } from '../DTO/order.dto';
import { Order } from '../model/order.entity/order.entity';

export interface IOrderService {
  getAll(): Promise<Order[]>;
  findById(id: number): Promise<Order>;
  createOrder(order: OrderDTO): Promise<Order>;
  confirm(id: number, order: Order): Promise<Order>;
  delete(id: number): Promise<void>;
}
