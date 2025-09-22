import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
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

  @Post()
  CreateVolunteer(@Body() dto: CreateVolunteerDto) {
    return this.volunteersService.createVolunteer(dto);
  }

  @Patch('/:id')
  UpdateVolunteer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVolunteerDto,
  ) {
    return this.volunteersService.updateVolunteer(id, dto);
  }

  @Delete('/:id')
  DeleteVolunteers(@Param('id', ParseIntPipe) id: number) {
    return this.volunteersService.deleteVolunteers(id);
  }
}
