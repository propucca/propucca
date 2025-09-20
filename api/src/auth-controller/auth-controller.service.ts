import { Injectable } from '@nestjs/common';

import { IforgetPwdDto, ILoginDto, ISendOtp } from './dto/auth-controller.dto';

import { ResponseMessage } from '@/constants/constants';
import { CustomLoggerService } from '@/logger/logger.service';
import { JwtSign } from '@/jwttoken/jwttoken.service';
import { ICommonResponse } from '@/interface/interfaces';
import { ORMService } from '@/database/orm/orm.service';
import { User, Otp } from '@/database/orm/orm.schema';
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

  async login(request: ILoginDto): Promise<ICommonResponse<{}>> {
    try {
      const user = await this.orm.findOne(
        { email: request.email, is_active: true },
        User,
        [],
        [],
        [],
      );

      if (user === false) {
        this.logger.log('User fetch failed', {
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
          message: 'Invalid Login!',
        };
      }
      const decryptPwd = await this.pwdService.compare(
        request.password,
        userData.password,
      );
      if (decryptPwd !== true) {
        return {
          success: 0,
          message: 'Invalid Credentials!',
        };
      }

      const token = await JwtSign(userData);

      return {
        success: 1,
        message: 'Login Successfull!',
        data: {
          access_token: token,
          id: userData.user_id,
          user_name: userData.user_name,
          email: userData.email,
          role_id: userData.role_id,
        },
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

      const otpCreate = await this.orm.create(
        { email: request.email, otp: code, expires_at: expiresAt },
        Otp,
      );

      if (otpCreate === false) {
        this.logger.log('Something bad happened', {
          functionName: 'sendOtp',
          errorCode: '#400',
          logType: 'error',
        });
        return {
          success: 0,
          message: 'Unable to send Verification Code',
        };
      }

      const mailOptions = {
        to: request.email,
        subject: 'Pro Pucca Verification Code',
        message: `Your Verification Code is: ${code}. It is valid for 5 minutes.`,
      };

      const sendEmail = await this.emailService.sendMail(mailOptions);
      if (sendEmail) {
        this.logger.log(
          `Verification Code sent successfully to ${request.email}`,
          {
            functionName: 'sendOtp',
            errorCode: '#200',
            logType: 'log',
          },
        );
        return {
          success: 1,
          message: 'Verification code send to Email!',
        };
      } else {
        this.logger.log(`Unable to send Verification Code`, {
          functionName: 'sendOtp',
          errorCode: '#500',
          logType: 'log',
        });
        return {
          success: 0,
          message: 'Unable to send Verification Code',
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
        message: 'Unable to send Verification Code',
      };
    }
  }

  async forget_password(request: IforgetPwdDto): Promise<ICommonResponse<{}>> {
    try {
      const user = await this.orm.findOne(
        { email: request.email, is_active: true },
        User,
        [],
        [],
        [],
      );

      if (user === false) {
        this.logger.log('User fetch failed', {
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
          message: 'User Not Found!',
        };
      }
      const record = await this.orm.findOne({ email: request.email }, Otp);
      if (!record) {
        return {
          success: 0,
          message: 'No Verification Code Sent',
        };
      }
      if (Date.now() > record.dataValues.expiresAt) {
        this.orm.delete({ email: request.email }, Otp);
        return {
          success: 0,
          message: 'Verification Code expired!',
        };
      }
      if (record.dataValues.otp !== request.code) {
        return {
          success: 0,
          message: 'Invalid Verification Code',
        };
      }
      this.orm.delete({ email: request.email }, Otp);

      const encryptPwd = await this.pwdService.encrypt(request.password);

      if (!encryptPwd) {
        return {
          success: 0,
          message: 'Something bad happened!',
        };
      }

      let resetPwd = this.orm.update(
        { password: encryptPwd },
        { email: request.email },
        User,
      );

      if (!resetPwd) {
        return {
          success: 0,
          message: 'Unable to reset the password!',
        };
      }

      return {
        success: 1,
        message: 'Password Reset Successfull!',
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
