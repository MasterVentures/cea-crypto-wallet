import { ethers } from 'ethers';
import { CEAFDSWalletManager } from './CEAFDSWalletManager';
import { CEAWalletManager } from './CEAWalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
let FDS = require('FDS.js');

export class CEAFDSAccounts {
    
    _keyService: KeyService;
    _keyStorage: KeyStorage;

    constructor(public client:any,
    public keyService: KeyService, 
    public keyStorage: KeyStorage){
        this.client = new FDS({
            swarmGateway: 'https://swarm.fairdatasociety.org',
            ethGateway: 'https://geth-noordung.fairdatasociety.org',
            chainID: '3'
        }); 
        this._keyService = keyService;
        this._keyStorage = keyStorage;
    }
    
    async createWallet(username:string, password:string){
        const mnemonic = CEAFDSWalletManager.generateMnemonic();
        const fdsWallet = new CEAFDSWalletManager(this.client, this._keyService, this._keyStorage);

        const ethersWallet = ethers.Wallet.fromMnemonic(mnemonic);
        const privateKey = ethersWallet.privateKey;
        const address = ethersWallet.address;
        const options = { customId : address, mnemonic : mnemonic };

        const user = await this.client.RestoreAccountFromPrivateKey(username, password, privateKey);

        const wallet = await fdsWallet.createWallet2(password, options.mnemonic);
        fdsWallet.setUser(user);
        return { paid: wallet }; 
    }
}