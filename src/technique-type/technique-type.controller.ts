import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TechniqueTypeService } from './technique-type.service';
import { CreateTechniqueTypeDto } from './dto/create-technique-type.dto';
import { UpdateTechniqueTypeDto } from './dto/update-technique-type.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../generated/prisma/client';

@ApiTags('technique-types')
@Controller('technique-types')
@UseGuards(AuthGuard, RolesGuard)
export class TechniqueTypeController {
  constructor(private readonly service: TechniqueTypeService) {}

  @Get()
  findAll() {
    return this.service.findAll({ page: 1, limit: 1000 });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne({ id });
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateTechniqueTypeDto) {
    return this.service.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTechniqueTypeDto) {
    return this.service.update({ id }, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove({ id });
  }
}
