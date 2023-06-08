import { PaymentDTO } from 'src/modules/earn/DTO/payment.dto';
import { OrderDTO } from '../DTO/order.dto';
import { IOrderState } from '../state/IOrderState';
import { HistoryOrder } from '../model/history-order.entity/history-order.entity';
import { OrderInProgressState } from '../state/OrderInProgressState';
import { Order } from '../model/order.entity/order.entity';
import { OrderOfferState } from '../state/OrderOfferState';
import { OrderCompleteState } from '../state/OrderCompleteState';
import { OrderCancelState } from '../state/OrderCancelState';
import { OrderDelivery } from '../state/OrderDelivery';
export class StateService {
  private state: IOrderState;
  private historyOrderRepository;
  private redisService;
  private setStateByStatus(status: string): IOrderState {
    const stateStatus = {
      Offer: new OrderOfferState(
        this.historyOrderRepository,
        this.redisService,
      ),
      Completed: new OrderCompleteState(
        this.historyOrderRepository,
        this.redisService,
      ),
      Cancel: new OrderCancelState(
        this.historyOrderRepository,
        this.redisService,
      ),
      Inprogress: new OrderInProgressState(
        this.historyOrderRepository,
        this.redisService,
      ),
      Delivery: new OrderDelivery(
        this.historyOrderRepository,
        this.redisService,
      ),
    };
    return stateStatus[status];
  }
  public getState(): IOrderState {
    return this.state;
  }
  public setState(state: IOrderState) {
    //thay đổi trạng thái và thực thi logic ứng với mỗi trạng thái
    this.state = state;
  }
  constructor(order: OrderDTO, historyOrderRepository, redisService) {
    this.historyOrderRepository = historyOrderRepository;
    this.redisService = redisService;
    this.state = this.setStateByStatus(order.status);
  }
  public changeState(order: OrderDTO) {
    this.state = this.state.changeState(order);
  }
  public confirm(order: OrderDTO) {
    console.log(order.status);
    this.state.confirm(order);
  }
  private complete(order: OrderDTO) {}
  public cancel(order: OrderDTO) {
    this.state.cancel(order);
  }

  public async payment(chargeData: PaymentDTO, order: OrderDTO): Promise<any> {
    return await this.state.payment(order, chargeData);
  }
  public delivery(order: OrderDTO) {
    this.state.delivery(order);
  }

  public async deposit(
    chargeData: PaymentDTO,
    order: OrderDTO,
  ): Promise<HistoryOrder> {
    return await this.state.deposit(order, chargeData);
  }
}
