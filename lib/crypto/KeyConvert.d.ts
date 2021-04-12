/// <reference types="node" />
/// <reference types="pouchdb-core" />
import { ec, eddsa } from 'elliptic';
import { LDCryptoTypes } from './LDCryptoTypes';
import { PrivateKey } from '../did';
import { JWK } from 'node-jose';
export declare class X509Info {
    countryName: string;
    stateOrProvinceName: string;
    localityName: string;
    organizationName: string;
    organizationalUnitName: string;
    commonName: string;
}
export declare class KeyConvert {
    /**
     * Returns private keys in DER, JWK and PEM formats
     * @param kp Key pair
     * @param passphrase passphrase
     */
    static getP256(kp: ec.KeyPair, passphrase?: string): Promise<{
        der: any;
        pem: any;
        jwk?: undefined;
        ldSuite?: undefined;
    } | {
        der: any;
        jwk: any;
        pem: any;
        ldSuite: {
            publicKeyJwk: string;
        };
    }>;
    /**
 * Returns private keys in DER, JWK and PEM formats
 * @param kp Key pair
 * @param passphrase passphrase
 */
    static getES256K(kp: ec.KeyPair, passphrase?: string): Promise<{
        der: any;
        pem: any;
        jwk?: undefined;
        ldSuite?: undefined;
    } | {
        der: any;
        jwk: any;
        pem: any;
        ldSuite: {
            publicKeyJwk: string;
        };
    }>;
    static openEncryptedPEMtoJWK(pem: string, passphrase: string): Promise<any>;
    /**
     * Returns private keys in DER, JWK and PEM formats
     * @param kp Key pair
     * @param passphrase passphrase
     */
    static getEd25519(kp: eddsa.KeyPair, passphrase?: string): Promise<{
        der: any;
        pem: any;
    }>;
    static createLinkedDataJsonFormat(algorithm: LDCryptoTypes, key: KeyLike, hasPrivate?: boolean): Promise<PrivateKey>;
}
export interface KeyLike {
    publicPem?: string;
    publicJwk?: JWK.Key;
    privBytes(): Buffer | Uint8Array;
    pubBytes(): Buffer | Uint8Array;
}
