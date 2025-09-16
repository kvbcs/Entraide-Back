import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VolunteersService {
  constructor(private prisma: PrismaService) {}

  async getAllVolunteers() {
    const volunteers = await this.prisma.volunteers.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    if (volunteers.length === 0) {
      return {
        status: 'Succès',
        message: 'Aucun bénévoles trouvés !',
      };
    }

    return {
      status: 'Succès',
      data: volunteers,
    };
  }

  async createVolunteer(dto: CreateVolunteerDto) {
    const existingVolunteer = await this.prisma.volunteers.findFirst({
      where: {
        AND: [{ first_name: dto.first_name }, { last_name: dto.last_name }],
      },
    });

    if (existingVolunteer) {
      return 'Ce bénévole existe déjà !';
    }

    await this.prisma.volunteers.create({
      data: { ...dto },
    });

    return {
      status: 'Succès',
      message: 'Bénévole créé !',
    };
  }

  async updateVolunteer(id: number, dto: UpdateVolunteerDto) {
    const existingVolunteer = await this.prisma.volunteers.findUnique({
      where: {
        id_volunteer: id,
      },
    });

    if (!existingVolunteer) {
      throw new NotFoundException('Bénévole inexistant !');
    }

    await this.prisma.volunteers.update({
      where: { id_volunteer: id },
      data: { ...dto },
    });

    return {
      status: 'Succès',
      message: 'Bénévole modifié !',
    };
  }

  async deleteVolunteers(id: number) {
    const existingVolunteer = await this.prisma.volunteers.findUnique({
      where: {
        id_volunteer: id,
      },
    });

    if (!existingVolunteer) {
      throw new NotFoundException('Bénévole inexistant !');
    }

    await this.prisma.volunteers.delete({
      where: { id_volunteer: id },
    });

    return {
      status: 'Succès',
      message: 'Bénévole supprimé !',
    };
  }
}
