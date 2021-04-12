/// <reference types="node" />
/// <reference types="pouchdb-core" />
export declare class KeyRecipient {
    header: any;
    key: any;
}
export declare class JOSEService {
    static DEFAULT_PROTECTED: {
        alg: string;
        enc: string;
    };
    static DEFAULT_UNPROTECTED: {
        cty: string;
    };
    constructor();
    /**
     * Encrypts payload with JWK key
     * @param payload String or Buffer payload
     * @param key JWK key
     */
    static encrypt(payload: string | Buffer, keys: any[]): any;
    /**
     * Decrypts a JWE cipher
     * @param key JWK Key
     * @param ciphertext Encrypted content
     */
    static decrypt(key: any, jwe: string): Promise<Buffer>;
}
