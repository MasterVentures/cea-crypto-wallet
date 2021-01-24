import { FDSWalletManager } from './FDSWalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
export declare const createFDSWalletManager: (keyService: KeyService, storage: KeyStorage) => FDSWalletManager;
