import { OrderDTO } from '../DTO/order.dto';
import { Order } from '../model/order.entity/order.entity';

export interface IOrderService {
  getAll(): Promise<OrderDTO[]>;
  findById(id: number): Promise<OrderDTO>;
  createOrder(order: OrderDTO): Promise<OrderDTO>;
  confirm(id: number, order: Order): Promise<OrderDTO>;
}
