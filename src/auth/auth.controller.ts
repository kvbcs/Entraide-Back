import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  Register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('/login')
  Login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
