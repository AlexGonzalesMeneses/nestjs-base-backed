import { IsNotEmpty, Matches } from 'class-validator';

export class SegipPersonaDTO {

    Complemento: string;

    @IsNotEmpty()
    NumeroDocumento: string;

    @IsNotEmpty()
    Nombres: string;

    @IsNotEmpty()
    PrimerApellido: string;

    @IsNotEmpty()
    SegundoApellido: string;

    @IsNotEmpty()
    @Matches(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/)
    FechaNacimiento: string;
}
