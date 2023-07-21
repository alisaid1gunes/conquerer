import {IsNotEmpty, MaxLength, MinLength, NotEquals} from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    @NotEquals(null)
    @MinLength(8)
    @MaxLength(8)
    oldPassword: string;

    @IsNotEmpty()
    @NotEquals(null)
    @MinLength(8)
    @MaxLength(8)
    newPassword: string;
}
