import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PaginatedResponse,
  PaginationParams,
} from '../../interface/paginated.interface';
import type { CrudPrismaModel } from '../../../prisma/types/prisma.types';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export abstract class BaseCrudService<
  Entity,
  CreateDto,
  UpdateDto,
  WhereUniqInput,
> {
  constructor(
    protected readonly logger: PinoLogger,
    protected readonly model: CrudPrismaModel<
      WhereUniqInput,
      CreateDto,
      UpdateDto
    >,
    protected readonly entityName: string, // jast name
  ) {}

  private logAction(action: string, data?: Record<string, any>) {
    this.logger.info(
      {
        entity: this.entityName,
        action,
        ...data,
      },
      `${this.entityName} ${action.toLowerCase()}`,
    );
  }

  async findAll(
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<Entity>> {
    this.logAction('FIND_ALL', { params });

    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        skip,
        take: limit,
      }),
      this.model.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: data as Entity[],
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

  async findOne(where: WhereUniqInput): Promise<Entity> {
    this.logAction('FIND_ONE', { where });
    const entity = (await this.model.findUnique({
      where,
    })) as Entity | null;

    if (!entity) {
      this.logger.warn(
        { entity: this.entityName, where },
        `${this.entityName} not found`,
      );
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return entity as Entity;
  }

  async create(createDto: CreateDto): Promise<Entity> {
    const result = (await this.model.create({
      data: createDto,
    })) as Entity;

    this.logAction('CREATE', {
      id: (result as { id: string }).id,
    });
    return result;
  }

  async update(where: WhereUniqInput, updateDto: UpdateDto): Promise<Entity> {
    this.logAction('UPDATE', { where });
    return this.model.update({
      where,
      data: updateDto,
    }) as Promise<Entity>;
  }

  async remove(where: WhereUniqInput): Promise<Entity> {
    this.logAction('DELETE', { where });
    return this.model.delete({
      where,
    }) as Promise<Entity>;
  }
}
