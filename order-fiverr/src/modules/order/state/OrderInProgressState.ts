import { HttpException, HttpStatus } from '@nestjs/common';
import { Order } from '../model/order.entity/order.entity';
import { IOrderState } from './IOrderState';
import { OrderCompleteState } from './OrderCompleteState';
import { OrderDTO } from '../DTO/order.dto';
import { StateService } from '../service/stateService.service';
import { PaymentStripe } from 'src/modules/earn/payment/stripePayment';
import { PaymentDTO } from 'src/modules/earn/DTO/payment.dto';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import HistoryOrderDTO from '../DTO/historyOrder.dto';
import { OrderDelivery } from './OrderDelivery';
import * as nodemailer from 'nodemailer';

export class OrderInProgressState extends IOrderState {
  private historyOrderRepository;
  private redisService;
  private paymentStripe: PaymentStripe;
  constructor(historyOrderRepository, redisService) {
    super();
    this.historyOrderRepository = historyOrderRepository;
    this.paymentStripe = new PaymentStripe();
    this.redisService = redisService;
    this.nameState = 'Inprogress';
  }
  public delivery(order: OrderDTO) {
    //this.redisService.addDelayEventCompleteOrder(order, 1 * 60, chargeData);

    this.changeState(order);
  }
  nameState: string;
  public changeState(order: OrderDTO): IOrderState {
    order.status = 'Delivery';
    return new OrderDelivery(this.historyOrderRepository, this.redisService);
  }

  private async createHistoryOrder(
    order: OrderDTO,
    status: string,
  ): Promise<HistoryOrder> {
    const historyOrderDTO = new HistoryOrderDTO(order, status);
    return await this.historyOrderRepository.save(historyOrderDTO);
  }
  private async sendMail(order: OrderDTO) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tuan.giangmanh@gmail.com',
        pass: process.env.PasswordEmail,
      },
    });

    const mailOptions = {
      from: 'tuan.giangmanh@gmail.com',
      to: order.customerID,
      subject: `đơn hàng từ ${order.FreelancerID} trên fiverr đã được giao`,
      text: ``,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
