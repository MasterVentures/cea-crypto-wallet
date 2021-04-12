import { DIDDocument } from './DIDDocument';
import { PublicKey } from './PublicKey';
import { Authentication } from './Authentication';
import { ServiceEndpoint } from './ServiceEndpoint';
export declare class DIDDocumentBuilder {
    static createDID({ issuer, verificationKeys, authenticationKeys, services }: {
        issuer: string;
        verificationKeys: PublicKey[];
        authenticationKeys: Authentication[];
        services?: ServiceEndpoint[];
    }): Promise<DIDDocument>;
}
