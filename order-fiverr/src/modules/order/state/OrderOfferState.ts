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
@Injectable()
export class OrderOfferState extends IOrderState {
  private paymentStripe: PaymentStripe;
  constructor(
    @InjectRepository(HistoryOrder)
    private historyOrderRepository: Repository<HistoryOrder>,
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
  // kiểm tra xem order đã thanh toán chưa => tiến hành thanh toán => lưu vào csdl
  public async deposit(
    order: Order,
    chargeData: PaymentDTO,
  ): Promise<HistoryOrder> {
    // tạo history nếu tồn tại => đã thanh toán => báo lỗi
    // tạo  history thành công => tiến hành thanh toán => thành công => lưu vào db
    return this.createHistoryOrder(order, 'payment complete')
      .then((result) =>
        this.paymentStripe.charge(chargeData).then((charge) => {
          return this.historyOrderRepository.save(
            result.withpayment(charge.id),
          );
        }),
      )
      .catch(function () {
        throw new HttpException('Order Already Payment ', HttpStatus.FORBIDDEN);
      });
  }

  private async createHistoryOrder(
    order: Order,
    status: string,
  ): Promise<HistoryOrder> {
    const historyOrderDTO = new HistoryOrderDTO(order, status);
    return this.historyOrderRepository.create(historyOrderDTO);
  }
}
