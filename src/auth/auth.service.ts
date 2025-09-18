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
import { randomUUID } from 'crypto';
import { roles, users } from 'generated/prisma';
type UserWithRole = users & { roles: roles };
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
  ) {}

  async signToken(user: UserWithRole): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id_user,
      role: user.roles.role_name,
      name: `${user.first_name} ${user.last_name}`,
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

    const activationToken = randomUUID();

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
      //Delete created user if email fails
      await this.prisma.users.delete({ where: { id_user: user.id_user } });
      throw new BadRequestException('Erreur email, inscription annulée', error);
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

    if (!existingUser.is_verified) {
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
    const token = await this.signToken(existingUser);

    //Delete activation token from DB
    if (existingUser.activation_token) {
      await this.prisma.users.update({
        where: {
          id_user: existingUser.id_user,
        },
        data: {
          activation_token: null,
        },
      });
    }

    return {
     
      access_token: token.access_token,
      userRole: existingUser.roles.role_name,
      userName: `${existingUser.first_name} ${existingUser.last_name}`,
    };
  }

  async activateUser(token: string) {
    // On cherche l’utilisateur avec ce token
    const user = await this.prisma.users.findFirst({
      where: { activation_token: token },
    });

    if (!user) {
      throw new NotFoundException('Lien d’activation invalide ou expiré !');
    }

    if (user.is_verified) {
      throw new BadRequestException('Compte déjà vérifié !');
    }

    if (user.activation_token !== token) {
      throw new BadRequestException('Token invalide ou expiré !');
    }

    // Mise à jour : active et supprime le token
    await this.prisma.users.update({
      where: { id_user: user.id_user },
      data: {
        is_verified: true,
        activation_token: null,
      },
    });

    return {
      status: 'Succès',
      message:
        'Votre compte a été activé avec succès, vous pouvez vous connecter.',
    };
  }
}
