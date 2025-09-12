import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { AdminGuard, JwtGuard } from 'src/auth/guards';

@UseGuards(JwtGuard, AdminGuard)
@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Get()
  GetAllVolunteers() {
    return this.volunteersService.getAllVolunteers();
  }

  @Get('/:id')
  GetVolunteerByID(@Param('id') id: number) {
    return this.volunteersService.getVolunteerById(id);
  }

  @Post()
  CreateVolunteer(@Body() dto: CreateVolunteerDto) {
    return this.volunteersService.createVolunteer(dto);
  }

  @Patch('/:id')
  UpdateVolunteer(@Param('id') id: number, @Body() dto: UpdateVolunteerDto) {
    return this.volunteersService.updateVolunteer(id, dto);
  }

  @Delete('/:id')
  DeleteVolunteers(@Param('id') id: number) {
    return this.volunteersService.deleteVolunteers(id);
  }
}
