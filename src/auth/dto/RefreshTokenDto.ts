import {IsNotEmpty, NotEquals} from 'class-validator';

export class RefreshTokenDto {
    @IsNotEmpty()
    @NotEquals(null)
    refreshToken: string;
}
