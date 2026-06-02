import { ApiProperty } from '@nestjs/swagger';
import { StatusTechnique } from '../generated/prisma/client';

export class Technique {
  @ApiProperty({
    example: '9f620dc5-c5ea-4617-873a-3206a245fdf7',
    description: 'ID техники',
  })
  id!: string;

  @ApiProperty({
    example: 'f6e9d5a5-5ad5-4f4d-8b2b-9794b062f2d4',
    description: 'ID владельца техники',
  })
  ownerId!: string;

  @ApiProperty({
    example: 'УРАЛ 4320',
    description: 'Название техники',
  })
  name!: string;

  @ApiProperty({
    example: 'f6e9d5a5-5ad5-4f4d-8b2b-9794b062f2d4',
    description: 'ID типа техники (techniqueTypeId)',
  })
  techniqueTypeId!: string;

  @ApiProperty({
    example: { id: 'id', code: 'CRANE', name: 'Автовышка' },
    description: 'Метаданные типа техники',
  })
  techniqueType?: unknown;

  @ApiProperty({
    example: 'Автовышка 32м с корзиной для подъема людей',
    description: 'Описание техники',
  })
  description!: string;

  @ApiProperty({
    example: ['property1', 'property2'],
    description: 'Свойства техники',
  })
  property!: string[];

  @ApiProperty({
    example: '2026-12-31T23:59:59.000Z',
    description: 'Время создания техники (ISO дата)',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-12-31T23:59:59.000Z',
    description: 'Время последнего обновления техники (ISO дата)',
  })
  updatedAt!: Date;

  @ApiProperty({
    enum: ['IN_STOCK'],
    example: 'IN_STOCK',
    description: 'Статус техники',
  })
  status!: StatusTechnique;
}
