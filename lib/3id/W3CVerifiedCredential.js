"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3CVerifiedCredential = void 0;
const tslib_1 = require("tslib");
const did_jwt_vc_1 = require("did-jwt-vc");
const moment_1 = tslib_1.__importDefault(require("moment"));
class W3CVerifiedCredential {
    constructor() { }
    /**
     * Issue a VC Credential
     * @param did DID
     * @param issuer Issuer
     * @param holderInfo Holder Info
     */
    issueCredential(did, issuer, holderInfo) {
        const vcPayload = {
            sub: did.id,
            nbf: moment_1.default().unix(),
            vc: {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiableCredential'],
                credentialSubject: Object.assign({}, holderInfo),
            },
        };
        return did_jwt_vc_1.createVerifiableCredentialJwt(vcPayload, issuer);
    }
    /**
     * Creates a VP
     * @param credential Verified Credential
     * @param issuer Issuer
     */
    createVerifiablePresentation(credential, issuer) {
        const vpPayload = {
            vp: {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiablePresentation'],
                verifiableCredential: [credential],
            },
        };
        return did_jwt_vc_1.createVerifiablePresentationJwt(vpPayload, issuer);
    }
}
exports.W3CVerifiedCredential = W3CVerifiedCredential;
//# sourceMappingURL=W3CVerifiedCredential.js.map