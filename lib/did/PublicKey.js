"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class PublicKey {
}
tslib_1.__decorate([
    class_validator_1.IsDefined()
], PublicKey.prototype, "id", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined()
], PublicKey.prototype, "type", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined()
], PublicKey.prototype, "owner", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsEthereumAddress()
], PublicKey.prototype, "ethereumAddress", void 0);
tslib_1.__decorate([
    class_validator_1.IsBase64(),
    class_validator_1.IsOptional()
], PublicKey.prototype, "publicKeyBase64", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional()
], PublicKey.prototype, "publicKeyBase58", void 0);
tslib_1.__decorate([
    class_validator_1.IsHexadecimal(),
    class_validator_1.IsOptional()
], PublicKey.prototype, "publicKeyHex", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional()
], PublicKey.prototype, "publicKeyPem", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional()
], PublicKey.prototype, "publicKeyJwk", void 0);
exports.PublicKey = PublicKey;
//# sourceMappingURL=PublicKey.js.map