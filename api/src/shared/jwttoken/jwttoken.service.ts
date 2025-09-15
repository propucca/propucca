import { JwtService } from '@nestjs/jwt';
import { CustomLoggerService } from '../logger/logger.service';

const JWT = new JwtService();

const LoggerService = new CustomLoggerService();

export const JwtSign = async (payload: object): Promise<string | boolean> => {
  try {
    return JWT.sign(payload, {
      secret: process.env.JWT_SECRET,
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
      expiresIn: process.env.JWT_EXPIRY,
    });
  } catch (err) {
    LoggerService.log(err.message, {
      functionName: 'JwtSign',
      errorCode: '#500',
      logType: 'error',
    });
    return false;
  }
};

export const JwtVerify = async (token: string): Promise<any | boolean> => {
  try {
    return JWT.verify(token, {
      secret: process.env.JWT_SECRET,
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
    });
  } catch (err) {
    LoggerService.log(err.message, {
      functionName: 'JwtVerify',
      errorCode: '#200',
      logType: 'log',
    });
    return false;
  }
};
