import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InsertNewsDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  title: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000)
  @IsString()
  description: string;

  @IsDateString()
  @IsOptional()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString()
  image_url?: string | null;
}
