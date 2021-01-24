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
exports.CEASigningService = void 0;
const elliptic_1 = require("elliptic");
const AlgorithmType_1 = require("./AlgorithmType");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_jose_1 = require("node-jose");
class CEASigningService {
    useKeyStorage(keyStorage) {
        this.currentKeyStorage = keyStorage;
        return this;
    }
    validateKeyStorage() {
        if (!this.currentKeyStorage) {
            throw new Error('No current Key Storage found, please call useKeyStorage() method first.');
        }
    }
    sign(algorithm, payload) {
        let kp;
        let key;
        this.validateKeyStorage();
        switch (algorithm) {
            case AlgorithmType_1.AlgorithmType.ED25519:
                kp = new elliptic_1.eddsa('ed25519');
                key = kp.keyFromSecret(this.currentKeyStorage.keypairs.ED25519);
                break;
            case AlgorithmType_1.AlgorithmType.ES256K:
                kp = new elliptic_1.ec('p256');
                key = kp.keyFromPrivate(this.currentKeyStorage.keypairs.P256);
                break;
            case AlgorithmType_1.AlgorithmType.P256:
                kp = new elliptic_1.ec('secp256k1');
                key = kp.keyFromPrivate(this.currentKeyStorage.keypairs.ES256K);
                break;
            default:
                throw new Error('AlgorithmType not supported.');
        }
        return key.sign(payload);
    }
    signJWT(algorithm, payload, options) {
        this.validateKeyStorage();
        const { pem } = this.currentKeyStorage.keypairExports[algorithm];
        return jsonwebtoken_1.default.sign(payload, pem, {
            audience: options.aud,
            issuer: options.iss,
            subject: options.sub
        });
    }
    signJWTFromPublic(publicKey, payload, options) {
        this.validateKeyStorage();
        return jsonwebtoken_1.default.sign(payload, publicKey, {
            audience: options.aud,
            issuer: options.iss,
            subject: options.sub
        });
    }
    encryptJWE(algorithm, payload) {
        this.validateKeyStorage();
        const { jwk } = this.currentKeyStorage.keypairExports[algorithm];
        return node_jose_1.JWE.createEncrypt([...jwk])
            .update(payload)
            .final();
    }
    decryptJWE(algorithm, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKeyStorage();
            const { jwk } = this.currentKeyStorage.keypairExports[algorithm];
            const key = yield node_jose_1.JWK.asKey(jwk, 'jwk');
            return yield node_jose_1.JWE.createDecrypt(key).decrypt(payload);
        });
    }
    verify(key, signature) {
        return jsonwebtoken_1.default.verify(signature, key, { algorithms: ['HS256'] });
    }
}
exports.CEASigningService = CEASigningService;
