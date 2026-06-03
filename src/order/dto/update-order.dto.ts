import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export const ORDER_STATUSES = [
  'AWAITING',
  'REJECTED',
  'ON_THE_WAY',
  'IN_PROGRESS',
  'COMPLETED',
] as const;

export type OrderStatusDto = (typeof ORDER_STATUSES)[number];

export class UpdateOrderDto {
  @ApiProperty({
    example: 'ON_THE_WAY',
    enum: ORDER_STATUSES,
    description: 'The status of the order.',
  })
  @IsString()
  @IsIn(ORDER_STATUSES)
  status!: OrderStatusDto;
}
