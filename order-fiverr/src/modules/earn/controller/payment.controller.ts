import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { Order } from 'src/modules/order/model/order.entity/order.entity';
import { PaymentService } from '../service/payment.service';
import { PaymentDTO } from '../DTO/payment.dto';
import Stripe from 'stripe';
import { HistoryOrder } from 'src/modules/order/model/history-order.entity/history-order.entity';
import { OrderDTO } from 'src/modules/order/DTO/order.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService, // private readonly orderService: OrderService,
  ) {}
  /* paymentIntent.ts
   export const paymentIntent = async <T>(
    url: string,
    cartTotal: number
  )
  : Promise<T> => {
    sucess_url="/"
    cancel_url=""
    const res = await fetch('payment/:id/deposit', {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        amount: cartTotal*100
        success_url:""
        cancel_url:""
      })
    });

    const {client_secret: clientSecret} = await res.json();
    return await clientSecret;
  }
  */
  @Post(':id/deposit') //tạo history order => thanh toán
  async deposit(
    @Body() body: PaymentDTO,
    @Param('id') id: number,
  ): Promise<HistoryOrder> {
    return this.paymentService.deposit(id, body);
  }

  @Post(':id/payment') //tạo history order => thanh toán
  async payment(
    @Body() body: PaymentDTO,
    @Param('id') id: number,
  ): Promise<HistoryOrder> {
    return this.paymentService.payment(id, body);
  }
  @Get(':id/delivery')
  async confirm(@Param('id') id: number): Promise<OrderDTO> {
    return this.paymentService.delivery(id);
  }
}
