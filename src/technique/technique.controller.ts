import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UpdateTechniqueDto } from './dto/update-technique.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { TechniqueService } from './technique.service';
import { CreateTechniqueDto } from './dto/create-technique.dto';

type AuthenticatedRequest = Request & {
  user?: {
    sub?: string;
  };
};

@ApiTags('techniques')
@Controller('techniques')
@UseGuards(AuthGuard)
export class TechniqueController {
  constructor(private readonly techniqueService: TechniqueService) {}
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Предметов на странице',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'createdAt',
    description: 'Поле для сортировки',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'asc',
    description: 'Направление сортировки',
    enum: ['asc', 'desc'],
  })
  findAll(@Query() query: PaginationDto) {
    return this.techniqueService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The technique has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Technique not found.' })
  findOne(@Param('id') id: string) {
    return this.techniqueService.findOne({ id });
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The technique has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTechniqueDto) {
    const ownerId = req.user?.sub;

    if (!ownerId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return this.techniqueService.createTechnique(dto, ownerId);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The technique has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Technique not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateTechniqueDto) {
    return this.techniqueService.update({ id }, dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The technique has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Technique not found.' })
  remove(@Param('id') id: string) {
    return this.techniqueService.remove({ id });
  }
}
