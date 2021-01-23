"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
