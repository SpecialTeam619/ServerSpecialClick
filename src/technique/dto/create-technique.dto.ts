import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, MaxLength } from 'class-validator';

export class CreateTechniqueDto {
  @ApiProperty({
    example: 'Finish the project',
    description: 'Название техники',
  })
  @IsString({ message: 'Название должно быть строкой' })
  @MaxLength(255, { message: 'Название слишком длинное' })
  name!: string;

  @ApiProperty({
    example: 'Implement todo CRUD endpoints',
    description: 'Описание техники',
  })
  @IsString({ message: 'Описание должно быть строкой' })
  description!: string;

  @ApiProperty({
    example: ['property1', 'property2'],
    description: 'Свойства техники',
  })
  @IsArray({ message: 'Свойства должны быть массивом строк' })
  @ArrayMinSize(1, { message: 'Нужно указать хотя бы одно свойство' })
  @IsString({ each: true, message: 'Каждое свойство должно быть строкой' })
  @MaxLength(255, {
    each: true,
    message: 'Каждое свойство не должно превышать 255 символов',
  })
  property!: string[];
}
