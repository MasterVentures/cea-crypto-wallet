import { IsDefined, IsOptional, IsBase64, IsHexadecimal } from 'class-validator';
import { PublicKey } from './PublicKey';
import { Authentication } from './Authentication';
export class PrivateKey {
    constructor() {
    }

    public toAuthorizationKey() {
        return <Authentication>{
            publicKey: this.publicKeyBase58,
            type: this.type,
        };
    }
    public toPublicKey() {
        return <PublicKey>{
            publicKeyBase58: this.publicKeyBase58,
            type: this.type,
            owner: this.owner,
        };
    }
    @IsOptional()
    owner?: string;

    @IsDefined()
    id: string;
    @IsDefined()
    type: string;
    @IsBase64()
    @IsOptional()
    publicKeyBase64?: string;
    @IsOptional()
    publicKeyBase58?: string;
    @IsHexadecimal()
    @IsOptional()
    publicKeyHex?: string;
    @IsOptional()
    publicKeyPem?: string;
    @IsBase64()
    @IsOptional()
    privateKeyBase64?: string;
    @IsOptional()
    privateKeyBase58?: string;
    @IsHexadecimal()
    @IsOptional()
    privateKeyHex?: string;
    @IsOptional()
    privateKeyPem?: string;
}
