import { IsNotEmpty, IsString, IsIn, Length, NotEquals, IsNumber } from 'class-validator';

export class CreateBlogDto {
  @NotEquals(null)
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  title: string;

  @NotEquals(null)
  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  content: string;

  @NotEquals(null)
  @IsNotEmpty()
  @IsString()
  category: string;
}
