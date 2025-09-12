import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateVolunteerDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @IsString()
  last_name: string;

  @IsOptional()
  @IsBoolean()
  is_absent: boolean;

  @IsDateString()
  @IsOptional()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;
}
