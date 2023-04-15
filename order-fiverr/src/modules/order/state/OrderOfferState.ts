import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
import { OrderCancelState } from './OrderCancelState';
import { OrderInProgressState } from './OrderInProgressState';

import HistoryOrderDTO from '../DTO/historyOrder.dto';
import { Injectable } from '@nestjs/common';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
@Injectable()
export class OrderOfferState extends IOrderState {
  constructor(
    @InjectRepository(HistoryOrder)
    private historyOrderRepository: Repository<HistoryOrder>,
  ) {
    super();
    this.nameState = 'Offer';
  }
  nameState: string;
  changeState(order: Order) {
    order.setState(new OrderInProgressState());
  }
  public confirm(order: Order) {
    this.changeState(order);
    const historyOrderDTO = new HistoryOrderDTO(order);
    this.historyOrderRepository.create(historyOrderDTO);
    this.historyOrderRepository.save(historyOrderDTO);
  }
  public cancel(order: Order) {
    order.setState(new OrderCancelState());
  }
}
