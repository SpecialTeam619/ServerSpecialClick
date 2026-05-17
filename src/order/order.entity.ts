import { ApiProperty } from '@nestjs/swagger';
import { StatusOrder } from '../generated/prisma/browser';

export class Order {
  id: any;
  constructor(
    private readonly _customerId: string,
    private readonly _lessorId: string,
  ) {}

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the customer.',
  })
  get customerId(): string {
    return this._customerId;
  }

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the lessor.',
  })
  get lessorId(): string {
    return this._lessorId;
  }

  @ApiProperty({
    enum: ['AWAITING', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'],
    example: 'AWAITING',
    description: 'The status of the order.',
  })
  status!: StatusOrder;
}
