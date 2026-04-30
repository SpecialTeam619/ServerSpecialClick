import { Injectable } from '@nestjs/common';
import { UpdateTechniqueDto } from './dto/update-technique.dto';
import { Technique } from './technique.entity';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResponse } from '../common/interface/paginated.interface';
import { PinoLogger } from 'nestjs-pino';
import { TechniqueCrudService } from './technique-crud.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateTechniqueDto } from './dto/create-technique.dto';

@Injectable()
export class TechniqueService extends TechniqueCrudService {
  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(prisma, logger);
  }

  async createTechnique(
    createDto: CreateTechniqueDto,
    ownerId: string,
  ): Promise<Technique> {
    return super.create({
      ...createDto,
      ownerId,
    });
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponse<Technique>> {
    return super.findAll(query);
  }

  async findOne(id: Prisma.TechniqueWhereUniqueInput): Promise<Technique> {
    return super.findOne(id);
  }

  async update(
    id: Prisma.TechniqueWhereUniqueInput,
    updateDto: UpdateTechniqueDto,
  ): Promise<Technique> {
    return super.update(id, updateDto);
  }

  async remove(id: Prisma.TechniqueWhereUniqueInput): Promise<Technique> {
    return super.remove(id);
  }
}
