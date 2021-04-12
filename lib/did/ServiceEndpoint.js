"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceEndpoint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class ServiceEndpoint {
}
tslib_1.__decorate([
    class_validator_1.IsDefined()
], ServiceEndpoint.prototype, "id", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined()
], ServiceEndpoint.prototype, "type", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined()
], ServiceEndpoint.prototype, "serviceEndpoint", void 0);
tslib_1.__decorate([
    class_validator_1.IsDefined()
], ServiceEndpoint.prototype, "description", void 0);
exports.ServiceEndpoint = ServiceEndpoint;
//# sourceMappingURL=ServiceEndpoint.js.map