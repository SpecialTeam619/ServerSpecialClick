import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTechniqueDto } from './dto/update-technique.dto';
import { Technique } from './technique.entity';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResponse } from '../common/interface/paginated.interface';
import { PinoLogger } from 'nestjs-pino';
import { TechniqueCrudService } from './technique-crud.service';
import { FindTechniqueQueryDto } from './dto/find-technique-query.dto';
import { CreateTechniqueDto } from './dto/create-technique.dto';

@Injectable()
export class TechniqueService extends TechniqueCrudService {
  protected readonly prisma: PrismaService;

  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(prisma, logger);
    this.prisma = prisma;
  }

  createTechnique(createDto: CreateTechniqueDto, ownerId: string): Technique {
    return this.prisma.technique.create({
      data: {
        ...createDto,
        ownerId,
      },
      include: { techniqueType: true },
    }) as unknown as Technique;
  }

  async findAll(
    query: FindTechniqueQueryDto,
  ): Promise<PaginatedResponse<Technique>> {
    const { page = 1, limit = 10, techniqueTypeId } = query;
    const skip = (page - 1) * limit;
    const where = techniqueTypeId ? { techniqueTypeId } : undefined;

    const [data, total] = await Promise.all([
      this.prisma.technique.findMany({
        where,
        skip,
        take: limit,
        include: {
          techniqueType: true,
          owner: {
            select: { id: true, name: true, phone: true, role: true },
          },
        },
      }),
      this.prisma.technique.count({ where }),
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
      include: {
        techniqueType: true,
        owner: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
    });
    if (!entity) {
      throw new NotFoundException('Technique not found');
    }
    return entity as unknown as Technique;
  }

  async updateTechnique(
    id: Prisma.TechniqueWhereUniqueInput,
    updateDto: UpdateTechniqueDto,
    ownerId: string,
  ): Promise<Technique> {
    const technique = await this.prisma.technique.findUnique({
      where: id,
      select: { ownerId: true },
    });

    if (!technique) {
      throw new NotFoundException('Technique not found');
    }

    if (technique.ownerId !== ownerId) {
      throw new ForbiddenException('You can update only your own technique');
    }

    const data: Prisma.TechniqueUpdateInput = {};

    if (typeof updateDto.name !== 'undefined') {
      data.name = updateDto.name;
    }

    if (typeof updateDto.description !== 'undefined') {
      data.description = updateDto.description;
    }

    if (typeof updateDto.techniqueTypeId !== 'undefined') {
      data.techniqueType = {
        connect: { id: updateDto.techniqueTypeId },
      };
    }

    if (typeof updateDto.property !== 'undefined') {
      data.property = { set: updateDto.property };
    }

    if (typeof updateDto.photoUrl !== 'undefined') {
      data.photoUrl = updateDto.photoUrl;
    }

    const result = await this.prisma.technique.update({
      where: id,
      data,
      include: {
        techniqueType: true,
        owner: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
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

  async removeTechnique(
    id: Prisma.TechniqueWhereUniqueInput,
    ownerId: string,
  ): Promise<Technique> {
    const technique = await this.prisma.technique.findUnique({
      where: id,
      select: { ownerId: true },
    });

    if (!technique) {
      throw new NotFoundException('Technique not found');
    }

    if (technique.ownerId !== ownerId) {
      throw new ForbiddenException('You can delete only your own technique');
    }

    const result = await this.prisma.technique.delete({
      where: id,
      include: { techniqueType: true },
    });

    return result as unknown as Technique;
  }
}
