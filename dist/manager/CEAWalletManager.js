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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEAWalletManager = void 0;
const ethers_1 = require("ethers");
const web3_1 = __importDefault(require("web3"));
const ProviderBridge = require('ethers-web3-bridge');
class CEAWalletManager {
    constructor(_keyService, _keyStorage) {
        this._keyService = _keyService;
        this._keyStorage = _keyStorage;
    }
    getKeyService() {
        return this._keyService;
    }
    getKeyStorage() {
        return this._keyStorage;
    }
    createWallet(password, mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ethers_1.ethers.utils.HDNode.isValidMnemonic(mnemonic)) {
                throw new Error('The Mnemonic is not valid.');
            }
            const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
            const keystoreSeed = yield wallet.encrypt(password);
            const { stores, exports } = yield this._keyService.generateKeys(mnemonic);
            const _id = Buffer.from(ethers_1.ethers.utils.randomBytes(100)).toString('base64');
            const ks = {
                _id,
                keypairs: stores,
                keystoreSeed,
                mnemonic,
                keypairExports: exports,
                created: new Date()
            };
            yield this._keyStorage.enableCrypto(password);
            const result = yield this._keyStorage.save(ks);
            if (!result.ok) {
                throw new Error('Wallet not saved to storage.');
            }
            return ks;
        });
    }
    createBlockchainWallet(url, wsurl, options, id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const ks = yield this._keyStorage.find(id);
            yield this._keyStorage.enableCrypto(password);
            const _web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider(wsurl, options));
            const provider = new ethers_1.ethers.providers.JsonRpcProvider(url);
            const wallet = ethers_1.ethers.Wallet.fromMnemonic(ks.mnemonic);
            wallet.connect(provider);
            const mnemonicWallet = ethers_1.ethers.Wallet.fromMnemonic(ks.mnemonic);
            const { privateKey } = mnemonicWallet;
            _web3.eth.accounts.wallet.clear().add(privateKey);
            const result = {
                web3Instance: _web3,
                wallet,
                provider: yield provider.getNetwork()
            };
            return result;
        });
    }
    generateMnemonic() {
        return ethers_1.ethers.Wallet.createRandom().mnemonic;
    }
    unlockWallet(id, passphrase) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._keyStorage.enableCrypto(passphrase);
                return yield this._keyStorage.find(id);
            }
            catch (e) {
                return null;
            }
        });
    }
    getWalletAddress(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ks = yield this._keyStorage.find(id);
                const wallet = ethers_1.ethers.Wallet.fromMnemonic(ks.mnemonic);
                const { address } = wallet;
                return address;
            }
            catch (ex) {
                console.log(ex);
            }
        });
    }
}
exports.CEAWalletManager = CEAWalletManager;
