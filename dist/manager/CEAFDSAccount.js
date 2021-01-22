"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEAFDSAccounts = void 0;
const ethers_1 = require("ethers");
const CEAFDSWalletManager_1 = require("./CEAFDSWalletManager");
let FDS = require('FDS.js');
class CEAFDSAccounts {
    constructor(client, keyService, keyStorage) {
        this.client = client;
        this.keyService = keyService;
        this.keyStorage = keyStorage;
        this.client = new FDS({
            swarmGateway: 'https://swarm.fairdatasociety.org',
            ethGateway: 'https://geth-noordung.fairdatasociety.org',
            chainID: '3'
        });
        this._keyService = keyService;
        this._keyStorage = keyStorage;
    }
    createWallet(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const mnemonic = CEAFDSWalletManager_1.CEAFDSWalletManager.generateMnemonic();
            const fdsWallet = new CEAFDSWalletManager_1.CEAFDSWalletManager(this.client, this._keyService, this._keyStorage);
            const ethersWallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
            const privateKey = ethersWallet.privateKey;
            const address = ethersWallet.address;
            const options = { customId: address, mnemonic: mnemonic };
            const user = yield this.client.RestoreAccountFromPrivateKey(username, password, privateKey);
            const wallet = yield fdsWallet.createWallet2(password, options.mnemonic);
            fdsWallet.setUser(user);
            return { paid: wallet };
        });
    }
}
exports.CEAFDSAccounts = CEAFDSAccounts;
