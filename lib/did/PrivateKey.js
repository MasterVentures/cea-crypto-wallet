"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKey = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class PrivateKey {
    constructor() {
    }
    toAuthorizationKey() {
        return {
            publicKey: this.publicKeyBase58,
            type: this.type,
        };
    }
    toPublicKey() {
        return {
            publicKeyBase58: this.publicKeyBase58,
            type: this.type,
            owner: this.owner,
        };
    }
}
tslib_1.__decorate([
    class_validator_1.IsOptional()
], PrivateKey.prototype, "owner", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined()
], PrivateKey.prototype, "id", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined()
], PrivateKey.prototype, "type", void 0);
tslib_1.__decorate([
    class_validator_1.IsBase64(),
    class_validator_1.IsOptional()
], PrivateKey.prototype, "publicKeyBase64", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional()
], PrivateKey.prototype, "publicKeyBase58", void 0);
tslib_1.__decorate([
    class_validator_1.IsHexadecimal(),
    class_validator_1.IsOptional()
], PrivateKey.prototype, "publicKeyHex", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional()
], PrivateKey.prototype, "publicKeyPem", void 0);
tslib_1.__decorate([
    class_validator_1.IsBase64(),
    class_validator_1.IsOptional()
], PrivateKey.prototype, "privateKeyBase64", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional()
], PrivateKey.prototype, "privateKeyBase58", void 0);
tslib_1.__decorate([
    class_validator_1.IsHexadecimal(),
    class_validator_1.IsOptional()
], PrivateKey.prototype, "privateKeyHex", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional()
], PrivateKey.prototype, "privateKeyPem", void 0);
exports.PrivateKey = PrivateKey;
//# sourceMappingURL=PrivateKey.js.map