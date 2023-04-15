import { Test, TestingModule } from '@nestjs/testing';
import { OrdercontrollerController } from './ordercontroller.controller';

describe('OrdercontrollerController', () => {
  let controller: OrdercontrollerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdercontrollerController],
    }).compile();

    controller = module.get<OrdercontrollerController>(
      OrdercontrollerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
