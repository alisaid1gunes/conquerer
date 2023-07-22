import { IsNotEmpty, IsString, IsNumber, NotEquals } from 'class-validator';

export class CreateCommentDto {
  @NotEquals(null)
  @IsNotEmpty()
  @IsString()
  content: string;

  @NotEquals(null)
  @IsNotEmpty()
  @IsNumber()
  blogId: number;
}
