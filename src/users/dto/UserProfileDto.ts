import { IsNotEmpty, MinLength, Length, IsDate , NotEquals} from 'class-validator';

export class UserProfileDto {
    @NotEquals(null)
    @IsNotEmpty()
    @Length(3, 25)
    username: string;

    @NotEquals(null)
    @IsNotEmpty()
    @Length(3, 25)
    fullName: string;


    @IsNotEmpty()
    @IsDate()
    birthDate?: Date;
}