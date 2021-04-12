"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTPayload = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class JWTPayload {
}
tslib_1.__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsDefined()
], JWTPayload.prototype, "iat", void 0);
tslib_1.__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsDefined()
], JWTPayload.prototype, "nbf", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDefined()
], JWTPayload.prototype, "iss", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDefined()
], JWTPayload.prototype, "sub", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDefined()
], JWTPayload.prototype, "aud", void 0);
exports.JWTPayload = JWTPayload;
//# sourceMappingURL=JWTPayload.js.map