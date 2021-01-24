"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIDDocumentBuilder = void 0;
const DIDDocument_1 = require("./DIDDocument");
class DIDDocumentBuilder {
    static createDID({ issuer, verificationKeys, authenticationKeys, services = [] }) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = new DIDDocument_1.DIDDocument();
            document.id = issuer;
            document.publicKey = yield Promise.all(verificationKeys.map((key) => __awaiter(this, void 0, void 0, function* () {
                return Object.assign(Object.assign({}, key), { owner: issuer });
            })));
            document.authentication = yield Promise.all(authenticationKeys.map((key) => __awaiter(this, void 0, void 0, function* () {
                return key;
            })));
            document.service = yield Promise.all(services.map((s) => __awaiter(this, void 0, void 0, function* () {
                return Object.assign({}, s);
            })));
            return document;
        });
    }
}
exports.DIDDocumentBuilder = DIDDocumentBuilder;
