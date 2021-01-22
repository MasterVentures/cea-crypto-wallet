import { CEAFDSWalletManager } from './CEAFDSWalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
export declare class CEAFDSAccounts {
    client: any;
    keyService: KeyService;
    keyStorage: KeyStorage;
    _keyService: KeyService;
    _keyStorage: KeyStorage;
    constructor(client: any, keyService: KeyService, keyStorage: KeyStorage);
    createWallet(username: string, password: string): Promise<{
        paid: CEAFDSWalletManager;
    }>;
}
