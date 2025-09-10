import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
    constructor(private prisma: PrismaService) { }
    
  async getAllNews() {
      return this.prisma.news.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });
  }
}
