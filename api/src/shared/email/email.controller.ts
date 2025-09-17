import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { IEmailDto } from './dto/email-controller.dto';

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) { }

    @Post('/send-email')
    async sendEmail(@Body() body:IEmailDto): Promise<any> {
        return this.emailService.sendMail(body);
    }
}
