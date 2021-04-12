"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedDID = exports.Params = exports.DIDDocument = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class DIDDocument {
    constructor() {
        this.created = new Date();
        this.updated = new Date();
        this['@context'] = 'https://w3id.org/did/v1';
    }
}
tslib_1.__decorate([
    class_validator_1.IsDefined()
], DIDDocument.prototype, "id", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested()
], DIDDocument.prototype, "publicKey", void 0);
tslib_1.__decorate([
    class_validator_1.IsArray(),
    class_validator_1.IsOptional(),
    class_validator_1.ValidateNested()
], DIDDocument.prototype, "authentication", void 0);
tslib_1.__decorate([
    class_validator_1.IsArray(),
    class_validator_1.IsOptional()
], DIDDocument.prototype, "uportProfile", void 0);
tslib_1.__decorate([
    class_validator_1.IsArray(),
    class_validator_1.IsOptional(),
    class_validator_1.ValidateNested()
], DIDDocument.prototype, "service", void 0);
exports.DIDDocument = DIDDocument;
class Params {
}
exports.Params = Params;
class ParsedDID {
}
exports.ParsedDID = ParsedDID;
//# sourceMappingURL=DIDDocument.js.map