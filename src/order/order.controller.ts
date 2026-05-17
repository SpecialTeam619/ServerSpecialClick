import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/auth.guard';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../auth/user.decorator';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
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
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne({ id });
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@User('sub') customerId: string, @Body() dto: CreateOrderDto) {
    if (!customerId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return this.orderService.createOrder(dto, customerId);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update({ id }, dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  remove(@Param('id') id: string) {
    return this.orderService.remove({ id });
  }
}
