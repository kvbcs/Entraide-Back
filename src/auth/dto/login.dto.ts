import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
     @IsNotEmpty()
      @IsString()
      @MinLength(1)
      @MaxLength(255)
      @IsEmail()
      email: string;
    
      @IsNotEmpty()
      @IsString()
      @MinLength(1)
      @MaxLength(255)
      @IsStrongPassword()
      password: string;
}