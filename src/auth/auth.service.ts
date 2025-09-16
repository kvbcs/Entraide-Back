import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      expiresIn: '1d',
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
      throw new ForbiddenException('Email déjà pris !');
    }

    const hashed_password = await argon.hash(dto.password);

    const userRole = await this.prisma.roles.findUnique({
      where: {
        role_name: 'user',
      },
    });

    if (!userRole) {
      throw new NotFoundException(
        "Role 'user' non trouvé ! Veuillez contacter l'administrateur.",
      );
    }

    await this.prisma.users.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        hashed_password: hashed_password,
        role_id: userRole.id_role,
        is_active: true,
        gdpr_accepted_at: new Date(),
      },
    });

    return {
      status: 'Succès',
      message:
        'Inscription réussite ! Veuillez activer votre compte via le mail envoyé.',
    };
  }

  async login(dto: LoginDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
      include: {
        roles: true,
      },
    });
    if (!existingUser) {
      throw new UnauthorizedException('Identifiants invalides !');
    }

    if (existingUser.is_verified === false) {
      throw new UnauthorizedException(
        'Veuillez activer votre compte via le mail de confirmation.',
      );
    }

    const isValidPassword = await argon.verify(
      existingUser.hashed_password,
      dto.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Identifiants invalides !');
    }
    //Return access_token from the signToken function with id_user as param
    const token = await this.signToken(existingUser.id_user);

    return {
      status: 'Succès',
      message: 'Connexion réussite !',
      data: token,
    };
  }
}
