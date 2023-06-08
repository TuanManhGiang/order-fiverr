import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
import { OrderCompleteState } from './OrderCompleteState';
import { OrderDTO } from '../DTO/order.dto';
import { StateService } from '../service/stateService.service';
import { PaymentStripe } from '../../earn/payment/stripePayment';
import { PaymentDTO } from '../../earn/DTO/payment.dto';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import HistoryOrderDTO from '../DTO/historyOrder.dto';

export class OrderDelivery extends IOrderState {
  private historyOrderRepository;
  private redisService;
  private paymentStripe: PaymentStripe;
  constructor(historyOrderRepository, redisService) {
    super();
    this.historyOrderRepository = historyOrderRepository;
    this.paymentStripe = new PaymentStripe();
    this.redisService = redisService;
    this.nameState = 'Delivery';
  }
  public async payment(
    order: OrderDTO,
    chargeData: PaymentDTO,
  ): Promise<HistoryOrder> {
    await this.paymentStripe.payment(chargeData);
    this.changeState(order);
    return this.createHistoryOrder(order, 'Complete');
  }

  nameState: string;
  public changeState(order: OrderDTO): IOrderState {
    order.status = 'Completed';
    return new OrderCompleteState(
      this.historyOrderRepository,
      this.redisService,
    );
  }

  private async createHistoryOrder(
    order: OrderDTO,
    status: string,
  ): Promise<HistoryOrder> {
    const historyOrderDTO = new HistoryOrderDTO(order, status);
    return await this.historyOrderRepository.save(historyOrderDTO);
  }
}
