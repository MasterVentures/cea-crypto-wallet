import { WalletManager } from './WalletManager';
import { ethers, providers } from 'ethers';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
import { KeyStorageModel } from '../key-storage/KeyStorageModel';
import { WalletModel } from '../key-storage/WalletModel';
import  Web3 from 'web3';
const ProviderBridge = require('ethers-web3-bridge');

export class CEAWalletManager implements WalletManager {
	//URL = 'https://rinkeby.infura.io/v3/6d8bfebd6db24c3cb3f3d50839e1c5be';
	constructor(
		private _keyService: KeyService,
		private _keyStorage: KeyStorage
	) {}

	public getKeyService() {
		return this._keyService;
	}

	public getKeyStorage() {
		return this._keyStorage;
	}

	async createWallet(
		password: string,
		mnemonic: string
	): Promise<KeyStorageModel> {
		if (!ethers.utils.HDNode.isValidMnemonic(mnemonic)) {
			throw new Error('The Mnemonic is not valid.');
		}

		const wallet = ethers.Wallet.fromMnemonic(mnemonic);

		const keystoreSeed = await wallet.encrypt(password);
		const { stores, exports } = await this._keyService.generateKeys(mnemonic);
		const _id = Buffer.from(ethers.utils.randomBytes(100)).toString('base64');

		const ks: KeyStorageModel = {
			_id,
			keypairs: stores,
			keystoreSeed,
			mnemonic,
			keypairExports: exports,
			created: new Date()
		};

		await this._keyStorage.enableCrypto(password);
		const result = await this._keyStorage.save(ks);
		if (!result.ok) {
			throw new Error('Wallet not saved to storage.');
		}
		return ks;
	}

	async createBlockchainWallet(wsurl: string, options: any, id: string, password: string){

		const ks = await this._keyStorage.find<KeyStorageModel>(id);

		await this._keyStorage.enableCrypto(password);

		// Connect to a standard Ethers Provider
		const _provider = new Web3.providers.WebsocketProvider(wsurl, options);
		const _web3 = new Web3 (_provider);
		const wallet = ethers.Wallet.fromMnemonic(ks.mnemonic);
		const walletInstance =_web3.eth.accounts.wallet.add(wallet.privateKey);
		_web3.defaultAccount = walletInstance.address;
		const result: WalletModel = {
			web3Instance: _web3,
			walletInstance,
			network: await _web3.eth.getChainId()
		}
		return result;
	}

	generateMnemonic(): string {
		return ethers.Wallet.createRandom().mnemonic;
	}

	async unlockWallet(id: string, passphrase: string): Promise<KeyStorageModel> {
		try {
			await this._keyStorage.enableCrypto(passphrase);
			return await this._keyStorage.find<KeyStorageModel>(id);
		} catch (e) {
			return null;
		}
	}

	async getWalletAddress(id: string, password: string): Promise<string> {
		try{
			const ks = await this._keyStorage.find<KeyStorageModel>(id);
			await this._keyStorage.enableCrypto(password);
			const wallet = ethers.Wallet.fromMnemonic(ks.mnemonic);
			const { address } = wallet;
			return address;
		}
		catch(ex){
			console.log(ex);
		}
	}
}
