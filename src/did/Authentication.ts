import { IsDefined } from 'class-validator';
export class Authentication {
    @IsDefined()
    type: string;
    @IsDefined()
    publicKey: string;
}
