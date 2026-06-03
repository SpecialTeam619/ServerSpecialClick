import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'f6e9d5a5-5ad5-4f4d-8b2b-9794b062f2d4',
    description: 'ID арендуемой техники',
  })
  @IsString()
  @MaxLength(255)
  techniqueId!: string;
}
