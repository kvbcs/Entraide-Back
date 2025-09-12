import { PartialType } from '@nestjs/mapped-types';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { IsOptional } from 'class-validator';

export class UpdateVolunteerDto extends PartialType(CreateVolunteerDto) {
  @IsOptional()
  first_name: string;

  @IsOptional()
  last_name: string;
}
