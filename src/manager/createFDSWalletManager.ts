import { FDSWalletManager } from './FDSWalletManager';
import { KeyService } from '../crypto';
import { KeyStorage } from '../key-storage';
import { CEAFDSAccounts } from './CEAFDSAccounts';
import  FDS from 'fds.js'

export const createFDSWalletManager = (keyService: KeyService,storage:KeyStorage): FDSWalletManager => {
    const client = new FDS({
        tokenName: 'gas',
        swarmGateway: 'https://swarm.fairdatasociety.org',
        ethGateway: 'https://geth-noordung.fairdatasociety.org',
        faucetAddress: 'https://faucet-noordung.fairdatasociety.org/gimmie',
        chainID: '3',
        httpTimeout: 1000,
        gasPrice: 0.1,
        walletVersion: 1,
        ensConfig: {
          domain: 'datafund.eth',
          registryAddress: '0xA1029cb176082eca658A67fD6807B9bDfB44A695',
          subdomainRegistrarAddress: '0x0E6a3B5f6800145bAe95C48934B7b5a90Df50722',
          resolverContractAddress: '0xC91AB84FFad79279D47a715eF91F5fbE86302E4D'
        }
    }); 
	return new CEAFDSAccounts(client,keyService, storage);
};
