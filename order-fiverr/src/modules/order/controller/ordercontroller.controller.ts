import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { get } from 'http';
import { OrderDTO } from '../DTO/order.dto';
import { Order } from '../model/order.entity/order.entity';
import { OrderService } from '../service/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  async createOrder(@Body() orderDTO: OrderDTO): Promise<Order> {
    return this.orderService.createOrder(orderDTO);
  }
  @Get(':id') //slug
  async findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findById(id);
  }
  @Get(':id/confirm')
  async confirm(@Param('id') id: number): Promise<Order> {
    // if (!this.orderService.checkPermission(id, orderID)) {
    //   throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    // }
    return this.orderService.confirm(id);
  }
  @Get(':id/cancel')
  async cancel(@Param('id') id: number): Promise<Order> {
    return this.orderService.cancel(id);
  }
}
