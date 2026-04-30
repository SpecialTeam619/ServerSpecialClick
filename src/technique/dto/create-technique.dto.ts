import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

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
  @IsString({ message: 'Свойства должны быть строкой' })
  property!: string[];
}
