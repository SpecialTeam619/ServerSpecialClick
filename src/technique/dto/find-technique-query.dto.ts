import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindTechniqueQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'f6e9d5a5-5ad5-4f4d-8b2b-9794b062f2d4',
    description: 'Фильтр по типу техники',
  })
  @IsOptional()
  @IsString({ message: 'techniqueTypeId must be a string' })
  @MaxLength(255, { message: 'techniqueTypeId is too long' })
  techniqueTypeId?: string;
}
