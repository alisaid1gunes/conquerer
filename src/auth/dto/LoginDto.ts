import {IsNotEmpty, MaxLength, MinLength, NotEquals} from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @NotEquals(null)
    username: string;

    @IsNotEmpty()
    @NotEquals(null)
    @MinLength(8)
    @MaxLength(8)
    password: string;
}
