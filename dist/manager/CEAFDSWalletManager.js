"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEAFDSWalletManager = void 0;
const CEAWalletManager_1 = require("./CEAWalletManager");
class CEAFDSWalletManager extends CEAWalletManager_1.CEAWalletManager {
    constructor(fds, keyService, keyStorage) {
        super(keyService, keyStorage);
        this.fds = fds;
        this.keyService = keyService;
        this.keyStorage = keyStorage;
    }
    setUser(user) {
        this.fdsUser = user;
    }
    getUser() {
        return this.fdsUser;
    }
}
exports.CEAFDSWalletManager = CEAFDSWalletManager;
