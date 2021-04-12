import { JWTPayload } from './JWTPayload';
import * as jose from 'node-jose';
const { JWT, JWK } = jose;
const jsonwebtoken = require('jsonwebtoken');
const ed25519 = require('jwt-ed25519-tn');



export class JWTService {
    constructor() {

    }

    public static decodeWithSignature(jwt: string) {
        const decoded = {
            ...jsonwebtoken.decode(jwt, { 'complete': true }),
            data: `${jwt.split('.')[0]}.${jwt.split('.')[1]}`,
        };

        return decoded;
    }

    
    /**
     * Signs a payload
     * @param key PEM format key
     * @param payload JSON payload
     * @param options JWT payload config
     */
    public static async sign(key: any, payload: any, options: JWTPayload) {
        // const keys = await JWK.asKey(pem, 'pem');
        // const key = typeof pem === 'string' ? keys.toJSON(true) : pem;
        return jsonwebtoken.sign(payload, key, {
            audience: options.aud,
            issuer: options.iss,
            // iat: !!options.iat,
            // notBefore: options.nbf,
            subject: options.sub,
        });
    }
    
    /**
     * Verifies a signed message
     * @param key buffer
     * @param signature Signature
     * @param options JWT payload config
     */
    public static async verify(key: any, signature: any, audience: string | string[]) {
        return jsonwebtoken.verify(signature,key, { key: key, algorithm: 'HS256'})
    }


}