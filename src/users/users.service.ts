import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.users.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getOneUser(id: string) {
    return this.prisma.users.findUnique({
      where: { id_user: id },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.users.update({
      where: { id_user: id },
      data: { ...dto },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.users.delete({
      where: { id_user: id },
    });
  }
}
