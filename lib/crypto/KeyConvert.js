"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyConvert = exports.X509Info = void 0;
const tslib_1 = require("tslib");
const bs58_1 = tslib_1.__importDefault(require("bs58"));
const crypto_key_composer_1 = require("crypto-key-composer");
const ethers_1 = require("ethers");
const LDCryptoTypes_1 = require("./LDCryptoTypes");
const did_1 = require("../did");
const did_2 = require("../did");
const ECKey = require('ec-key');
class X509Info {
}
exports.X509Info = X509Info;
class KeyConvert {
    /**
     * Returns private keys in DER, JWK and PEM formats
     * @param kp Key pair
     * @param passphrase passphrase
     */
    static async getP256(kp, passphrase) {
        const options = { password: '' };
        if (passphrase && passphrase.length > 0) {
            options.password = passphrase;
        }
        // PEM
        const composePemKey = crypto_key_composer_1.composePrivateKey({
            format: 'raw-pem',
            keyAlgorithm: {
                id: 'ec',
                namedCurve: 'secp256r1',
            },
            keyData: {
                x: kp.getPublic().getX().toArrayLike(Buffer),
                y: kp.getPublic().getY().toArrayLike(Buffer),
                d: kp.getPrivate().toArrayLike(Buffer)
            }
        }, options);
        // DER
        const composeDerKey = crypto_key_composer_1.composePrivateKey({
            format: 'raw-der',
            keyAlgorithm: {
                id: 'ec',
                namedCurve: 'secp256r1',
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
            };
        }
        const keys = new ECKey(composePemKey, 'pem');
        const ldSuite = {
            publicKeyJwk: JSON.stringify(keys.toJSON()),
        };
        return {
            der: composeDerKey,
            jwk: keys.toJSON(true),
            pem: composePemKey,
            ldSuite,
        };
    }
    /**
 * Returns private keys in DER, JWK and PEM formats
 * @param kp Key pair
 * @param passphrase passphrase
 */
    static async getES256K(kp, passphrase) {
        const options = { password: '' };
        if (passphrase && passphrase.length > 0) {
            options.password = passphrase;
        }
        // DER
        const composeDerKey = crypto_key_composer_1.composePrivateKey({
            format: 'raw-der',
            keyAlgorithm: {
                id: 'ec',
                namedCurve: 'secp256k1',
            },
            keyData: {
                x: kp.getPublic().getX().toArrayLike(Buffer),
                y: kp.getPublic().getY().toArrayLike(Buffer),
                d: kp.getPrivate().toArrayLike(Buffer)
            }
        }, options);
        // PEM
        const composePemKey = crypto_key_composer_1.composePrivateKey({
            format: 'raw-pem',
            keyAlgorithm: {
                id: 'ec',
                namedCurve: 'secp256k1',
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
            };
        }
        const keys = new ECKey(composePemKey, 'pem');
        const ldSuite = {
            publicKeyJwk: JSON.stringify(keys.toJSON()),
        };
        return {
            der: composeDerKey,
            jwk: keys.toJSON(true),
            pem: composePemKey,
            ldSuite,
        };
    }
    static async openEncryptedPEMtoJWK(pem, passphrase) {
        const obj = crypto_key_composer_1.decomposePrivateKey(pem, {
            passphrase,
        });
        const composePem = crypto_key_composer_1.composePrivateKey(obj);
        const keys = new ECKey(composePem, 'pem');
        return keys.toJSON(true);
    }
    /**
     * Returns private keys in DER, JWK and PEM formats
     * @param kp Key pair
     * @param passphrase passphrase
     */
    static async getEd25519(kp, passphrase) {
        const options = { password: '' };
        if (passphrase && passphrase.length > 0) {
            options.password = passphrase;
        }
        // DER
        const composeDerKey = crypto_key_composer_1.composePrivateKey({
            format: 'pkcs8-der',
            keyAlgorithm: {
                id: 'ed25519'
            },
            keyData: {
                seed: kp.getSecret(),
            }
        }, options);
        // PEM
        const composePemKey = crypto_key_composer_1.composePrivateKey({
            format: 'pkcs8-pem',
            keyAlgorithm: {
                id: 'ed25519'
            },
            keyData: {
                seed: kp.getSecret(),
            }
        }, options);
        /// const keys = new ECKey(composePemKey, 'pem');
        return {
            der: composeDerKey,
            //  jwk: keys.toJSON(),
            pem: composePemKey,
        };
    }
    static async createLinkedDataJsonFormat(algorithm, key, hasPrivate = false) {
        const id = Buffer.from(ethers_1.ethers.utils.randomBytes(100)).toString('base64');
        switch (algorithm) {
            case LDCryptoTypes_1.LDCryptoTypes.JWK:
                return Object.assign(new did_2.PublicKey(), {
                    id: `did:key:${id}`,
                    type: 'JwsVerificationKey2020',
                    publicKeyJwk: key.publicJwk,
                }, {});
            case LDCryptoTypes_1.LDCryptoTypes.RSA:
                return Object.assign(new did_2.PublicKey(), {
                    id: `did:key:${id}`,
                    type: 'RsaVerificationKey2018',
                    publicKeyPem: key.publicPem,
                }, {});
            case LDCryptoTypes_1.LDCryptoTypes.Sepc256r1:
                return Object.assign(new did_1.PrivateKey(), {
                    id: `did:key:${id}`,
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    privateKeyBase58: hasPrivate ? bs58_1.default.encode(key.privBytes()) : undefined,
                    publicKeyBase58: bs58_1.default.encode(key.pubBytes())
                }, {});
            case LDCryptoTypes_1.LDCryptoTypes.Sepc256k1:
                return Object.assign(new did_1.PrivateKey(), {
                    id: `did:key:${id}`,
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    privateKeyBase58: hasPrivate ? bs58_1.default.encode(key.privBytes()) : undefined,
                    publicKeyBase58: bs58_1.default.encode(key.pubBytes())
                }, {});
            case LDCryptoTypes_1.LDCryptoTypes.Ed25519:
                return Object.assign(new did_1.PrivateKey(), {
                    id: `did:key:${id}`,
                    type: 'Ed25519VerificationKey2018',
                    privateKeyBase58: hasPrivate ? bs58_1.default.encode(key.privBytes()) : undefined,
                    publicKeyBase58: bs58_1.default.encode(key.pubBytes())
                }, {});
        }
    }
}
exports.KeyConvert = KeyConvert;
//# sourceMappingURL=KeyConvert.js.map