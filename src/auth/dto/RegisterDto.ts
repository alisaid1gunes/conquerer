import {IsNotEmpty, MinLength, MaxLength, NotEquals,IsEmail} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @NotEquals(null)
    @MinLength(3)
    @MaxLength(25)
    fullName: string;

    @IsNotEmpty()
    @NotEquals(null)
    @IsEmail()
    email:string

    @IsNotEmpty()
    @NotEquals(null)
    @MinLength(8)
    @MaxLength(8)
    password: string;
}
