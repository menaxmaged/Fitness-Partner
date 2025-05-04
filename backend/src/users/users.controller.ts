import {
  Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Admin: Get all users
  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  // ✅ Admin: Get single user by ID
  @Get(':id')
  // @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // ✅ Admin: Create a new user manually (not signup)
  @Post('admin')
  @Roles('admin')
  createByAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // ✅ Admin: Update a user's information
  @Put('admin/:id')
  @Roles('admin')
  async updateByAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  
  // ✅ Admin: Delete a user
  @Delete('admin/:id')
  @Roles('admin')
  async deleteByAdmin(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // 👤 User: Update own profile (no admin role needed)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // 👤 User: Update own password
  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() passwordUpdateDto: { currentPassword: string; newPassword: string },
    @Req() request,
  ) {
    const requestingUserId = request.user.userId;
    return this.usersService.updatePassword(
      id,
      passwordUpdateDto.currentPassword,
      passwordUpdateDto.newPassword,
    );
  }

  // 👤 User: Delete own account
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/orders')
async addOrder(@Param('id') id: string, @Body() order: any) {
  return this.usersService.addOrder(id, order);
}

//////

@Put('admin/:id/role')
@Roles('admin')
async updateUserRoleByAdmin(
  @Param('id') id: string,
  @Body() dto: { role: 'user' | 'admin' | 'moderator' }
) {
  return this.usersService.updateRoleByAdmin(id, dto.role);
}

@Get('admin/order-stats')
@Roles('admin')
getOrderStats() {
  return this.usersService.getOrderStats();
}

@Get('admin/orders')
@Roles('admin')
getAllOrders() {
  return this.usersService.getAllOrders();
}

@Delete('admin/orders/:userId/:orderId')
@Roles('admin')
async cancelOrder(
  @Param('userId') userId: string,
  @Param('orderId') orderId: string
) {
  return this.usersService.cancelOrder(userId, orderId);
}

@Put('admin/orders/:userId/:orderId')
@Roles('admin')
async updateOrder(
  @Param('userId') userId: string,
  @Param('orderId') orderId: string,
  @Body() updateOrderDto: any
) {
  return this.usersService.updateOrder(userId, orderId, updateOrderDto);
}
}
