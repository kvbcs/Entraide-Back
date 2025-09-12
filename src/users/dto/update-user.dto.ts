import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  first_name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  last_name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsUUID()
  @IsString()
  role_id: string;
}
