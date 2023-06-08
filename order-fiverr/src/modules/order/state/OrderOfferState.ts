import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
import { OrderCancelState } from './OrderCancelState';
import { OrderInProgressState } from './OrderInProgressState';

import HistoryOrderDTO from '../DTO/historyOrder.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import Stripe from 'stripe';
import { PaymentDTO } from 'src/modules/earn/DTO/payment.dto';
import { PaymentStripe } from 'src/modules/earn/payment/stripePayment';
import { DataSource } from 'typeorm';
import { historyOrder } from 'src/modules/earn/model/HistoryOrder';
import { RedisService } from '../service/redis.service';
import { stringify } from 'querystring';
import { OrderDTO } from '../DTO/order.dto';
import { StateService } from '../service/stateService.service';

@Injectable()
export class OrderOfferState extends IOrderState {
  changeState(order: OrderDTO): IOrderState {
    order.status = 'Inprogress';
    return new OrderInProgressState(
      this.historyOrderRepository,
      this.redisService,
    );
  }

  private paymentStripe: PaymentStripe;
  private historyOrderRepository;
  private redisService;
  constructor(historyOrderRepository, redisService) {
    super();
    this.historyOrderRepository = historyOrderRepository;
    this.redisService = redisService;
    this.paymentStripe = new PaymentStripe();
    this.nameState = 'Offer';
  }

  public confirm(order: OrderDTO) {
    this.changeState(order);
  }
  public async cancel(order: OrderDTO) {
    order.status = 'Cancel';
    await this.redisService.delete(order.id + '');
    this.createHistoryOrder(order, 'cancel');
  }

  public async deposit(
    order: OrderDTO,
    chargeData: PaymentDTO,
  ): Promise<HistoryOrder> {
    const idempotencyKey = await this.redisService.get(order.id + '');
    if (!idempotencyKey) {
      throw new HttpException('order already payment', HttpStatus.FORBIDDEN);
    }
    await this.paymentStripe.charge(chargeData, idempotencyKey);

    await this.redisService.delete(order.id + '');
    return this.createHistoryOrder(order, 'deposit');
  }
  private async createHistoryOrder(
    order: OrderDTO,
    status: string,
  ): Promise<HistoryOrder> {
    const historyOrderDTO = new HistoryOrderDTO(order, status);
    return await this.historyOrderRepository.save(historyOrderDTO);
  }
}
