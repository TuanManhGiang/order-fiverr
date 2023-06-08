import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';
import { PaymentDTO } from '../DTO/payment.dto';
import { OrderService } from 'src/modules/order/service/order.service';
import { HistoryOrder } from 'src/modules/order/model/history-order.entity/history-order.entity';
import { resolve } from 'path';
import { rejects } from 'assert';
import { order } from '../model/Order';
import { InjectRepository } from '@nestjs/typeorm';
import HistoryOrderDTO from 'src/modules/order/DTO/historyOrder.dto';
import { Repository } from 'typeorm';
import { RedisService } from 'src/modules/order/service/redis.service';
import { StateService } from 'src/modules/order/service/stateService.service';
import { Order } from 'src/modules/order/model/order.entity/order.entity';
import { OrderDTO } from 'src/modules/order/DTO/order.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderService: OrderService,
    @InjectRepository(Order)
    private orderRepository: Repository<OrderDTO>,
    @InjectRepository(HistoryOrder)
    private historyOrderRepository: Repository<HistoryOrderDTO>,
    private readonly redisService: RedisService,
  ) {}
  // buyer payment for fiverr
  async deposit(id: number, chargeData: PaymentDTO): Promise<HistoryOrder> {
    const order = await this.orderService.findById(id);
    chargeData.amount = order.totalPrice;
    const orderStateService: StateService = new StateService(
      order,
      this.historyOrderRepository,
      this.redisService,
    );
    const charge = orderStateService.deposit(chargeData, order); // thanh toán tùy vào state : offerState.deposit()
    return charge;
  }

  // fiverr payment for seller
  async payment(id: number, chargeData: PaymentDTO): Promise<HistoryOrder> {
    const order = await this.orderService.findById(id);
    chargeData.amount = order.totalPrice;
    const orderStateService: StateService = new StateService(
      order,
      this.historyOrderRepository,
      this.redisService,
    );
    const charge = await orderStateService.payment(chargeData, order);
    await this.orderRepository.save(order); // thanh toán tùy vào state : offerState.deposit()
    return charge;
  }

  async delivery(id: number): Promise<OrderDTO> {
    const order = await this.orderService.findById(id);
    const orderStateService: StateService = new StateService(
      order,
      this.historyOrderRepository,
      this.redisService,
    );
    orderStateService.delivery(order); // thanh toán tùy vào state : offerState.deposit()
    return await this.orderRepository.save(order);
  }
  // return money for buyer if order cancel
  refund() {}
}
