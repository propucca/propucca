import { CustomLoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IEmailDto } from './dto/email-controller.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private loggerService: CustomLoggerService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendMail(body: IEmailDto): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: body.to,
        subject: body.subject,
        text: body.message,
        html: body.html,
      };

      await this.transporter.sendMail(mailOptions);
      this.loggerService.log(`Email sent successfully to ${body.to}`, {
        functionName: 'sendMail',
        errorCode: '#200',
        logType: 'log',
      });

      return true;
    } catch (err) {
      this.loggerService.log(`Error in Email Layer ${err}`, {
        functionName: 'sendMail',
        errorCode: '#500',
        logType: 'error',
      });
      return false;
    }
  }
}
