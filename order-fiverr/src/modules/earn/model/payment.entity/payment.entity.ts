import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  currency: string;
  @Column()
  source: string;
  @Column()
  description: string;
}
