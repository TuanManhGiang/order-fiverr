import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { get } from 'http';
import { OrderDTO } from '../DTO/order.dto';
import { Order } from '../model/order.entity/order.entity';
import { OrderService } from '../service/order.service';
//import the cache manager
import { Cache } from 'cache-manager';
import { RedisService } from '../service/redis.service';
import { StringDecoder } from 'string_decoder';
const crypto = require('crypto');
@Controller('orders')
export class OrderController {
  randomNumDbs = Math.floor(Math.random() * 10);
  constructor(
    private readonly orderService: OrderService,
    private readonly redisService: RedisService,
  ) {}

  @Post('/create')
  async createOrder(@Body() orderDTO: OrderDTO): Promise<OrderDTO> {
    const newOrder = await this.orderService.createOrder(orderDTO);

    const idempotencyKey = crypto.randomBytes(32).toString('hex');
    await this.redisService.setCache(
      newOrder.id + '',
      idempotencyKey,
      2000 * 60 * 60,
    );

    await this.redisService.addDelayEventOrder(
      (await newOrder.id) + '',
      1 * 60 * 60,
    );
    console.log(
      'create order ' + newOrder.id + ', The order will expire after 1 hour',
    );
    return newOrder;
  }

  @Get('find/:id') //slug
  async findOne(@Param('id') id: number): Promise<OrderDTO> {
    const order = this.orderService.findById(id);
    return order;
  }
  @Get('find-orders-customer/:id') //slug
  async findOneByCustomerID(@Param('id') id: string): Promise<OrderDTO[]> {
    const order = await this.orderService.findByCustomerID(id);
    return order;
  }
  @Get('find-order/:id/customer/:customerID') //slug
  async findOrderDetailByID(
    @Param('id') id: number,
    @Param('customerID') customerid: string,
  ): Promise<OrderDTO> {
    const order = await this.orderService.findOrderDetailByID(id, customerid);
    return order[0];
  }
  @Get('find-orders-freelancer/:id') //slug
  async findOneByFreelancerID(@Param('id') id: string): Promise<OrderDTO[]> {
    const order = await this.orderService.findByFreelancerID(id);
    return order;
  }
  @Get('find-order/:id/freelancer/:freelancerID') //slug
  async findOrderDetailByFreelancerID(
    @Param('id') id: number,
    @Param('freelancerID') freelancerid: string,
  ): Promise<OrderDTO> {
    const order = await this.orderService.findOrderDetailByFreelancerID(
      id,
      freelancerid,
    );
    return order[0];
  }

  @Get(':id/confirm')
  async confirm(@Param('id') id: number): Promise<OrderDTO> {
    // if (!this.orderService.checkPermission(id, orderID)) {
    //   throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    // }
    return this.orderService.confirm(id);
  }
  @Get(':id/cancel')
  async cancel(@Param('id') id: number): Promise<OrderDTO> {
    return this.orderService.cancel(id);
  }
}
