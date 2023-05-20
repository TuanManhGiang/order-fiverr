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
@Injectable()
export class OrderOfferState extends IOrderState {
  private paymentStripe: PaymentStripe;
  constructor(
    @InjectRepository(HistoryOrder)
    private historyOrderRepository: Repository<HistoryOrder>,
    private readonly redisService: RedisService,
  ) {
    super();
    this.paymentStripe = new PaymentStripe();
    this.nameState = 'Offer';
  }
  nameState: string;
  changeState(order: Order) {
    order.setState(new OrderInProgressState());
  }
  public confirm(order: Order) {
    this.changeState(order);
  }
  public cancel(order: Order) {
    order.setState(new OrderCancelState());
  }

  public async deposit(
    order: Order,
    chargeData: PaymentDTO,
  ): Promise<HistoryOrder> {
    const idempotencyKey = await this.redisService.get(order.id+"");
    if (!idempotencyKey) {
      throw new HttpException('order already payment', HttpStatus.FORBIDDEN);
    }
    await this.paymentStripe.charge(chargeData, idempotencyKey);
    await this.redisService.delete(order.id + '');
    return this.createHistoryOrder(order, 'payment complete');
  }
  private async createHistoryOrder(
    order: Order,
    status: string,
  ): Promise<HistoryOrder> {
    const historyOrderDTO = new HistoryOrderDTO(order, status);
    return await this.historyOrderRepository.save(historyOrderDTO);
  } 
}
