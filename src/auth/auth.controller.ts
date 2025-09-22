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
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import type { Response } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { GetUser } from './decorator/get-user.decorator';
import type { users } from 'generated/prisma';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @Throttle({ default: { limit: 3, ttl: 60 } })
  Register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('/login')
  @Throttle({ default: { limit: 3, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async Login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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
    };
  }

  @Get('/me')
  @UseGuards(JwtGuard)
  getMe(@GetUser() user: users) {
    return user;
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      status: 'Succès',
      message: 'Déconnexion réussie',
    };
  }

  @Get('/activate')
  async activateAccount(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token manquant');
    }
    return this.authService.activateUser(token);
  }
}
