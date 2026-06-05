import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsString, MaxLength } from 'class-validator';
import { PaymentMode } from '../../generated/prisma/client';

export class CreateOrderDto {
  @ApiProperty({
    example: 'f6e9d5a5-5ad5-4f4d-8b2b-9794b062f2d4',
    description: 'ID арендуемой техники',
  })
  @IsString()
  @MaxLength(255)
  techniqueId!: string;

  @ApiProperty({
    example: 'г. Москва, ул. Строителей, 10',
    description: 'Адрес объекта, куда должна приехать техника',
  })
  @IsString()
  @MaxLength(500)
  objectAddress!: string;

  @ApiProperty({
    example: '2026-06-10T09:00:00.000Z',
    description: 'Дата и время прибытия техники в ISO формате',
  })
  @IsISO8601()
  arrivalAt!: string;

  @ApiProperty({
    example: PaymentMode.SHIFT_7_PLUS_1,
    enum: PaymentMode,
    description: 'Режим оплаты',
  })
  @IsString()
  @IsIn([PaymentMode.SHIFT_7_PLUS_1, PaymentMode.HOURLY])
  paymentMode!: PaymentMode;
}
