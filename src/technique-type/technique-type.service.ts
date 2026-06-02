import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/services/CRUD/base-crud.service';
import { NamePrismaModels } from '../prisma/types/name-prisma-models.enum';

@Injectable()
export class TechniqueTypeService extends BaseCrudService<any, any, any, any> {
  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(
      logger,
      prisma.techniqueType as never,
      NamePrismaModels.TECHNIQUE_TYPE,
    );
  }
}
