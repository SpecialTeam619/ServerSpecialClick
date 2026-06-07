import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateOrderMessageDto {
  @ApiProperty({
    example: 'Здравствуйте, техника будет на объекте к 09:00.',
    description: 'Текст сообщения в чате заказа',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text!: string;
}
