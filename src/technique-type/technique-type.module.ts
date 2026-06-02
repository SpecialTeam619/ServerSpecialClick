import { Module } from '@nestjs/common';
import { TechniqueTypeService } from './technique-type.service';
import { TechniqueTypeController } from './technique-type.controller';

@Module({
  controllers: [TechniqueTypeController],
  providers: [TechniqueTypeService],
  exports: [TechniqueTypeService],
})
export class TechniqueTypeModule {}
