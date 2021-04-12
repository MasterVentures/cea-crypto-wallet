import { IsDefined, IsNumber, IsString } from 'class-validator';
export class JWTPayload {
    @IsNumber()
    @IsDefined()
    iat: number;
    @IsNumber()
    @IsDefined()
    nbf: number;
    @IsString()
    @IsDefined()
    iss: string;
    @IsString()
    @IsDefined()
    sub: string;
    @IsString()
    @IsDefined()
    aud: string[] | string;
}
