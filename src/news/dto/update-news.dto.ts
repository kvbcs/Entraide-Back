import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateNewsDto {
  
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  title: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(1000)
  @IsString()
  description: string;

  @IsOptional()
  image_url?: string;

  @IsDateString()
  @IsOptional()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;
}
