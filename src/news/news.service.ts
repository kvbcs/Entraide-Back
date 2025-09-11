import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertNewsDto, UpdateNewsDto } from './dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async getAllNews() {
    return this.prisma.news.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getNewsById(id: number) {
    return this.prisma.news.findUnique({
      where: {
        id_news: id
      }
    })
  }

  async createNews(dto: InsertNewsDto) {
    return this.prisma.news.create({
      data: {
        ...dto,
      },
    });
  }

  async updateNews(id: number, dto: UpdateNewsDto) {
    return this.prisma.news.update({
      where: { id_news: id },
      data: dto,
    });
  }

  async deleteNews(id: number) {
    return this.prisma.news.delete({
      where: { id_news: id },
    });
  }
}
