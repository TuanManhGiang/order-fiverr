export class PaymentDTO {
  public amount: number;
  public currency: string;
  public source: string;
  public description: string;
  public success_url: string;
  public cancel_url: string;
}
