import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    NewsModule
  ],
})
export class AppModule {}
