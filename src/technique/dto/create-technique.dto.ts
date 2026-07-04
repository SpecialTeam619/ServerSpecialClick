import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

function toInt(value: unknown): unknown {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }

  return value;
}

export class CreateTechniqueDto {
  @ApiProperty({
    example: 'Экскаватор',
    description: 'Название техники',
  })
  @IsString({ message: 'Название должно быть строкой' })
  @MaxLength(255, { message: 'Название слишком длинное' })
  name!: string;

  @ApiProperty({
    example: 'Автовышка',
    description: 'Тип техники',
  })
  @ApiProperty({
    example: 'f6e9d5a5-5ad5-4f4d-8b2b-9794b062f2d4',
    description: 'ID типа техники (techniqueTypeId)',
  })
  @IsString({ message: 'ID типа должен быть строкой' })
  @MaxLength(255, { message: 'ID типа слишком длинный' })
  techniqueTypeId!: string;

  @ApiProperty({
    example:
      'Эта техника поможет вам завершить проект вовремя и с высоким качеством',
    description: 'Описание техники',
  })
  @IsString({ message: 'Описание должно быть строкой' })
  description!: string;

  @ApiProperty({
    example: 2500,
    description: 'Стоимость аренды в рублях за час',
  })
  @Transform(({ value }) => toInt(value))
  @Type(() => Number)
  @IsInt({ message: 'Цена должна быть целым числом' })
  @Min(1, { message: 'Цена должна быть больше 0' })
  pricePerHour!: number;

  @ApiProperty({
    example: ['property1', 'property2'],
    description: 'Свойства техники',
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return [value];
    }

    return value;
  })
  @IsArray({ message: 'Свойства должны быть массивом строк' })
  @ArrayMinSize(1, { message: 'Нужно указать хотя бы одно свойство' })
  @IsString({ each: true, message: 'Каждое свойство должно быть строкой' })
  @MaxLength(255, {
    each: true,
    message: 'Каждое свойство не должно превышать 255 символов',
  })
  property!: string[];

  @ApiProperty({
    example: 'http://localhost:3000/static/technique-photo.jpg',
    description: 'URL изображения техники',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'URL изображения должен быть строкой' })
  photoUrl?: string;
}
