import  Web3 from 'web3';
import { ethers } from 'ethers';

export interface WalletModel {
	web3Instance: Web3;
	wallet: ethers.Wallet;
}