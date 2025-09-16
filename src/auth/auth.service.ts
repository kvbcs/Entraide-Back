import {
  BadRequestException,
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
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
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
        "Role inexistant ! Veuillez contacter l'administrateur immédiatement.",
      );
    }

    const activationToken = await argon.hash(`${new Date()} + ${dto.email}`);

    const user = await this.prisma.users.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        hashed_password: hashed_password,
        role_id: userRole.id_role,
        is_active: true,
        gdpr_accepted_at: new Date(),
        activation_token: activationToken,
      },
    });

    try {
      await this.emailService.sendUserConfirmation(user, activationToken);
    } catch (error) {
      return new BadRequestException(error, 'Erreur email');
    }

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

    //Password match verification
    const isValidPassword = await argon.verify(
      existingUser.hashed_password,
      dto.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Identifiants invalides !');
    }

    //Create access_token from the signToken function with id_user as sub
    const token = await this.signToken(existingUser.id_user);

    //Delete activation token from DB
    await this.prisma.users.update({
      where: {
        id_user: existingUser.id_user,
      },
      data: {
        activation_token: null,
      },
    });

    return {
      status: 'Succès',
      message: 'Connexion réussite !',
      data: token,
    };
  }
}
