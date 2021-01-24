"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEAFDSWalletManager = void 0;
class CEAFDSWalletManager {
    constructor(fds) {
        this.fds = fds;
    }
    setUser(user) {
        this.fdsUser = user;
    }
    getUser() {
        return this.fdsUser;
    }
}
exports.CEAFDSWalletManager = CEAFDSWalletManager;
