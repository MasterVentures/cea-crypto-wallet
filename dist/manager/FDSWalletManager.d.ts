import { KeyStorage } from '..';
import { KeyService } from '..';
export interface FDSWalletManager {
    getKeyService(): KeyService;
    getKeyStorage(): KeyStorage;
    createWallet(username: string, password: string): any;
    generateMnemonic(): string;
    createWallet2(password: string, mnemonic: string): any;
}
