"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOSEService = exports.KeyRecipient = void 0;
const tslib_1 = require("tslib");
const jose = tslib_1.__importStar(require("node-jose"));
const { JWT, JWK, JWE } = jose;
class KeyRecipient {
}
exports.KeyRecipient = KeyRecipient;
// protected: { enc: alg // A128GCM }
class JOSEService {
    constructor() {
    }
    /**
     * Encrypts payload with JWK key
     * @param payload String or Buffer payload
     * @param key JWK key
     */
    static encrypt(payload, keys) {
        return JWE
            .createEncrypt([...keys])
            .update(payload)
            .final();
    }
    /**
     * Decrypts a JWE cipher
     * @param key JWK Key
     * @param ciphertext Encrypted content
     */
    static async decrypt(key, jwe) {
        const res = JWE.createDecrypt(await JWK.asKey(key, 'pem'))
            .decrypt(jwe);
        return res;
    }
}
exports.JOSEService = JOSEService;
JOSEService.DEFAULT_PROTECTED = {
    alg: 'ECDH-ES',
    enc: 'A128CBC-HS256'
};
JOSEService.DEFAULT_UNPROTECTED = { cty: 'text/plain' };
//# sourceMappingURL=JOSEService.js.map