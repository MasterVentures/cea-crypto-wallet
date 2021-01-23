"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrivateKey {
    constructor() { }
    toAuthorizationKey() {
        return {
            publicKey: this.publicKeyBase58,
            type: this.type
        };
    }
    toPublicKey() {
        return {
            publicKeyBase58: this.publicKeyBase58,
            type: this.type,
            owner: this.owner
        };
    }
}
exports.PrivateKey = PrivateKey;
