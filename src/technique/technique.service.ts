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
  protected readonly prisma: PrismaService;

  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(prisma, logger);
    this.prisma = prisma;
  }

  async createTechnique(
    createDto: CreateTechniqueDto,
    ownerId: string,
  ): Promise<Technique> {
    return this.prisma.technique.create({
      data: {
        ...createDto,
        ownerId,
      },
      include: { techniqueType: true },
    }) as unknown as Technique;
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponse<Technique>> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.technique.findMany({
        skip,
        take: limit,
        include: { techniqueType: true },
      }),
      this.prisma.technique.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: data as unknown as Technique[],
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: Prisma.TechniqueWhereUniqueInput): Promise<Technique> {
    const entity = await this.prisma.technique.findUnique({
      where: id,
      include: { techniqueType: true },
    });
    if (!entity) {
      throw new Error('Technique not found');
    }
    return entity as unknown as Technique;
  }

  async update(
    id: Prisma.TechniqueWhereUniqueInput,
    updateDto: UpdateTechniqueDto,
  ): Promise<Technique> {
    const result = await this.prisma.technique.update({
      where: id,
      data: updateDto as any,
      include: { techniqueType: true },
    });
    return result as unknown as Technique;
  }

  async remove(id: Prisma.TechniqueWhereUniqueInput): Promise<Technique> {
    const result = await this.prisma.technique.delete({
      where: id,
      include: { techniqueType: true },
    });
    return result as unknown as Technique;
  }
}
