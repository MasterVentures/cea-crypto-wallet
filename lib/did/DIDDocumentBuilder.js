"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIDDocumentBuilder = void 0;
const DIDDocument_1 = require("./DIDDocument");
const class_validator_1 = require("class-validator");
class DIDDocumentBuilder {
    static async createDID({ issuer, verificationKeys, authenticationKeys, services = [] }) {
        const document = new DIDDocument_1.DIDDocument();
        document.id = issuer;
        document.publicKey = await Promise.all(verificationKeys.map(async (key) => {
            await class_validator_1.validateOrReject(key);
            return Object.assign(Object.assign({}, key), { owner: issuer });
        }));
        document.authentication = await Promise.all(authenticationKeys.map(async (key) => {
            await class_validator_1.validateOrReject(key);
            return key;
        }));
        document.service = await Promise.all(services.map(async (s) => {
            await class_validator_1.validateOrReject(s);
            return Object.assign({}, s);
        }));
        // document.proofs = await Promise.all(authenticationKeys.map(async key => {
        //     await validateOrReject(key)
        //     return <Authentication>{
        //         publicKey: key.publicKeyBase58,
        //         type: key.type,
        //     };
        // }));
        return document;
    }
}
exports.DIDDocumentBuilder = DIDDocumentBuilder;
//# sourceMappingURL=DIDDocumentBuilder.js.map