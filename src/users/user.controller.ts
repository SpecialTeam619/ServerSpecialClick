import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
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
    return this.userService.findAll(query);
  }

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'The current user has been successfully retrieved.',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      phone: '+79991234567',
      name: 'John Doe',
      role: 'CUSTOMER',
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard)
  getCurrentUser(@User('sub') id: string) {
    return this.userService.findOne({ id });
  }

  @Get('check/phone')
  @ApiResponse({
    status: 200,
    description: 'Check if user exists.',
  })
  isUserExist(@Query('phone') phone: string) {
    return this.userService.isUserExist({ phone });
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      phone: '+79991234567',
      name: 'John Doe',
      role: 'CUSTOMER',
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard)
  update(
    @User('sub') currentUserId: string,
    @User('role') role: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    if (role !== 'ADMIN' && currentUserId !== id) {
      throw new ForbiddenException('You can update only your own profile');
    }

    return this.userService.update({ id }, dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard)
  remove(
    @User('sub') currentUserId: string,
    @User('role') role: string,
    @Param('id') id: string,
  ) {
    if (role !== 'ADMIN' && currentUserId !== id) {
      throw new ForbiddenException('You can delete only your own profile');
    }

    return this.userService.remove({ id });
  }
}
