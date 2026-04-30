export type CrudPrismaModel<WhereUniqInput, CreateDto, UpdateDto> = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: { where: WhereUniqInput }) => Promise<any>;
  create: (args: { data: CreateDto }) => Promise<any>;
  update: (args: { where: WhereUniqInput; data: UpdateDto }) => Promise<any>;
  delete: (args: { where: WhereUniqInput }) => Promise<any>;
  count: (args?: any) => Promise<number>;
};
