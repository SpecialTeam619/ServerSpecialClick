import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateTechniqueTypeDto {
  @ApiProperty({ example: 'CRANE', description: 'Уникальный код типа' })
  @IsString()
  @MaxLength(100)
  code!: string;

  @ApiProperty({ example: 'Автовышка', description: 'Название типа' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'Описание типа', description: 'Описание' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://...', description: 'Фото (url)' })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
