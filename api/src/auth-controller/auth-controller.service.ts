import { Injectable } from '@nestjs/common';

import { IforgetPwdDto, ILoginDto,ISendOtp } from './dto/auth-controller.dto';

import { ResponseMessage } from '@/constants/constants';
import { CustomLoggerService } from '@/logger/logger.service';
import { JwtSign } from '@/jwttoken/jwttoken.service';
import { ICommonResponse } from '@/interface/interfaces';
import { ORMService } from '@/database/orm/orm.service';
import { User,Otp } from '@/database/orm/orm.schema';
import { EncryptionService } from '@/encryption/encryption.service';
import { EmailService } from '@/email/email.service';
import { otpGeneratorService } from '@/utils/otpGenerator.service';


@Injectable()
export class AuthControllerService {

  constructor(
    private logger: CustomLoggerService,
    private orm: ORMService,
    private pwdService: EncryptionService,
    private emailService: EmailService,
    private generateOtp: otpGeneratorService,
  ) {}



  async login(request: ILoginDto): Promise<ICommonResponse<any>> {
    try {
      const user = await this.orm.findOne(
        { email: request.email,is_active: true },
        User,
        [],
        [],
        [],
      );

      if (user === false) {
        this.logger.log(ResponseMessage.userfetchfailed, {
          errorCode: '#400',
          functionName: 'auth/login',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      var userData = user !== null ? user.dataValues : {};
      if (user === null) {
        return {
        success: 0,
        message: ResponseMessage.invalidlogin
      };
      }
      const decryptPwd = await this.pwdService.compare(request.password,userData.password);
        if (decryptPwd !== true) {
          return {
            success: 0,
            message: ResponseMessage.invalidcredentials,
          };
        }

      const token = await JwtSign(userData);

      return {
        success: 1,
        message: ResponseMessage.loginsuccess,
        data: { access_token:token,id:userData.user_id,user_name:userData.user_name, email:userData.email, role_id: userData.role_id  },
      };

    } catch (err: any) {
      this.logger.log(err.message, {
        functionName: 'login',
        errorCode: '#500',
        logType: 'error',
      });
      return {
        success: 0,
        message: ResponseMessage.unknown,
      };
    }
  }


async sendOtp(request: ISendOtp): Promise<any> {
    try {
      const code = this.generateOtp.generateOtp();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins expiry

      this.orm.create({email:request.email,otp:code,expires_at:expiresAt},Otp)

      const mailOptions = {
        to: request.email,
        subject: 'Pro Pucca Verification Code',
        message: `Your Verification Code is: ${code}. It is valid for 5 minutes.`,
      };

      const sendEmail = await this.emailService.sendMail(mailOptions);
      if(sendEmail){
        this.logger.log(`Verification Code sent successfully to ${request.email}`, {
        functionName: 'sendOtp',
        errorCode:'#200',
        logType: 'log',
      });
      return {
        success: 1,
        message: ResponseMessage.verificationcodesent,
      };
      }
      else{
        this.logger.log(ResponseMessage.emailnotsentfailed, {
        functionName: 'sendOtp',
        errorCode:'#500',
        logType: 'log',
      });
      return {
        success: 0,
        message: ResponseMessage.emailnotsentfailed,
      };
      }
    } catch (err) {
      this.logger.log(`Error sending OTP ${err}`, {
        functionName: 'sendOtp',
        errorCode: '#500',
        logType: 'error',
      });
      return {
        success: 0,
        message: ResponseMessage.emailnotsentfailed,
      };
    }
  }


  async forget_password(request: IforgetPwdDto): Promise<ICommonResponse<any>> {
    try {
      const user = await this.orm.findOne(
        { email: request.email, is_active: true },
        User,
        [],
        [],
        [],
      );

      if (user === false) {
        this.logger.log(ResponseMessage.userfetchfailed, {
          errorCode: '#400',
          functionName: 'auth/forget_password',
          logType: 'error',
        });

        return {
          success: 0,
          message: ResponseMessage.unknown,
        };
      }

      var userData = user !== null ? user.dataValues : {};
      if (user === null) {
        return {
          success: 0,
          message: ResponseMessage.usernotfound,
        };
      }
      const record = await this.orm.findOne({email:request.email},Otp);
      if (!record) {
      return {
        success: 0,
        message: ResponseMessage.verificationcodesent,
      };
    }; 
    if (Date.now() > record.dataValues.expiresAt) {
      this.orm.delete({email:request.email},Otp); 
      return {
        success: 0,
        message: ResponseMessage.otpexpired,
      }; 
    }
    if (record.dataValues.otp !== request.otp) {
      return {
        success: 0,
        message: ResponseMessage.invalidotp,
      };
    }
     this.orm.delete({email:request.email},Otp); 

      const encryptPwd = await this.pwdService.encrypt(request.new_password);
      
      if (!encryptPwd) {
          return {
            success: 0,
            message: ResponseMessage.passwordencryptfailed,
          };
      }

      let resetPwd = this.orm.update({password:encryptPwd},{email:request.email},User);

      if (!resetPwd) {
        return {
          success: 0,
          message: ResponseMessage.passwordresetfailed,
        };
      }

      return {
        success: 1,
        message: ResponseMessage.passwordreset,
      };
    } catch (err: any) {
      this.logger.log(err.message, {
        functionName: 'login',
        errorCode: '#500',
        logType: 'error',
      });
      return {
        success: 0,
        message: ResponseMessage.unknown,
      };
    }
  }
}
