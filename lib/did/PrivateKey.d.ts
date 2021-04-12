import { PublicKey } from './PublicKey';
import { Authentication } from './Authentication';
export declare class PrivateKey {
    constructor();
    toAuthorizationKey(): Authentication;
    toPublicKey(): PublicKey;
    owner?: string;
    id: string;
    type: string;
    publicKeyBase64?: string;
    publicKeyBase58?: string;
    publicKeyHex?: string;
    publicKeyPem?: string;
    privateKeyBase64?: string;
    privateKeyBase58?: string;
    privateKeyHex?: string;
    privateKeyPem?: string;
}
