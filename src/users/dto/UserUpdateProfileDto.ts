import {IsNotEmpty, MinLength, Length, IsDate, Matches, IsOptional} from 'class-validator';

export class UserUpdateProfileDto {
    @IsOptional()
    @Length(3, 25)
    username?: string;

    @IsOptional()
    @Length(3, 25)
    fullName?: string;

    @IsOptional()
    @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
        message: "$property must be formatted as yyyy-mm-dd"
    })
    birthDate?: Date;
}