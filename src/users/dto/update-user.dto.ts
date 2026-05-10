import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Role } from '../../generated/prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: '+79991234567',
    description: 'The phone number of the user',
  })
  @IsOptional()
  @IsPhoneNumber('RU', { message: 'Номер телефона должен быть валидным' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.CUSTOMER,
    description: 'The role of the user',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Роль должна быть одним из допустимых значений' })
  role?: Role;
}
