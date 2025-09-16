import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.users.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    if (users.length === 0) {
      throw new NotFoundException(
        "Aucun utilisateurs existants ! Veuillez contacter l'administrateur car cette erreur devrait être impossible !",
      );
    }
    return {
      status: 'Succès',
      data: users,
    };
  }

  async getOneUser(id: string) {
    const existingUser = await this.prisma.users.findUnique({
      where: { id_user: id },
    });

    if (!existingUser) {
      throw new NotFoundException('Utilisateur inexistant !');
    }

    const user = await this.prisma.users.findUnique({
      where: { id_user: id },
    });

    return {
      status: 'Succès',
      data: user,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { id_user: id },
    });

    if (!existingUser) {
      throw new NotFoundException('Utilisateur inexistant !');
    }

    await this.prisma.users.update({
      where: { id_user: id },
      data: { ...dto },
    });

    return {
      status: 'Succès',
      message: 'Utilisateur modifié !',
    };
  }

  async deleteUser(id: string) {
    const existingUser = await this.prisma.users.findUnique({
      where: { id_user: id },
    });

    if (!existingUser) {
      throw new NotFoundException('Utilisateur inexistant !');
    }

    await this.prisma.users.delete({
      where: { id_user: id },
    });

    return {
      status: 'Succès',
      message: 'Utilisateur supprimé !',
    };
  }
}
