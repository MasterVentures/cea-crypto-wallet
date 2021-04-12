import { ServiceEndpoint } from './ServiceEndpoint';
import { PublicKey } from './PublicKey';
import { Authentication } from './Authentication';
export declare class DIDDocument {
    id: string;
    publicKey: PublicKey[];
    authentication?: Authentication[];
    uportProfile?: any;
    service?: ServiceEndpoint[];
    created: Date;
    updated: Date;
    constructor();
}
export declare class Params {
    [index: string]: string;
}
export declare class ParsedDID {
    did: string;
    didUrl: string;
    method: string;
    id: string;
    path?: string;
    fragment?: string;
    query?: string;
    params?: Params;
}
