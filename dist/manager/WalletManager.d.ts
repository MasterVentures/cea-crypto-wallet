import { KeyStorage } from '..';
import { KeyService } from '..';
import { KeyStorageModel } from '../key-storage/KeyStorageModel';
import Web3 from 'web3';
export interface WalletManager {
    getKeyService(): KeyService;
    getKeyStorage(): KeyStorage;
    createWallet(password: string, mnemonic: string): Promise<KeyStorageModel>;
    createBlockchainWallet(url: string, id: string, password: string): Promise<Web3>;
    generateMnemonic(): string;
    unlockWallet(id: string, passphrase: string): Promise<KeyStorageModel>;
    getWalletAddress(id: string): Promise<string>;
}
