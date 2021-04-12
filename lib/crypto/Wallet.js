"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.XDVWalletSchema = exports.AddressSchema = exports.KeyStore = exports.WalletOptions = exports.AlgorithmType = void 0;
const tslib_1 = require("tslib");
const elliptic_1 = require("elliptic");
const ethers_1 = require("ethers");
const ed25519_hd_key_1 = require("ed25519-hd-key");
const class_validator_1 = require("class-validator");
const JOSEService_1 = require("./JOSEService");
const node_jose_1 = require("node-jose");
const JWTService_1 = require("./JWTService");
const KeyConvert_1 = require("./KeyConvert");
const LDCryptoTypes_1 = require("./LDCryptoTypes");
const rxjs_1 = require("rxjs");
const utils_1 = require("ethers/lib/utils");
const web3_1 = tslib_1.__importDefault(require("web3"));
const DIDManager_1 = require("../3id/DIDManager");
const dids_1 = require("dids");
const did_jwt_1 = require("did-jwt");
const eth_crypto_1 = tslib_1.__importDefault(require("eth-crypto"));
const rxdb_1 = require("rxdb");
const moment_1 = tslib_1.__importDefault(require("moment"));
const key_did_resolver_1 = tslib_1.__importDefault(require("@ceramicnetwork/key-did-resolver"));
var AlgorithmType;
(function (AlgorithmType) {
    AlgorithmType[AlgorithmType["RSA"] = 0] = "RSA";
    AlgorithmType[AlgorithmType["ES256K"] = 1] = "ES256K";
    AlgorithmType[AlgorithmType["P256"] = 2] = "P256";
    AlgorithmType[AlgorithmType["ED25519"] = 3] = "ED25519";
    AlgorithmType[AlgorithmType["BLS"] = 4] = "BLS";
    AlgorithmType[AlgorithmType["P256_JWK_PUBLIC"] = 5] = "P256_JWK_PUBLIC";
    AlgorithmType[AlgorithmType["ED25519_JWK_PUBLIC"] = 6] = "ED25519_JWK_PUBLIC";
    AlgorithmType[AlgorithmType["ES256K_JWK_PUBLIC"] = 7] = "ES256K_JWK_PUBLIC";
    AlgorithmType[AlgorithmType["RSA_JWK_PUBLIC"] = 8] = "RSA_JWK_PUBLIC";
    AlgorithmType[AlgorithmType["RSA_PEM_PUBLIC"] = 9] = "RSA_PEM_PUBLIC";
})(AlgorithmType = exports.AlgorithmType || (exports.AlgorithmType = {}));
class WalletOptions {
}
tslib_1.__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsDefined()
], WalletOptions.prototype, "password", void 0);
tslib_1.__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString()
], WalletOptions.prototype, "mnemonic", void 0);
exports.WalletOptions = WalletOptions;
class KeyStore {
    constructor() { }
}
exports.KeyStore = KeyStore;
exports.AddressSchema = {
    title: 'XDV Address Schema',
    version: 0,
    description: 'A RxDB XDV Adress Account schema',
    type: 'object',
    properties: {
        key: {
            type: 'string',
            primary: true,
        },
        value: {
            type: 'string',
        },
    },
    encrypted: ['value'],
};
exports.XDVWalletSchema = {
    title: 'XDV Wallet Schema',
    version: 0,
    description: 'A RxDB XDV Wallet Account schema',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            primary: true,
        },
        created: {
            type: 'number',
        },
        isLocked: {
            type: 'boolean',
        },
        currentKeystoreId: {
            type: 'string',
        },
        attributes: {
            type: 'array',
        },
        keystores: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    walletId: {
                        type: 'string',
                    },
                    mnemonic: {
                        type: 'string',
                    },
                    keystoreSeed: {
                        type: 'string',
                    },
                    keypairs: {
                        type: 'object',
                    },
                    keypairExports: {
                        type: 'object',
                    },
                    publicKeys: {
                        type: 'object',
                    },
                    path: {
                        type: 'string',
                    },
                },
            },
        },
        description: {
            type: 'string',
        },
    },
    encrypted: ['keystores'],
};
const PouchdbAdapterIdb = tslib_1.__importStar(require("pouchdb-adapter-idb"));
const PouchdbAdapterMemory = tslib_1.__importStar(require("pouchdb-adapter-memory"));
const encryption_1 = require("rxdb/plugins/encryption");
const validate_1 = require("rxdb/plugins/validate");
const update_1 = require("rxdb/plugins/update");
const key_did_provider_ed25519_1 = require("key-did-provider-ed25519");
/**
 * XDV Wallet for DID and VC use cases
 */
class Wallet {
    /**
     * Creates a new Wallet
     * @param param0 isWeb, true if used by browser otherwise false
     */
    constructor({ isWeb } = { isWeb: false }) {
        this.DB_NAME = 'xdv:universal:wallet';
        this.onRequestPassphraseSubscriber = new rxjs_1.Subject();
        this.onRequestPassphraseWallet = new rxjs_1.Subject();
        this.onSignExternal = new rxjs_1.Subject();
        this.isWeb = false;
        rxdb_1.addRxPlugin(update_1.RxDBUpdatePlugin);
        rxdb_1.addRxPlugin(validate_1.RxDBValidatePlugin);
        rxdb_1.addRxPlugin(encryption_1.RxDBEncryptionPlugin);
        if (isWeb) {
            rxdb_1.addRxPlugin(PouchdbAdapterIdb);
        }
        else {
            rxdb_1.addRxPlugin(PouchdbAdapterMemory);
        }
        this.isWeb = isWeb;
    }
    /**\
     * Opens a db
     */
    async open(accountName, passphrase) {
        try {
            if (!class_validator_1.matches(accountName, /^[a-z][_$a-z0-9]*$/)) {
                throw new Error('Invalid account name');
            }
            if (passphrase.length < 11) {
                throw new Error('Passphrase must be 12 or more characters');
            }
            this.db = await rxdb_1.createRxDatabase({
                name: accountName,
                adapter: this.isWeb ? 'idb' : 'memory',
                multiInstance: true,
                password: passphrase,
                ignoreDuplicate: true
            });
            return this;
        }
        catch (e) {
            // already exists
            throw e;
        }
    }
    /**
     * Enrolls account, returns false if already exists, otherwise account model
     * @param options create or load wallet options, password must be at least 12 chars
     */
    async enrollAccount(options) {
        await this.db.addCollections({
            accounts: {
                schema: exports.XDVWalletSchema,
            },
            address: {
                schema: exports.AddressSchema
            }
        });
        const accounts = this.db.accounts;
        const accountModel = {
            id: 'xdv:account',
            created: moment_1.default().unix(),
            isLocked: false,
            description: options.accountName,
            attributes: [],
            currentKeystoreId: '',
            keystores: [],
        };
        if (!((await this.db.accounts.findByIds(['xdv:account'])).size > 0)) {
            return accounts.insert(accountModel);
        }
    }
    async close() {
        await this.db.destroy();
    }
    // /**
    //  * Gets a public key from storage
    //  * @param id
    //  * @param algorithm
    //  */
    // public async getPublicKey(id: string) {
    //   const content = await this.db.get(id)
    //   return await JWK.asKey(JSON.parse(content.key), 'jwk')
    // }
    async getUniversalWalletKey(alg) {
        const jwk = node_jose_1.JWK.createKey('oct', 256, {
            alg,
        });
    }
    /**
     * Creates an universal wallet for ES256K
     * @param options { passphrase, walletid, registry, rpcUrl }
     */
    async createES256K(options) {
        let ks;
        let account = await this.getAccount();
        //open an existing wallet
        ks = account.get('keystores').find((w) => w.walletId === options.walletId);
        if (!ks)
            throw new Error('No wallet selected');
        const kp = new elliptic_1.ec('secp256k1');
        const kpInstance = kp.keyFromPrivate(ks.keypairs.ES256K);
        const didManager = new DIDManager_1.DIDManager();
        const address = did_jwt_1.toEthereumAddress(kpInstance.getPublic('hex'));
        const encrypt = async (pub, message) => {
            const data = await eth_crypto_1.default.encryptWithPublicKey(pub.replace('0x', ''), message);
            return eth_crypto_1.default.cipher.stringify(data);
        };
        const decrypt = async (cipher) => {
            const data = await eth_crypto_1.default.decryptWithPrivateKey(ks.keypairs.ES256K, eth_crypto_1.default.cipher.parse(cipher));
            return data;
        };
        // Buffer.from(pub, 'hex')
        const did = didManager.createEthrDID(address, kpInstance, options.registry, options.rpcUrl);
        return {
            did,
            secureMessage: {
                encrypt,
                decrypt,
            },
            address,
            privateKey: kpInstance.getPrivate('hex'),
            publicKey: kpInstance.getPublic('hex'),
        };
    }
    /**
     * Creates an universal wallet for Ed25519
     * @param nodeurl EVM Node
     * @param options { passphrase, walletid }
     */
    async createEd25519(options) {
        let wallet = new Wallet();
        let ks;
        let account = await this.getAccount(options.passphrase);
        //open an existing wallet
        ks = account.get('keystores').find((w) => w.walletId === options.walletId);
        if (!ks)
            throw new Error('No wallet selected');
        const kp = new elliptic_1.eddsa('ed25519');
        const kpInstance = kp.keyFromSecret(ks.keypairs.ED25519);
        const didManager = new DIDManager_1.DIDManager();
        const { did, getIssuer } = await didManager.create3ID_Ed25519(kpInstance);
        return {
            did,
            getIssuer,
            privateKey: kpInstance.getSecret(),
            publicKey: kpInstance.getPublic(),
        };
    }
    /**
     * Creates an universal wallet  for Web3 Providers
     * @param options { passphrase, walletid, registry, rpcUrl }
     */
    async createWeb3Provider(options) {
        //Options will have 2 variables (wallet id and passphrase)
        let web3;
        let ks;
        let account = await this.getAccount();
        web3 = new web3_1.default(options.rpcUrl);
        //open an existing wallet
        ks = account.get('keystores').find((w) => w.walletId === options.walletId);
        if (!ks)
            throw new Error('No wallet selected');
        const privateKey = '0x' + ks.keypairs.ES256K;
        web3.eth.accounts.wallet.add(privateKey);
        const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        web3.defaultAccount = address;
        const didManager = new DIDManager_1.DIDManager();
        const ES256k = new elliptic_1.ec('secp256k1');
        const encrypt = async (pub, message) => {
            const data = await eth_crypto_1.default.encryptWithPublicKey(pub.replace('0x', ''), message);
            return eth_crypto_1.default.cipher.stringify(data);
        };
        const decrypt = async (cipher) => {
            const data = await eth_crypto_1.default.decryptWithPrivateKey(ks.keypairs.ES256K, eth_crypto_1.default.cipher.parse(cipher));
            return data;
        };
        const { did, issuer } = await didManager.create3IDWeb3(address, ES256k.keyFromPrivate(ks.keypairs.ES256K), web3, options.registry);
        return {
            did,
            secureMessage: {
                encrypt,
                decrypt,
            },
            publicKey: ES256k.keyFromPrivate(ks.keypairs.ES256K).getPublic(),
            issuer,
            web3,
            address,
        };
    }
    // /**
    //  * Sets a public key in storage
    //  * @param id
    //  * @param algorithm
    //  * @param value
    //  */
    // public async setPublicKey(
    //   id: string,
    //   algorithm: AlgorithmTypeString,
    //   value: object,
    // ) {
    //   if (
    //     [
    //       AlgorithmType.P256_JWK_PUBLIC,
    //       AlgorithmType.RSA_JWK_PUBLIC,
    //       AlgorithmType.ED25519_JWK_PUBLIC,
    //       AlgorithmType.ES256K_JWK_PUBLIC,
    //     ].includes(AlgorithmType[algorithm])
    //   ) {
    //     await this.db.put({
    //       _id: id,
    //       key: value,
    //     })
    //   }
    // }
    /**
     * Adds a set of ES256K and ED25519 Wallets
     * @param options
     */
    async addWallet(options = {}) {
        let account = await this.getAccount();
        if (!account)
            throw new Error('No account');
        let id = Buffer.from(ethers_1.ethers.utils.randomBytes(100)).toString('base64');
        let mnemonic = options.mnemonic;
        let ethersWallet;
        if (mnemonic) {
            ethersWallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic);
        }
        else {
            ethersWallet = ethers_1.ethers.Wallet.createRandom();
            mnemonic = ethersWallet.mnemonic.phrase;
        }
        let keystores = new KeyStore();
        let keyExports = new KeyStore();
        // ED25519
        let kp = this.getEd25519(mnemonic);
        keystores.ED25519 = kp.getSecret('hex');
        keyExports.ED25519 = await KeyConvert_1.KeyConvert.getEd25519(kp);
        keyExports.ED25519.ldJsonPublic = await KeyConvert_1.KeyConvert.createLinkedDataJsonFormat(LDCryptoTypes_1.LDCryptoTypes.Ed25519, kp, false);
        // ES256K
        const kpec = this.getES256K(mnemonic);
        keystores.ES256K = kpec.getPrivate('hex');
        keyExports.ES256K = await KeyConvert_1.KeyConvert.getES256K(kpec);
        keyExports.ES256K.ldJsonPublic = await KeyConvert_1.KeyConvert.createLinkedDataJsonFormat(LDCryptoTypes_1.LDCryptoTypes.JWK, 
        // @ts-ignore
        { publicJwk: JSON.parse(keyExports.ES256K.ldSuite.publicKeyJwk) }, false);
        const keystore = {
            walletId: id,
            keypairs: keystores,
            mnemonic: mnemonic,
            keypairExports: keyExports,
        };
        const ksArray = account.get('keystores');
        const row = await account.update({
            $set: {
                currentKeystoreId: id,
                keystores: [...ksArray, keystore],
            },
        });
        return id;
    }
    /**
     * Get private key as elliptic keypair
     * @param algorithm
     * @param keystoreId
     */
    async getPrivateKey(algorithm, keystoreId) {
        let account = await this.getAccount();
        //open an existing wallet
        const ks = account.get('keystores').find((w) => w._id === keystoreId);
        if (!ks)
            throw new Error('No wallet selected');
        if (algorithm === 'ED25519') {
            const kp = new elliptic_1.eddsa('ed25519');
            return kp.keyFromSecret(ks.keypairs.ED25519);
        }
        else if (algorithm === 'P256') {
            const kp = new elliptic_1.ec('p256');
            return kp.keyFromPrivate(ks.keypairs.P256);
        }
        else if (algorithm === 'ES256K') {
            const kp = new elliptic_1.ec('secp256k1');
            return kp.keyFromPrivate(ks.keypairs.ES256K);
        }
    }
    /**
     * Get private key exports
     * @param algorithm
     * @param keystoreId
     */
    async getPrivateKeyExports(algorithm, keystoreId) {
        let account = await this.getAccount();
        //open an existing wallet
        const ks = account.get('keystores').find((w) => w._id === keystoreId);
        if (!ks)
            throw new Error('No wallet selected');
        return ks.keypairExports[algorithm];
    }
    async canUse() {
        let ticket = null;
        const init = this.accepted;
        return new Promise((resolve) => {
            ticket = setInterval(() => {
                if (this.accepted !== init) {
                    clearInterval(ticket);
                    resolve(this.accepted);
                    this.accepted = undefined;
                    return;
                }
            }, 1000);
        });
    }
    /**
     * Signs with selected algorithm
     * @param algorithm Algorithm
     * @param payload Payload as buffer
     * @param options options
     */
    async sign(algorithm, keystoreId, payload) {
        this.onRequestPassphraseSubscriber.next({
            type: 'request_tx',
            payload,
            algorithm,
        });
        const canUseIt = await this.canUse();
        let key;
        if (canUseIt) {
            if (algorithm === 'ED25519') {
                key = await this.getPrivateKey(algorithm, keystoreId);
                return [null, key.sign(payload).toHex()];
            }
            else if (algorithm === 'ES256K') {
                key = await this.getPrivateKey(algorithm, keystoreId);
                return [null, key.sign(payload).toHex()];
            }
        }
        return [new Error('invalid_passphrase')];
    }
    /**
     * Signs a JWT for single recipient
     * @param algorithm Algorithm
     * @param payload Payload as buffer
     * @param options options
     */
    async signJWT(algorithm, keystoreId, payload, options) {
        this.onRequestPassphraseSubscriber.next({
            type: 'request_tx',
            payload,
            algorithm,
        });
        const canUseIt = await this.canUse();
        if (canUseIt) {
            const { pem } = await this.getPrivateKeyExports(algorithm, keystoreId);
            return [null, await JWTService_1.JWTService.sign(pem, payload, options)];
        }
        return [new Error('invalid_passphrase')];
    }
    /**
     * Signs JWT using public keys
     * @param publicKey
     * @param payload
     * @param options
     */
    async signJWTFromPublic(publicKey, payload, options) {
        this.onRequestPassphraseSubscriber.next({ type: 'request_tx', payload });
        const canUseIt = await this.canUse();
        if (canUseIt) {
            return [null, JWTService_1.JWTService.sign(publicKey, payload, options)];
        }
        return [new Error('invalid_passphrase')];
    }
    /**
     * Encrypts JWE
     * @param algorithm Algorithm
     * @param payload Payload as buffer
     * @param overrideWithKey Uses this key instead of current wallet key
     *
     */
    async encryptJWE(algorithm, keystoreId, payload, overrideWithKey) {
        this.onRequestPassphraseSubscriber.next({
            type: 'request_tx',
            payload,
            algorithm,
        });
        const canUseIt = await this.canUse();
        if (canUseIt) {
            let jwk;
            if (overrideWithKey === null) {
                const keys = await this.getPrivateKeyExports(algorithm, keystoreId);
                jwk = keys.jwk;
            }
            // @ts-ignore
            return [null, await JOSEService_1.JOSEService.encrypt([jwk], payload)];
        }
        return [new Error('invalid_passphrase')];
    }
    /**
     * Decript JWE
     * @param algorithm
     * @param keystoreId
     * @param payload
     */
    async decryptJWE(algorithm, keystoreId, payload) {
        this.onRequestPassphraseSubscriber.next({
            type: 'request_tx',
            payload,
            algorithm,
        });
        const canUseIt = await this.canUse();
        if (canUseIt) {
            const { jwk } = await this.getPrivateKeyExports(algorithm, keystoreId);
            return [
                null,
                await node_jose_1.JWE.createDecrypt(await node_jose_1.JWK.asKey(jwk, 'jwk')).decrypt(payload),
            ];
        }
        return [new Error('invalid_passphrase')];
    }
    /**
     * Generates a mnemonic
     */
    static generateMnemonic() {
        return ethers_1.ethers.Wallet.createRandom().mnemonic;
    }
    /**
     * Derives a wallet from a path
     */
    deriveFromPath(mnemonic, path) {
        const node = ethers_1.ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(path);
        return node;
    }
    /**
     * Gets EdDSA key pair
     */
    getEd25519(mnemonic) {
        const ed25519 = new elliptic_1.eddsa('ed25519');
        // const hdkey = HDKey.fromExtendedKey(HDNode.fromMnemonic(this.mnemonic).extendedKey);
        const { key } = ed25519_hd_key_1.getMasterKeyFromSeed(utils_1.mnemonicToSeed(mnemonic));
        const keypair = ed25519.keyFromSecret(key);
        return keypair;
    }
    /**
     * Gets ECDSA key pair
     * @param mnemonic
     */
    getES256K(mnemonic) {
        const ES256k = new elliptic_1.ec('secp256k1');
        const keypair = ES256k.keyFromPrivate(ethers_1.ethers.utils.HDNode.fromMnemonic(mnemonic).privateKey);
        return keypair;
    }
    /**
     * Gets keystore from session db
     */
    async getAccount(passphrase) {
        let account;
        try {
            const accounts = this.db.accounts;
            account = await accounts
                .findOne({
                selector: {
                    id: 'xdv:account',
                },
            })
                .exec();
            return account;
        }
        catch (e) {
            return e;
        }
        return account;
    }
    /**
     * Sets account lock
     * @param id
     */
    async setAccountLock(lock) {
        const accounts = this.db.accounts;
        const account = await accounts
            .findOne({
            selector: {
                id: 'xdv:account',
            },
        })
            .exec();
        const updated = await account.update({
            $set: {
                isLocked: lock,
            },
        });
        return updated;
    }
    /**
     * Sets current keystore
     * @param passphrase
     * @param id
     *
     */
    async setCurrentKeystore(id) {
        const accounts = this.db.accounts;
        const account = await accounts
            .findOne({
            selector: {
                id: 'xdv:account',
            },
        })
            .exec();
        const updated = await account.update({
            $set: {
                currentKeystoreId: id,
            },
        });
        return updated;
    }
    generateRadomSeed() {
        return ethers_1.ethers.utils.randomBytes(32);
    }
    async mapWeb3AddressToEd25519Seed(address, seed) {
        const addressCollection = this.db.address;
        await addressCollection.insert({
            key: address,
            value: seed.toString()
        });
        return seed;
    }
    async getDIDAccountFromWeb3Address(address) {
        // Get seed corresponding to the address from the db
        const seedModel = await this.db.address.findOne({
            selector: {
                key: address
            }
        }).exec();
        if (!seedModel) {
            return null;
        }
        const seed = new Uint8Array(seedModel.value.split(','));
        const provider = new key_did_provider_ed25519_1.Ed25519Provider(seed);
        // @ts-ignore
        const did = new dids_1.DID({ provider, resolver: key_did_resolver_1.default.getResolver() });
        await did.authenticate();
        return did;
    }
    async create3ID(address) {
        const seed = this.generateRadomSeed();
        const provider = new key_did_provider_ed25519_1.Ed25519Provider(seed);
        // @ts-ignore
        const did = new dids_1.DID({ provider, resolver: key_did_resolver_1.default.getResolver() });
        await did.authenticate();
        await this.mapWeb3AddressToEd25519Seed(address, seed);
        return did;
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map