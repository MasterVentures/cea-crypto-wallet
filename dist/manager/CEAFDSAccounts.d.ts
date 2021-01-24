import { ethers } from 'ethers';
import { FDSWalletManager } from './FDSWalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
export declare class CEAFDSAccounts implements FDSWalletManager {
    client: any;
    keyService: KeyService;
    keyStorage: KeyStorage;
    constructor(client: any, keyService: KeyService, keyStorage: KeyStorage);
    getKeyService(): KeyService;
    getKeyStorage(): KeyStorage;
    generateMnemonic(): string;
    createWallet(username: string, password: string): Promise<{
        paid: ethers.Wallet;
    }>;
    private createWallet2;
}
