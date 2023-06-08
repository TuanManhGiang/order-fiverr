import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
import { OrderCompleteState } from './OrderCompleteState';
import { OrderDTO } from '../DTO/order.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import HistoryOrderDTO from '../DTO/historyOrder.dto';

export class OrderCancelState extends IOrderState {
  private historyOrderRepository;
  private redisService;
  public changeState(): IOrderState {
    return this;
  }
  constructor(historyOrderRepository, redisService) {
    super();
    this.historyOrderRepository = historyOrderRepository;
    this.redisService = redisService;
    this.nameState = 'Cancel';
  }
  public cancel(order: OrderDTO): void {
    throw new HttpException('method not implement', HttpStatus.FORBIDDEN);
  }
  public nameState: string;
  private async createHistoryOrder(
    order: OrderDTO,
    status: string,
  ): Promise<HistoryOrder> {
    const historyOrderDTO = new HistoryOrderDTO(order, status);
    return await this.historyOrderRepository.save(historyOrderDTO);
  }
}
