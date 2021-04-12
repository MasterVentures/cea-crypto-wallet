"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const tslib_1 = require("tslib");
const jose = tslib_1.__importStar(require("node-jose"));
const { JWT, JWK } = jose;
const jsonwebtoken = require('jsonwebtoken');
const ed25519 = require('jwt-ed25519-tn');
class JWTService {
    constructor() {
    }
    static decodeWithSignature(jwt) {
        const decoded = Object.assign(Object.assign({}, jsonwebtoken.decode(jwt, { 'complete': true })), { data: `${jwt.split('.')[0]}.${jwt.split('.')[1]}` });
        return decoded;
    }
    /**
     * Signs a payload
     * @param key PEM format key
     * @param payload JSON payload
     * @param options JWT payload config
     */
    static async sign(key, payload, options) {
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
    static async verify(key, signature, audience) {
        return jsonwebtoken.verify(signature, key, { key: key, algorithm: 'HS256' });
    }
}
exports.JWTService = JWTService;
//# sourceMappingURL=JWTService.js.map