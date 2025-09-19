import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteUserDto } from 'src/users/dto/update-user.dto';
import { GetRoleDto } from './dto/get-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('/create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get('/getAll')
  findAll(@Body() getRoleDto: GetRoleDto) {
    return this.rolesService.findAll(getRoleDto);
  }

  @Get('/get/:id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post('/update')
  update( @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(updateRoleDto);
  }

  @Post('/delete')
  remove(@Body() deleteUserDto: DeleteUserDto) {
    return this.rolesService.remove(deleteUserDto);
  }
}
