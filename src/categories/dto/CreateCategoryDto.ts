import { IsNotEmpty, IsString, Length ,NotEquals } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    @NotEquals(null)
    @IsString()
    @Length(1, 50)
    name: string;
}
