import { KeyStorage } from '..';
import { KeyService } from '..';
import { KeyStorageModel } from '../key-storage/KeyStorageModel';
import { WalletModel } from '../key-storage/WalletModel';

export interface FDSWalletManager {
	getKeyService(): KeyService;
	getKeyStorage(): KeyStorage;
	createWallet(username: string, password: string);
	generateMnemonic(): string;
}
