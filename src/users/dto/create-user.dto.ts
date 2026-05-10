import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../generated/prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: '+79991234567',
    description: 'The phone number of the user',
  })
  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsPhoneNumber('RU', { message: 'Номер телефона должен быть валидным' })
  phone!: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(4, { message: 'Имя слишком короткое' })
  name!: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль слишком короткий' })
  password!: string;

  @ApiProperty({
    enum: Role,
    required: false,
    example: Role.CUSTOMER,
    description: 'The role of the user',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Роль должна быть одним из допустимых значений' })
  role?: Role;
}
