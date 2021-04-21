import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ParamGrupoDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 5)
  grupo: string;
}
