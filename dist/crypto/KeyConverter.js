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
exports.KeyConverter = exports.X509Info = void 0;
const node_jose_1 = require("node-jose");
const bs58_1 = __importDefault(require("bs58"));
const crypto_key_composer_1 = require("crypto-key-composer");
const ethers_1 = require("ethers");
const LDCryptoTypes_1 = require("./LDCryptoTypes");
const PrivateKey_1 = require("../did/PrivateKey");
const did_1 = require("../did");
const rasha_1 = __importDefault(require("rasha"));
const ec_key_1 = __importDefault(require("ec-key"));
class X509Info {
}
exports.X509Info = X509Info;
class KeyConverter {
    static getX509RSA(kp) {
        return __awaiter(this, void 0, void 0, function* () {
            let jwk = kp;
            const ldSuite = {
                publicKeyJwk: kp.toJSON()
            };
            return {
                jwk,
                der: undefined,
                pemAsPrivate: yield rasha_1.default.export({ jwk: kp.toJSON(true) }),
                pemAsPublic: yield rasha_1.default.export({ jwk: kp.toJSON() }),
                ldSuite
            };
        });
    }
    static getP256(kp, passphrase) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { password: '' };
            if (passphrase && passphrase.length > 0) {
                options.password = passphrase;
            }
            const composePemKey = crypto_key_composer_1.composePrivateKey({
                format: 'raw-pem',
                keyAlgorithm: {
                    id: 'ec',
                    namedCurve: 'secp256r1'
                },
                keyData: {
                    x: kp.getPublic().getX().toArrayLike(Buffer),
                    y: kp.getPublic().getY().toArrayLike(Buffer),
                    d: kp.getPrivate().toArrayLike(Buffer)
                }
            }, options);
            const composeDerKey = crypto_key_composer_1.composePrivateKey({
                format: 'raw-der',
                keyAlgorithm: {
                    id: 'ec',
                    namedCurve: 'secp256r1'
                },
                keyData: {
                    x: kp.getPublic().getX().toArrayLike(Buffer),
                    y: kp.getPublic().getY().toArrayLike(Buffer),
                    d: kp.getPrivate().toArrayLike(Buffer)
                }
            }, options);
            if (passphrase) {
                return {
                    der: composeDerKey,
                    pem: composePemKey
                };
            }
            const keys = new ec_key_1.default(composePemKey, 'pem');
            const ldSuite = {
                publicKeyJwk: JSON.stringify(keys.toJSON()),
                pubBytes: () => ethers_1.ethers.utils.arrayify('0x' + kp.getPublic().encodeCompressed('hex')),
                privBytes: () => kp.getPrivate().toArrayLike(Buffer)
            };
            return {
                der: composeDerKey,
                jwk: keys.toJSON(true),
                pem: composePemKey,
                ldSuite
            };
        });
    }
    static getES256K(kp, passphrase) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { password: '' };
            if (passphrase && passphrase.length > 0) {
                options.password = passphrase;
            }
            const composeDerKey = crypto_key_composer_1.composePrivateKey({
                format: 'raw-der',
                keyAlgorithm: {
                    id: 'ec',
                    namedCurve: 'secp256k1'
                },
                keyData: {
                    x: kp.getPublic().getX().toArrayLike(Buffer),
                    y: kp.getPublic().getY().toArrayLike(Buffer),
                    d: kp.getPrivate().toArrayLike(Buffer)
                }
            }, options);
            const composePemKey = crypto_key_composer_1.composePrivateKey({
                format: 'raw-pem',
                keyAlgorithm: {
                    id: 'ec',
                    namedCurve: 'secp256k1'
                },
                keyData: {
                    x: kp.getPublic().getX().toArrayLike(Buffer),
                    y: kp.getPublic().getY().toArrayLike(Buffer),
                    d: kp.getPrivate().toArrayLike(Buffer)
                }
            }, options);
            if (passphrase) {
                return {
                    der: composeDerKey,
                    pem: composePemKey,
                    ldJsonPublic: null
                };
            }
            const keys = new ec_key_1.default(composePemKey, 'pem');
            const ldSuite = {
                publicKeyJwk: JSON.stringify(keys.toJSON()),
                pubBytes: () => ethers_1.ethers.utils.arrayify('0x' + kp.getPublic().encodeCompressed('hex')),
                privBytes: () => kp.getPrivate().toArrayLike(Buffer)
            };
            return {
                der: composeDerKey,
                jwk: keys.toJSON(true),
                pem: composePemKey,
                ldJsonPublic: null,
                ldSuite
            };
        });
    }
    static openEncryptedPEMtoJWK(pem, passphrase) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = crypto_key_composer_1.decomposePrivateKey(pem, {
                passphrase
            });
            const composePem = crypto_key_composer_1.composePrivateKey(obj);
            const keys = new ec_key_1.default(composePem, 'pem');
            return keys.toJSON(true);
        });
    }
    static getEd25519(kp, passphrase) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { password: '' };
            if (passphrase && passphrase.length > 0) {
                options.password = passphrase;
            }
            const composeDerKey = crypto_key_composer_1.composePrivateKey({
                format: 'pkcs8-der',
                keyAlgorithm: {
                    id: 'ed25519'
                },
                keyData: {
                    seed: kp.getSecret()
                }
            }, options);
            const composePemKey = crypto_key_composer_1.composePrivateKey({
                format: 'pkcs8-pem',
                keyAlgorithm: {
                    id: 'ed25519'
                },
                keyData: {
                    seed: kp.getSecret()
                }
            }, options);
            return {
                der: composeDerKey,
                pem: composePemKey,
                ldJsonPublic: null
            };
        });
    }
    static createLinkedDataJsonFormat(algorithm, key, hasPrivate = false) {
        const id = Buffer.from(ethers_1.ethers.utils.randomBytes(100)).toString('base64');
        switch (algorithm) {
            case LDCryptoTypes_1.LDCryptoTypes.JWK:
                return Object.assign(new did_1.PublicKey(), {
                    id: `did:key:${id}`,
                    type: 'JwsVerificationKey2020',
                    publicKeyJwk: key.publicJwk
                }, {});
            case LDCryptoTypes_1.LDCryptoTypes.RSA:
                return Object.assign(new did_1.PublicKey(), {
                    id: `did:key:${id}`,
                    type: 'RsaVerificationKey2018',
                    publicKeyPem: key.publicPem
                }, {});
            case LDCryptoTypes_1.LDCryptoTypes.Sepc256r1:
                return Object.assign(new PrivateKey_1.PrivateKey(), {
                    id: `did:key:${id}`,
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    privateKeyBase58: hasPrivate
                        ? bs58_1.default.encode(key.privBytes())
                        : undefined,
                    publicKeyBase58: bs58_1.default.encode(key.pubBytes())
                }, {});
            case LDCryptoTypes_1.LDCryptoTypes.Sepc256k1:
                return Object.assign(new PrivateKey_1.PrivateKey(), {
                    id: `did:key:${id}`,
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    privateKeyBase58: hasPrivate
                        ? bs58_1.default.encode(key.privBytes())
                        : undefined,
                    publicKeyBase58: bs58_1.default.encode(key.pubBytes())
                }, {});
            case LDCryptoTypes_1.LDCryptoTypes.Ed25519:
                return Object.assign(new PrivateKey_1.PrivateKey(), {
                    id: `did:key:${id}`,
                    type: 'Ed25519VerificationKey2018',
                    privateKeyBase58: hasPrivate
                        ? bs58_1.default.encode(key.privBytes())
                        : undefined,
                    publicKeyBase58: bs58_1.default.encode(key.pubBytes())
                }, {});
        }
    }
    static getRSA(rsa) {
        return {
            jwk: node_jose_1.JWK.asKey(rsa, 'json'),
            pem: node_jose_1.JWK.asKey(rsa, 'pkcs8')
        };
    }
}
exports.KeyConverter = KeyConverter;
