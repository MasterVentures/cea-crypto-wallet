import { IsDefined, IsArray, IsOptional, Validate, ValidateNested } from 'class-validator';
import { ServiceEndpoint } from './ServiceEndpoint';
import { PublicKey } from './PublicKey';
import { Authentication } from './Authentication';

export class DIDDocument {

    @IsDefined()
    id: string;

    @IsDefined()
    @IsArray()
    @ValidateNested()
    publicKey: PublicKey[];


    @IsArray()
    @IsOptional()
    @ValidateNested()
    authentication?: Authentication[];

    @IsArray()
    @IsOptional()
    uportProfile?: any;


    @IsArray()
    @IsOptional()
    @ValidateNested()
    service?: ServiceEndpoint[];


    created: Date;
    updated: Date;

    constructor() {
        this.created = new Date();
        this.updated = new Date();
    this['@context'] = 'https://w3id.org/did/v1';

    }
}

export class Params {
    [index: string]: string;
}

export class ParsedDID {
    did: string;
    didUrl: string;
    method: string;
    id: string;
    path?: string;
    fragment?: string;
    query?: string;
    params?: Params;
}
