import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    return this.prisma.users.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        hashed_password: dto.password,
        role_id: 'user',
      },
    });
  }

  async login(dto: LoginDto) {
    this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    return {
      message: 'token',
    };
  }
}
