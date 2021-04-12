import { DID } from 'dids';
export declare class W3CVerifiedCredential {
    constructor();
    /**
     * Issue a VC Credential
     * @param did DID
     * @param issuer Issuer
     * @param holderInfo Holder Info
     */
    issueCredential(did: DID, issuer: any, holderInfo: any): Promise<string>;
    /**
     * Creates a VP
     * @param credential Verified Credential
     * @param issuer Issuer
     */
    createVerifiablePresentation(credential: string, issuer: any): Promise<string>;
}
