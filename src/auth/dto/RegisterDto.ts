import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
