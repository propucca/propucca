import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto, UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/getAll')
  findAll(@Body() getUserDto: GetUserDto) {
    return this.usersService.findAll(getUserDto);
  }

  @Get('/get/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Post('/delete')
  remove(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.remove(deleteUserDto);
  }
}
