import { DID } from 'dids';
import { ec, eddsa } from 'elliptic';
import EthrDID from 'ethr-did';
export interface DIDContext {
    did: DID;
    getIssuer?: any;
    issuer?: any;
}
/**
 * Manages DIDs
 */
export declare class DIDManager {
    /**
     * Create DID
     * using XDV
     * @param privateKeyBytes EdDSA secret
     * @param privateKeyHex EdDSA secret hex
     */
    createEthrDID(address: string, ecKP: ec.KeyPair, registry: string, rpcUrl: string): EthrDID;
    /**
     * Create 3ID
     * using XDV
     * @param edDSAKeyPair EdDSA keypair
     */
    create3ID_Ed25519(edDSAKeyPair: eddsa.KeyPair): Promise<DIDContext>;
    /**
     * Create 3ID
     * using XDV
     * @param address address
     * @param ecKeyPair ECDSA key pair
     * @param web3provider Web3 Provider
     */
    create3IDWeb3(address: any, ecKeyPair: ec.KeyPair, web3provider: any, registry: string): Promise<DIDContext>;
    /**
     * Create 3ID Web3 External
     * using XDV
     * @param address address
     * @param ecKeyPair ECDSA key pair
     * @param web3provider Web3 Provider
     */
    create3IDWeb3External(web3provider: any, address: string): Promise<DIDContext>;
}
