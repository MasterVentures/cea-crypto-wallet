import { VerifiableCredential } from 'did-jwt-vc';
import { Wallet } from './Wallet';
import { IIssueProps, IQueryProps, ISignerProps, ITransferProps, IUniversalWallet } from './IUniversalWallet';
export declare class UniversalWallet extends Wallet implements IUniversalWallet {
    /**
     * Imports a key
     * @param mnemonic Mnemonic
     * @param passphrase Passphrase
     */
    import(mnemonic: string, passphrase: string): Promise<any>;
    export(walletId: string, passphrase: string): Promise<object>;
    unlock(walletId: string, passphrase: string): Promise<object>;
    lock(passphrase: string): Promise<object>;
    signRaw(buf: Uint8Array, options: ISignerProps): Promise<object>;
    verifyRaw(buf: Uint8Array, options: ISignerProps): Promise<object>;
    verify(vc: VerifiableCredential): Promise<object>;
    issue(vc: VerifiableCredential, options: IIssueProps): Promise<object>;
    prove(ids: string[], options: IIssueProps): Promise<object>;
    transfer(options: ITransferProps): Promise<object>;
    query(search: IQueryProps): Promise<object>;
}
