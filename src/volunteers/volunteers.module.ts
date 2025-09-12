import { Module } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { VolunteersController } from './volunteers.controller';

@Module({
  controllers: [VolunteersController],
  providers: [VolunteersService],
})
export class VolunteersModule {}
