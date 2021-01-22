import { CEAWalletManager } from './CEAWalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';

export class CEAFDSWalletManager extends CEAWalletManager {    
    fdsUser : any;
    
    constructor(public fds:any, 
    public keyService: KeyService, 
    public keyStorage: KeyStorage){
        super(keyService,keyStorage);      
    }

    setUser(user:any) {
        this.fdsUser = user;
    }

    getUser(){
        return this.fdsUser;
    }
}