import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the customer.',
  })
  @IsString()
  @MaxLength(255)
  customerId!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the lessor.',
  })
  @IsString()
  @MaxLength(255)
  lessorId!: string;

  @ApiProperty({
    example: 'AWAITING',
    description: 'The status of the order.',
  })
  @IsString()
  status!: string;
}
