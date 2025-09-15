import { Controller, Post, Body } from '@nestjs/common';
import { IBlogGetById } from './dto/home.controller.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @Post('/getall')
  async getall(@Body() requestBody: any): Promise<any> {
    return await this.homeService.getAll();
  }

  @Post('/getbyid')
  async getById(@Body() requestBody: IBlogGetById): Promise<any> {
    return await this.homeService.getById(requestBody);
  }
}
