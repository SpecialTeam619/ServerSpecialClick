import { PaginatedResponse, PaginationParams } from './paginated.interface';

export interface ICrudService<T, CreateDto, UpdeteDto> {
  findAll(params: PaginationParams): Promise<PaginatedResponse<T>>;
  findOne(id: number): Promise<T | null>;
  create(createDto, CreateDto): Promise<T>;
  update(id: number, updateDto, UpdateDto): Promise<T>;
  remove(id: number): Promise<T>;
}
