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
  async createOrder(@Body() orderDTO: OrderDTO): Promise<Order> {
    const newOrder = await this.orderService.createOrder(orderDTO);
    const iDempotencyKey = crypto.randomBytes(32).toString('hex');
    await this.redisService.setCache( newOrder.id + '', iDempotencyKey,2000*60*60);
    await this.redisService.addDelayEventOrder(newOrder.id + '',1*60/*60*/);
    return newOrder;
  }
  

  @Get('find/:id') //slug
  async findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findById(id);
  }
  @Get('/get-number-cache')
  async getNumber(): Promise<any> {
    const val = await this.redisService.get('number');
    if (val) {
      return {
        data: val,
        FromRedis: 'this is loaded from redis cache',
      };
    }

    if (!val) {
      await this.redisService.setCache('number', this.randomNumDbs);
      return {
        data: this.randomNumDbs,
        FromRandomNumDbs: 'this is loaded from randomNumDbs',
      };
    }
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
