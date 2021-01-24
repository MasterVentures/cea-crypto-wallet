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
class CEAFDSAccounts {
    constructor(client, keyService, keyStorage) {
        this.client = client;
        this.keyService = keyService;
        this.keyStorage = keyStorage;
    }
    getKeyService() {
        return this.keyService;
    }
    getKeyStorage() {
        return this.keyStorage;
    }
    generateMnemonic() {
        return ethers_1.ethers.Wallet.createRandom().mnemonic;
    }
    createWallet(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const mnemonic = this.generateMnemonic();
            const fdsWallet = new CEAFDSWalletManager_1.CEAFDSWalletManager(this.client);
            const ethersWallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
            const privateKey = ethersWallet.privateKey;
            const address = ethersWallet.address;
            const options = { customId: address, mnemonic: mnemonic };
            const user = yield this.client.RestoreAccountFromPrivateKey(username, password, privateKey);
            const wallet = yield this.createWallet2(password, options.mnemonic);
            fdsWallet.setUser(user);
            return { paid: wallet };
        });
    }
    createWallet2(password, mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ethers_1.ethers.utils.HDNode.isValidMnemonic(mnemonic)) {
                throw new Error('The Mnemonic is not valid.');
            }
            const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
            const keystoreSeed = yield wallet.encrypt(password);
            const { stores, exports } = yield this.keyService.generateKeys(mnemonic);
            const _id = Buffer.from(ethers_1.ethers.utils.randomBytes(100)).toString('base64');
            const ks = {
                _id,
                keypairs: stores,
                keystoreSeed,
                mnemonic,
                keypairExports: exports,
                created: new Date()
            };
            yield this.keyStorage.enableCrypto(password);
            const result = yield this.keyStorage.save(ks);
            if (!result.ok) {
                throw new Error('Wallet not saved to storage.');
            }
            return wallet;
        });
    }
}
exports.CEAFDSAccounts = CEAFDSAccounts;
