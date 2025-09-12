import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { VolunteersModule } from './volunteers/volunteers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    NewsModule,
    VolunteersModule,
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}
