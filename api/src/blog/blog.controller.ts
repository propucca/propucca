import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  IBlogCreate,
  IBlogDelete,
  IBlogGetAll,
  IBlogGetById,
  IBlogUpdate,
} from './dto/blog.controller.dto';
import { BlogService } from './blog.service';
import { LoginGuard } from '@/guards/auth.guard';

@Controller('post')
@UseGuards(LoginGuard)
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post('/getall')
  async getall(@Body() requestBody: IBlogGetAll): Promise<any> {
    return await this.blogService.getAll(requestBody);
  }

  @Post('/getbyid')
  async getById(@Body() requestBody: IBlogGetById): Promise<any> {
    return await this.blogService.getById(requestBody);
  }

  @Post('/create')
  async create(@Body() requestBody: IBlogCreate): Promise<any> {
    return await this.blogService.create(requestBody);
  }

  @Post('/update')
  async update(@Body() requestBody: IBlogUpdate): Promise<any> {
    return await this.blogService.update(requestBody);
  }

  @Post('/delete')
  async delete(@Body() requestBody: IBlogDelete): Promise<any> {
    return await this.blogService.delete(requestBody);
  }
}
