import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  content?: string;
}
