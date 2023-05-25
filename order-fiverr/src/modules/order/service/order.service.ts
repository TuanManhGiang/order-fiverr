import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { IOrderState } from '../state/IOrderState';
import { RedisService } from './redis.service';

@Injectable()
export class OrderService implements IOrderService {
  private orderCompleteState: OrderCompleteState;
  private orderCancelState: OrderCompleteState;
  private orderInProgressState: OrderInProgressState;
  private orderOfferState: OrderOfferState;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<OrderDTO>,
  
    @InjectRepository(HistoryOrder)
    private historyOrderRepository: Repository<HistoryOrderDTO>,
    private readonly redisService: RedisService,
  ) {
    this.orderCompleteState = new OrderCompleteState();
    this.orderCancelState = new OrderCancelState();
    this.orderInProgressState = new OrderInProgressState();
    this.orderOfferState = new OrderOfferState(this.historyOrderRepository,this.redisService);
  }

  getAll(): Promise<OrderDTO[]> {
    return this.orderRepository.find();
  }
  private setStateByStatus(status: string) :IOrderState{
    const stateStatus = {
      'Offer': this.orderOfferState,
      'Completed': this.orderCompleteState,
      'Cancel': this.orderCancelState, 
      'Inprogress': this.orderInProgressState,
    };
    return stateStatus[status];
  }
  async findById(id: number): Promise<OrderDTO> {
    const order =  await this.orderRepository.findOneById(id );
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    } 
     const state :IOrderState = this.setStateByStatus(order.status);
     //order.setState(state);
    return order;
  }
  async createOrder(order: OrderDTO): Promise<OrderDTO> {
    // calculate price : call to gig service take 'price  = gig_price + packageID_price + extra_Price
    order.totalPrice = 1;

    // const newOrder = await this.orderRepository.create(order);

    return await this.orderRepository.save(order);
  }
  async confirm(id: number): Promise<OrderDTO> {
    const order = await this.findById(id);
    console.log(order.status);
    //order.confirm();
    this.orderRepository.save(order);
    return order;
  }
  async cancel(id: number): Promise<OrderDTO> {
    const order = await this.findById(id);
   // order.cancel();
    await this.orderRepository.save(order);
    return order;
  }
  // public addDelayEventOrder(orderId: number, delay: number) {
  //   return new Promise((resolve, reject) => {
  //     client.set(orderId, 'Cancel order', 'EX', delay, (err, result) => {
  //       if (err) return reject(err);
  //       resolve(result);
  //     });
  //   });
  // }
  async delete(id: number): Promise<void> {
    const order = await this.findById(id);
    this.orderRepository.save(order);
  }


}
