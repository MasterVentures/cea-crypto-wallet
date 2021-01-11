"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletManager = void 0;
const _1 = require(".");
const crypto_1 = require("../crypto");
const key_storage_1 = require("../key-storage");
const pouchdb_1 = __importDefault(require("pouchdb"));
const createWalletManager = () => {
    const keyService = new crypto_1.CEAKeyService();
    const storage = new key_storage_1.PouchdbKeyStorage(new pouchdb_1.default('PAID'));
    return new _1.CEAWalletManager(keyService, storage);
};
exports.createWalletManager = createWalletManager;
