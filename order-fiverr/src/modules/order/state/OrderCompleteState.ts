import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
import { OrderDTO } from '../DTO/order.dto';
import { PaymentDTO } from 'src/modules/earn/DTO/payment.dto';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import { PaymentStripe } from 'src/modules/earn/payment/stripePayment';
import HistoryOrderDTO from '../DTO/historyOrder.dto';
export class OrderCompleteState extends IOrderState {
  private paymentStripe: PaymentStripe;
  private historyOrderRepository;
  private redisService;
  changeState(): IOrderState {
    return this;
  }

  constructor(historyOrderRepository, redisService) {
    super();
    this.historyOrderRepository = historyOrderRepository;
    this.redisService = redisService;
    this.paymentStripe = new PaymentStripe();
    this.nameState = 'Completed';
  }
  nameState: string;
  private async createHistoryOrder(
    order: OrderDTO,
    status: string,
  ): Promise<HistoryOrder> {
    const historyOrderDTO = new HistoryOrderDTO(order, status);
    return await this.historyOrderRepository.save(historyOrderDTO);
  }
}
