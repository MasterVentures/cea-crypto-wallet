import { ethers } from 'ethers';
import { FDSWalletManager } from './FDSWalletManager';
import { CEAFDSWalletManager } from './CEAFDSWalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
import { KeyStorageModel } from '../key-storage/KeyStorageModel';

export class CEAFDSAccounts implements FDSWalletManager {
    
    constructor(public client:any,
    public keyService: KeyService, 
    public keyStorage: KeyStorage){
    }

	public getKeyService() {
		return this.keyService;
	}	

	public getKeyStorage() {
		return this.keyStorage;
	}

	generateMnemonic(): string {
		return ethers.Wallet.createRandom().mnemonic;
	}
    
    async createWallet(username:string, password:string){
        const mnemonic = this.generateMnemonic();
        const fdsWallet = new CEAFDSWalletManager(this.client);
        
        const ethersWallet = ethers.Wallet.fromMnemonic(mnemonic);
        const privateKey = ethersWallet.privateKey;
        const address = ethersWallet.address;
        const options = { customId : address, mnemonic : mnemonic };

        const user = await this.client.RestoreAccountFromPrivateKey(username, password, privateKey);

        const wallet = await this.createWallet2(password, options.mnemonic);
        fdsWallet.setUser(user);
        return { paid: wallet }; 
    }

	private async createWallet2(
		password: string,
		mnemonic: string
	){
		if (!ethers.utils.HDNode.isValidMnemonic(mnemonic)) {
			throw new Error('The Mnemonic is not valid.');
		}

		const wallet = ethers.Wallet.fromMnemonic(mnemonic);

		const keystoreSeed = await wallet.encrypt(password);
		const { stores, exports } = await this.keyService.generateKeys(mnemonic);
		const _id = Buffer.from(ethers.utils.randomBytes(100)).toString('base64');

		const ks: KeyStorageModel = {
			_id,
			keypairs: stores,
			keystoreSeed,
			mnemonic,
			keypairExports: exports,
			created: new Date()
		};

		await this.keyStorage.enableCrypto(password);
		const result = await this.keyStorage.save(ks);
		if (!result.ok) {
			throw new Error('Wallet not saved to storage.');
		}
		return wallet;
	}
}