import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtVerify } from '../jwttoken/jwttoken.service';
import { SKIP_TOKEN_AUTH_ROUTES } from '../constants/constants';
import { CustomLoggerService } from '../logger/logger.service';

const LoggerService = new CustomLoggerService();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (SKIP_TOKEN_AUTH_ROUTES.includes(req.baseUrl)) {
        next();
        return;
      }

      const token: string | undefined = extractTokenFromHeader(req);

      if (!token) {
        LoggerService.log('token not found in request', {
          functionName: 'AuthMiddleware',
          errorCode: '#400',
          logType: 'error',
        });

        res.writeHead(403);
        res.write(JSON.stringify({ message: 'Token expired!', success: 0 }));
        res.end();
        return;
      }

      const payload = await JwtVerify(token);

      if (!payload) {
        res.writeHead(403);
        res.write(JSON.stringify({ message: 'Token expired!', success: 0 }));
        res.end();
        return;
      }

      next();
    } catch (err) {
      console.log(err);
      return;
    }
  }
}

function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
