"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class Authentication {
}
tslib_1.__decorate([
    class_validator_1.IsDefined()
], Authentication.prototype, "type", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined()
], Authentication.prototype, "publicKey", void 0);
exports.Authentication = Authentication;
//# sourceMappingURL=Authentication.js.map