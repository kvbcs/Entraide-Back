import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Res,
 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  Register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async Login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response,) {

        const tokenInfo = await this.authService.login(dto);

 res.cookie('access_token', tokenInfo.access_token, {
   httpOnly: true,
   sameSite: 'strict',
   secure: process.env.NODE_ENV === 'production',
   maxAge: 1000 * 60 * 60 * 24 * 30,
 });

    return {
      status: 'Succès',
      message: 'Connexion réussie !',
      userRole: tokenInfo.userRole,
      userName: tokenInfo.userName,
    };  }

  @Get('/activate')
  async activateAccount(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token manquant');
    }
    return this.authService.activateUser(token);
  }
}
