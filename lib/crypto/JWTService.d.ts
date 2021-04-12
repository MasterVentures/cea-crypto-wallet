import { JWTPayload } from './JWTPayload';
export declare class JWTService {
    constructor();
    static decodeWithSignature(jwt: string): any;
    /**
     * Signs a payload
     * @param key PEM format key
     * @param payload JSON payload
     * @param options JWT payload config
     */
    static sign(key: any, payload: any, options: JWTPayload): Promise<any>;
    /**
     * Verifies a signed message
     * @param key buffer
     * @param signature Signature
     * @param options JWT payload config
     */
    static verify(key: any, signature: any, audience: string | string[]): Promise<any>;
}
