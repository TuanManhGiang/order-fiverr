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
import { StateService } from './stateService.service';
import * as moment from 'moment';
import AnalysDTO from '../DTO/analysOrder.dto';
const crypto = require('crypto');

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<OrderDTO>,

    @InjectRepository(HistoryOrder)
    private historyOrderRepository: Repository<HistoryOrderDTO>,
    private readonly redisService: RedisService,
  ) {}

  getAll(): Promise<OrderDTO[]> {
    return this.orderRepository.find();
  }

  async findById(id: number): Promise<OrderDTO> {
    const order = await this.orderRepository.findOneById(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }
  async findByCustomerID(id: string): Promise<OrderDTO[]> {
    const order = await this.orderRepository.findBy({ customerID: id });
    if (!order) {
      throw new NotFoundException(`Order with customer id ${id} not found`);
    }
    return order;
  }
  async findOrderbyCustomerID(id: string): Promise<OrderDTO[]> {
    const order = await this.orderRepository.findBy({ customerID: id });
    if (!order) {
      throw new NotFoundException(`Order with customer id ${id} not found`);
    }

    return order;
  }
  async findByFreelancerID(id: string): Promise<OrderDTO[]> {
    const order = await this.orderRepository.findBy({ FreelancerID: id });
    if (!order) {
      throw new NotFoundException(`Order with Freelancer id ${id} not found`);
    }

    return order;
  }
  async findOrderDetailByID(
    orderID: number,
    customerid: string,
  ): Promise<OrderDTO[]> {
    const order = await this.orderRepository.findBy({
      customerID: customerid,
      id: orderID,
    });
    if (!order) {
      throw new NotFoundException(
        `Order with Customer id ${customerid} , orderID ${orderID} not found`,
      );
    }

    return order;
  }
  async FindOrderByStatus(
    freelancerID: string,
    status: string,
  ): Promise<OrderDTO[]> {
    const order = await this.orderRepository.findBy({
      status: status,
      FreelancerID: freelancerID,
    });

    return order;
  }
  async totalEarn(freelancerID: string): Promise<number> {
    const order = await this.orderRepository.findBy({
      status: 'Completed',
      FreelancerID: freelancerID,
    });
    let totalEarn = 0;
    for (var item of order) {
      totalEarn += item.totalPrice;
    }
    return totalEarn;
  }

  async findOrderDetailByFreelancerID(
    orderID: number,
    freelancerid: string,
  ): Promise<OrderDTO[]> {
    const order = await this.orderRepository.findBy({
      FreelancerID: freelancerid,
      id: orderID,
    });
    if (!order) {
      throw new NotFoundException(
        `Order with Customer id ${freelancerid} , orderID ${orderID} not found`,
      );
    }

    return order;
  }
  private getTimeNow(): Date {
    return moment().toDate();
  }
  async createOrder(order: OrderDTO): Promise<OrderDTO> {
    // calculate price : call to gig service take 'price  = gig_price + packageID_price + extra_Price

    // const newOrder = await this.orderRepository.create(order);

    return await this.orderRepository.save(order);
  }
  async confirm(id: number): Promise<OrderDTO> {
    const order = await this.findById(id);
    const orderStateService: StateService = new StateService(
      order,
      this.historyOrderRepository,
      this.redisService,
    );
    orderStateService.confirm(order);
    return await this.orderRepository.save(order);
  }
  async cancel(id: number): Promise<OrderDTO> {
    const order = await this.findById(id);
    const orderStateService: StateService = new StateService(
      order,
      this.historyOrderRepository,
      this.redisService,
    );
    orderStateService.cancel(order);
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
}
