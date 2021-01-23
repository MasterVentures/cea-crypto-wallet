import { Wallet } from 'ethers';
import { KeyStorage } from '..';
import { KeyService } from '..';
import { KeyStorageModel } from '../key-storage/KeyStorageModel';
import { WalletModel } from '../key-storage/WalletModel';
//import { CEAFDSWalletManager } from './CEAFDSWalletManager';

export interface WalletManager {
	getKeyService(): KeyService;
	getKeyStorage(): KeyStorage;
	createWallet(password: string, mnemonic: string): Promise<KeyStorageModel>;
	/*createWallet2(password: string, mnemonic: string);
	createFDSWallet(password: string, id: string);*/
	createBlockchainWallet(wsurl: string, options: any, id: string, password: string):Promise<WalletModel>;
	createMetamaskWallet(ethereum: any):Promise<WalletModel>;
	generateMnemonic(): string;
	unlockWallet(id: string, passphrase: string): Promise<KeyStorageModel>;
	getWalletAddress(id: string): Promise<string>;
}
