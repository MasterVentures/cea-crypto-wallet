import { CEAWalletManager } from './CEAWalletManager';

export class CEAFDSWalletManager {    
    fdsUser : any;
    
    constructor(public fds:any){     
    }

    setUser(user:any) {
        this.fdsUser = user;
    }

    getUser(){
        return this.fdsUser;
    }
}