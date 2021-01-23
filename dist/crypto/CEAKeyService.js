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
const elliptic_1 = require("elliptic");
const ed25519_hd_key_1 = require("ed25519-hd-key");
const ethers_1 = require("ethers");
const KeyConverter_1 = require("./KeyConverter");
const AlgorithmType_1 = require("./AlgorithmType");
const utils_1 = require("ethers/utils");
const node_jose_1 = require("node-jose");
const bls_keygen_1 = require("@chainsafe/bls-keygen");
const LDCryptoTypes_1 = require("./LDCryptoTypes");
class CEAKeyService {
    getPrivateKey(algorithm, keyStore) {
        switch (algorithm) {
            case AlgorithmType_1.AlgorithmType.ED25519:
                const ed25519 = new elliptic_1.eddsa('ed25519');
                return ed25519.keyFromSecret(keyStore.ED25519).getSecret('hex');
            case AlgorithmType_1.AlgorithmType.P256:
                const p256 = new elliptic_1.ec('p256');
                p256.keyFromPrivate(keyStore.P256).getPrivate('hex');
            case AlgorithmType_1.AlgorithmType.ES256K:
                const secp256k1 = new elliptic_1.ec('secp256k1');
                return secp256k1.keyFromPrivate(keyStore.ES256K).getPrivate('hex');
            default:
                return null;
        }
    }
    getEd25519(mnemonic) {
        const ed = new elliptic_1.eddsa('ed25519');
        const { key } = ed25519_hd_key_1.getMasterKeyFromSeed(ethers_1.ethers.utils.HDNode.mnemonicToSeed(mnemonic));
        return ed.keyFromSecret(key);
    }
    getP256(mnemonic) {
        const p256 = new elliptic_1.ec('p256');
        return p256.keyFromPrivate(utils_1.HDNode.fromMnemonic(mnemonic).privateKey);
    }
    getES256K(mnemonic) {
        const ES256k = new elliptic_1.ec('secp256k1');
        return ES256k.keyFromPrivate(utils_1.HDNode.fromMnemonic(mnemonic).privateKey);
    }
    getBlsMasterKey(mnemonic) {
        const masterKey = bls_keygen_1.deriveKeyFromMnemonic(mnemonic);
        return {
            deriveValidatorKeys: (id) => bls_keygen_1.deriveEth2ValidatorKeys(masterKey, id)
        };
    }
    getRSA256Standalone(len = 2048) {
        return node_jose_1.JWK.createKey('RSA', len, {
            alg: 'RS256',
            use: 'sig'
        });
    }
    generateKeys(mnemonic) {
        return __awaiter(this, void 0, void 0, function* () {
            const edKeypair = this.getEd25519(mnemonic);
            const keyStoreED25519 = edKeypair.getSecret('hex');
            const keyExportED25519 = yield KeyConverter_1.KeyConverter.getEd25519(edKeypair);
            keyExportED25519.ldJsonPublic = KeyConverter_1.KeyConverter.createLinkedDataJsonFormat(LDCryptoTypes_1.LDCryptoTypes.Ed25519, edKeypair, false);
            const es256kKeypair = this.getES256K(mnemonic);
            const keyStoreES256K = es256kKeypair.getPrivate('hex');
            const keyExportES256K = yield KeyConverter_1.KeyConverter.getES256K(es256kKeypair);
            keyExportES256K.ldJsonPublic = KeyConverter_1.KeyConverter.createLinkedDataJsonFormat(LDCryptoTypes_1.LDCryptoTypes.JWK, { publicJwk: JSON.parse(keyExportES256K.ldSuite.publicKeyJwk) }, false);
            const rsaKeypair = yield this.getRSA256Standalone();
            const keyStoreRSA = rsaKeypair.toJSON(true);
            const keyExportRSA = KeyConverter_1.KeyConverter.getRSA(rsaKeypair);
            const stores = {
                ED25519: keyStoreED25519,
                ES256K: keyStoreES256K,
                P256: '',
                RSA: keyStoreRSA,
                BLS: ''
            };
            const exports = {
                ED25519: keyExportED25519,
                ES256K: keyExportES256K,
                P256: '',
                RSA: keyExportRSA,
                BLS: ''
            };
            return {
                stores,
                exports
            };
        });
    }
}
exports.CEAKeyService = CEAKeyService;
