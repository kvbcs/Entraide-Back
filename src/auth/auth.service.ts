import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(userId: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async register(dto: RegisterDto) {
    const exisingUser = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (exisingUser) {
      throw new ForbiddenException('Email already taken !');
    }

    const hashed_password = await argon.hash(dto.password);

    return this.prisma.users.create({
      data: {
        ...dto,
        hashed_password: hashed_password,
        role_id: 'user',
      },
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid crendentials');
    }

    const isValidPassword = await argon.verify(
      user.hashed_password,
      dto.password,
    );
    if (!isValidPassword) {
      throw new ForbiddenException('Invalid crendentials');
    }
    //Return access_token from the signToken function with id_user as param
    return this.signToken(user.id_user);
  }
}
