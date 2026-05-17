import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    example: 'AWAITING',
    description: 'The status of the order.',
  })
  @IsString()
  status?: string;
}
