import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VolunteersService {
  constructor(private prisma: PrismaService) {}

  async getAllVolunteers() {
    return this.prisma.volunteers.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getVolunteerById(id: number) {
    return this.prisma.volunteers.findUnique({
      where: { id_volunteer: id },
    });
  }

  async createVolunteer(dto: CreateVolunteerDto) {
    return this.prisma.volunteers.create({
      data: { ...dto },
    });
  }

  async updateVolunteer(id: number, dto: UpdateVolunteerDto) {
    return this.prisma.volunteers.update({
      where: { id_volunteer: id },
      data: { ...dto },
    });
  }

  async deleteVolunteers(id: number) {
    return this.prisma.volunteers.delete({
      where: { id_volunteer: id },
    });
  }
}
