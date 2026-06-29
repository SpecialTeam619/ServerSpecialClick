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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTechniqueDto } from './dto/update-technique.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindTechniqueQueryDto } from './dto/find-technique-query.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { TechniqueService } from './technique.service';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { Role } from '../generated/prisma/browser';
import { Roles } from '../auth/roles.decorator';
import { extname, join } from 'path';
import { mkdirSync, renameSync } from 'fs';

const uploadsPath = join(__dirname, '..', '..', '..', 'uploads');
mkdirSync(uploadsPath, { recursive: true });

type UploadedImageFile = {
  mimetype: string;
  originalname: string;
  filename: string;
  path: string;
};

const imageFileFilter = (
  _req: Request,
  file: UploadedImageFile,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.startsWith('image/')) {
    callback(new BadRequestException('Only image files are allowed'), false);
    return;
  }

  callback(null, true);
};

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
    name: 'techniqueTypeId',
    required: false,
    example: 'f6e9d5a5-5ad5-4f4d-8b2b-9794b062f2d4',
    description: 'Фильтр по типу техники',
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
  findAll(@Query() query: FindTechniqueQueryDto) {
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
  @Roles(Role.LESSOR)
  @UseInterceptors(
    FileInterceptor('image', {
      dest: uploadsPath,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTechniqueDto,
    @UploadedFile() image?: UploadedImageFile,
  ) {
    const ownerId = req.user?.sub;

    if (!ownerId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (image) {
      const extension = extname(image.originalname);
      const fileName = extension
        ? `technique-${image.filename}${extension}`
        : image.filename;

      if (fileName !== image.filename) {
        renameSync(image.path, join(uploadsPath, fileName));
      }

      dto.photoUrl = `${req.protocol}://${req.get('host')}/static/${fileName}`;
    }

    return this.techniqueService.createTechnique(dto, ownerId);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The technique has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Technique not found.' })
  @Roles(Role.LESSOR)
  @UseInterceptors(
    FileInterceptor('image', {
      dest: uploadsPath,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTechniqueDto,
    @UploadedFile() image?: UploadedImageFile,
  ) {
    const ownerId = req.user?.sub;

    if (!ownerId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (image) {
      const extension = extname(image.originalname);
      const fileName = extension
        ? `technique-${image.filename}${extension}`
        : image.filename;

      if (fileName !== image.filename) {
        renameSync(image.path, join(uploadsPath, fileName));
      }

      dto.photoUrl = `${req.protocol}://${req.get('host')}/static/${fileName}`;
    }

    return this.techniqueService.updateTechnique({ id }, dto, ownerId);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The technique has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Technique not found.' })
  @Roles(Role.LESSOR)
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const ownerId = req.user?.sub;

    if (!ownerId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return this.techniqueService.removeTechnique({ id }, ownerId);
  }
}
