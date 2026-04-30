import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateTechniqueDto {
  @ApiPropertyOptional({
    example: 'f6e9d5a5-5ad5-4f4d-8b2b-9794b062f2d4',
    description: 'ID владельца техники',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ownerId должен быть UUID v4' })
  ownerId?: string;

  @ApiPropertyOptional({
    example: 'Finish the project',
    description: 'Название техники',
  })
  @IsOptional()
  @IsString({ message: 'Название должно быть строкой' })
  @MaxLength(255, { message: 'Название слишком длинное' })
  name?: string;

  @ApiPropertyOptional({
    example: 'Implement todo CRUD endpoints',
    description: 'Описание техники',
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @ApiPropertyOptional({
    example: 'IN-STOCK',
    description: 'Статус техники',
    enum: ['IN-STOCK', 'RENTED'],
  })
  @IsOptional()
  @IsString({ message: 'Статус должен быть строкой' })
  @IsIn(['IN-STOCK', 'RENTED'], {
    message: 'Статус должен быть одним из: IN-STOCK, RENTED',
  })
  status?: string;

  @ApiPropertyOptional({
    example: ['property1', 'property2'],
    description: 'Свойства техники',
  })
  @IsOptional()
  @IsArray({ message: 'Свойства должны быть массивом строк' })
  @ArrayMinSize(1, { message: 'Нужно указать хотя бы одно свойство' })
  @IsString({ each: true, message: 'Каждое свойство должно быть строкой' })
  @MaxLength(255, {
    each: true,
    message: 'Каждое свойство не должно превышать 255 символов',
  })
  property?: string[];
}
