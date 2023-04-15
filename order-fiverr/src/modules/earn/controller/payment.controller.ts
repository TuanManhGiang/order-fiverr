import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Order } from 'src/modules/order/model/order.entity/order.entity';
import { PaymentService } from '../service/payment.service';
import { OrderService } from 'src/modules/order/service/order.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}
  @Post('/deposit/:orderId') //slug
  async deposit(
    @Param('orderId') orderId: number,
    @Body() paymentDTO,
  ): Promise<Order> {
    const order = this.orderService.findById(orderId);
    this.paymentService.deposit(await order);
    return;
  }
}
