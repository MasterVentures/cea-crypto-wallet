import { CEAWalletManager } from './CEAWalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
export declare class CEAFDSWalletManager extends CEAWalletManager {
    fds: any;
    keyService: KeyService;
    keyStorage: KeyStorage;
    fdsUser: any;
    constructor(fds: any, keyService: KeyService, keyStorage: KeyStorage);
    setUser(user: any): void;
    getUser(): any;
}
