import { VerifiableCredential } from 'did-jwt-vc';
export interface ISignerProps {
    verificationMethod: string;
    alg: string;
}
export interface IVerifiedProps {
    verified: boolean;
    error: any;
}
export interface IIssueProps {
    verificationMethod: string;
    proofPurpose: string;
    created: Date;
    controller: string;
    domain: string;
    challenge: string;
    proofType: string;
}
export interface ITransferProps {
    currency: string;
    address?: string;
    key?: string;
    recipient: string;
}
export interface IQueryProps {
    type: 'QueryByFrame' | 'PresentationExchange';
    query: any;
}
export interface IUniversalWallet {
    import(mnemonic: string, passphrase: string): Promise<object>;
    export(walletId: string, passphrase: string): Promise<object>;
    unlock(walletId: string, passphrase: string): Promise<object>;
    lock(walletId: string): Promise<object>;
    signRaw(buf: Uint8Array, options: ISignerProps): Promise<object>;
    verifyRaw(buf: Uint8Array, options: ISignerProps): Promise<object>;
    verify(vc: VerifiableCredential): Promise<object>;
    issue(vc: VerifiableCredential, options: IIssueProps): Promise<object>;
    prove(ids: string[], options: IIssueProps): Promise<object>;
    transfer(options: ITransferProps): Promise<object>;
    query(search: IQueryProps): Promise<object>;
}
