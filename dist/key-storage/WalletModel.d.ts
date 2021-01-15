import Web3 from 'web3';
export interface WalletModel {
    web3Instance: Web3;
    walletInstance: any;
    network: number;
}
