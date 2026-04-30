import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Неверно указан email' })
  email?: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
