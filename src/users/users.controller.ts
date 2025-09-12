import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  GetAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  GetOneUser(@Param('id') id: string) {
    return this.usersService.getOneUser(id);
  }

  @Patch('/:id')
  UpdateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete('/:id')
  DeleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
