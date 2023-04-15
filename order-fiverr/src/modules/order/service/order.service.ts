import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDTO } from '../DTO/order.dto';
import { Order } from '../model/order.entity/order.entity';

import { IOrderService } from './Iorder.service';
import { OrderCancelState } from '../state/OrderCancelState';
import { OrderCompleteState } from '../state/OrderCompleteState';
import { OrderInProgressState } from '../state/OrderInProgressState';
import { OrderOfferState } from '../state/OrderOfferState';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import HistoryOrderDTO from '../DTO/historyOrder.dto';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private orderOfferState: OrderOfferState,
  ) {}
  getAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }
  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    switch (order.status) {
      case 'Offer':
        order.setState(this.orderOfferState);
        break;
      case 'Completed':
        order.setState(new OrderCompleteState());
        break;
      case 'Cancel':
        order.setState(new OrderCancelState());
        break;
      case 'Inprogress':
        order.setState(new OrderInProgressState());
        break;
    }
    return order;
  }
  async createOrder(order: OrderDTO): Promise<Order> {
    const newOrder = this.orderRepository.create(order);

    return this.orderRepository.save(newOrder);
  }
  async confirm(id: number): Promise<Order> {
    const order = await this.findById(id);
    console.log(order.status);
    order.confirm();
    this.orderRepository.save(order);
    return order;
  }
  async cancel(id: number): Promise<Order> {
    const order = await this.findById(id);
    order.cancel();
    await this.orderRepository.save(order);
    return order;
  }

  async delete(id: number): Promise<void> {
    const order = await this.findById(id);
    this.orderRepository.save(order);
  }

  async checkPermission(id: number, orderId: number): Promise<Boolean> {
    const order = this.findById(id);
    return (await order).checkPermission(id);
  }
}
