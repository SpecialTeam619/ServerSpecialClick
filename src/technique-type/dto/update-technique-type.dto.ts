import { PartialType } from '@nestjs/swagger';
import { CreateTechniqueTypeDto } from './create-technique-type.dto';

export class UpdateTechniqueTypeDto extends PartialType(
  CreateTechniqueTypeDto,
) {}
