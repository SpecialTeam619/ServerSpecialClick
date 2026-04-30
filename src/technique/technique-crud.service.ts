import { PinoLogger } from 'nestjs-pino';
import { BaseCrudService } from '../common/services/CRUD/base-crud.service';
import { Prisma, Technique } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NamePrismaModels } from '../prisma/types/name-prisma-models.enum';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { UpdateTechniqueDto } from './dto/update-technique.dto';

export abstract class TechniqueCrudService extends BaseCrudService<
  Technique,
  CreateTechniqueDto & { ownerId: string },
  UpdateTechniqueDto,
  Prisma.TechniqueWhereUniqueInput
> {
  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(logger, prisma.technique as never, NamePrismaModels.TECHNIQUE);
  }
}
