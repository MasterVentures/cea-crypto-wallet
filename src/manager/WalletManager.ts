import { Wallet } from 'ethers';
import { KeyStorage } from '..';
import { KeyService } from '..';
import { KeyStorageModel } from '../key-storage/KeyStorageModel';
import { WalletModel } from '../key-storage/WalletModel';
import { CEAFDSWalletManager } from './CEAFDSWalletManager';

export interface WalletManager {
	getKeyService(): KeyService;
	getKeyStorage(): KeyStorage;
	createWallet(password: string, mnemonic: string): Promise<KeyStorageModel>;
	createFDSWallet(passwor: string, options: any);
	createBlockchainWallet(wsurl: string, options: any, id: string, password: string):Promise<WalletModel>;
	generateMnemonic(): string;
	unlockWallet(id: string, passphrase: string): Promise<KeyStorageModel>;
	getWalletAddress(id: string): Promise<string>;
}
