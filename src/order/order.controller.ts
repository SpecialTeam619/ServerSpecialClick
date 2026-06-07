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
import { CreateOrderMessageDto } from './dto/create-order-message.dto';

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
  findAll(
    @User('sub') userId: string,
    @User('role') role: string,
    @Query() query: PaginationDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return this.orderService.findAll(query, userId, role);
  }

  @Get(':id/messages')
  @ApiResponse({
    status: 200,
    description: 'Order chat messages have been successfully retrieved.',
  })
  getMessages(
    @User('sub') userId: string,
    @User('role') role: string,
    @Param('id') id: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return this.orderService.findMessages(id, userId, role);
  }

  @Post(':id/messages')
  @ApiResponse({
    status: 201,
    description: 'Order chat message has been successfully created.',
  })
  createMessage(
    @User('sub') userId: string,
    @User('role') role: string,
    @Param('id') id: string,
    @Body() dto: CreateOrderMessageDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return this.orderService.createMessage(id, dto, userId, role);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(
    @User('sub') userId: string,
    @User('role') role: string,
    @Param('id') id: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return this.orderService.findOne({ id }, userId, role);
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
  update(
    @User('sub') userId: string,
    @User('role') role: string,
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return this.orderService.update({ id }, dto, userId, role);
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
