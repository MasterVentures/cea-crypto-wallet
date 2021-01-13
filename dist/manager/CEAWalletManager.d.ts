import { WalletManager } from './WalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
import { KeyStorageModel } from '../key-storage/KeyStorageModel';
import { WalletModel } from '../key-storage/WalletModel';
export declare class CEAWalletManager implements WalletManager {
    private _keyService;
    private _keyStorage;
    constructor(_keyService: KeyService, _keyStorage: KeyStorage);
    getKeyService(): KeyService;
    getKeyStorage(): KeyStorage;
    createWallet(password: string, mnemonic: string): Promise<KeyStorageModel>;
    createBlockchainWallet(url: string, wsurl: string, options: any, id: string, password: string): Promise<WalletModel>;
    generateMnemonic(): string;
    unlockWallet(id: string, passphrase: string): Promise<KeyStorageModel>;
    getWalletAddress(id: string): Promise<string>;
}
