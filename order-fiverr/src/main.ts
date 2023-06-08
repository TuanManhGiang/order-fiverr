import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Redis from 'redis';

async function bootstrap() {
//   const redisUrl = 'redis://127.0.0.1:6379';
//   const client = Redis.createClient(redisUrl);
   const app = await NestFactory.create(AppModule);
//   client.psubscribe('__keyevent@0__:expired');
//   client.on('pmessage', (pattern, channel, message) => {
//     console.log(`message:::::`, message);
//     console.log('Sau khi chung ta co orderID:::', message);
//     //Update trong BD la orderID chua thanh toan...
// })

  await app.listen(8068);
}
bootstrap();
