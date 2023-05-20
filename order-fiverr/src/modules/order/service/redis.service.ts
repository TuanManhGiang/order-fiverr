import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as Redis from 'redis';
import { promisify } from 'util';
@Injectable()
export class RedisService {
  private  client: Redis.RedisClient;
  private  pSubscribeAsync: (pattern: string) => Promise<string>;
  private  channel = `__keyevent@0__:expired`;
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {
  }

  async setCache(key: string, value: any, expiresIn?: number) { 
    const redisValue = JSON.stringify(value);
    await this.cacheService.set(key, redisValue, expiresIn);
  }


  async get(key: string) {
    const redisValue =  await this.cacheService.get(key);
    if (redisValue) {
      return JSON.parse(redisValue as string);
      //return redisValue;
    }
    return null;
  }
  async addDelayEventOrder(orderId: string, delay: number): Promise<void> {
    const redisUrl = '//127.0.0.1:6379';
    this.client = Redis.createClient(redisUrl);
    this.client.config('SET', 'notify-keyspace-events', 'Ex');
    this.pSubscribeAsync = promisify(this.client.psubscribe).bind(this.client);
    
    this.client.set(orderId, 'delayed','Ex',delay);
    // Đăng ký lắng nghe sự kiện hết hạn của key
    this.client.psubscribe(this.channel);
    //Định nghĩa hành động khi nhận được thông báo về sự hết hạn của key
    this.client.on('pmessage', (pattern: string, _channel: string, message: string) => {
      
      if (message === orderId) {
        console.log(`Key ${orderId} đã hết hạn!`);
        // Thực hiện hành động tương ứng khi key hết hạn

      }
      
    });

    this.client.on('error', (err: any) => {
      console.error(err);
    });

  
    //Thiết lập giá trị và thời gian hết hạn cho key

 }
  
  

  async delete(key: string) {
    //const redisClient = await this.redisService.getClient();
    await this.cacheService.del(key);
    await this.client.punsubscribe(this.channel);
    await this.client.del(key);
  }
}
