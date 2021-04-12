import { IsDefined, IsOptional, IsEthereumAddress, IsBase64, IsHexadecimal } from 'class-validator';
export class PublicKey {
    @IsDefined()
    id: string;
    @IsDefined()
    type: string;
    @IsDefined()
    owner: string;
    @IsDefined()
    @IsEthereumAddress()
    ethereumAddress?: string;
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
    @IsOptional()
    publicKeyJwk?: string;
}
