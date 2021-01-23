import { WalletManager } from './WalletManager';
import { ethers } from 'ethers';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
import { KeyStorageModel } from '../key-storage/KeyStorageModel';
import { WalletModel } from '../key-storage/WalletModel';
export declare class CEAWalletManager implements WalletManager {
    _keyService: KeyService;
    _keyStorage: KeyStorage;
    constructor(_keyService: KeyService, _keyStorage: KeyStorage);
    getKeyService(): KeyService;
    getKeyStorage(): KeyStorage;
    static generateMnemonic(): string;
    createWallet(password: string, mnemonic: string): Promise<KeyStorageModel>;
    createWallet2(password: string, mnemonic: string): Promise<ethers.Wallet>;
    createFDSWallet(password: string, id: string): Promise<{
        paid: ethers.Wallet;
    }>;
    createBlockchainWallet(wsurl: string, options: any, id: string, password: string): Promise<WalletModel>;
    generateMnemonic(): string;
    unlockWallet(id: string, passphrase: string): Promise<KeyStorageModel>;
    getWalletAddress(id: string): Promise<string>;
}
