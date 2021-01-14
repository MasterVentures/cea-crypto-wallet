import  Web3 from 'web3';
import { ethers } from 'ethers';
import { EtherscanProvider } from 'ethers/providers';

export interface WalletModel {
	web3Instance: Web3;
	wallet: ethers.Wallet;
	_wallet: any;
	provider: ethers.utils.Network
}