import { EdDSASigner, ES256KSigner } from 'did-jwt'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from '@ceramicnetwork/key-did-resolver'
import { DID, DIDOptions } from 'dids'
import { BNInput, ec, eddsa } from 'elliptic'
import EthrDID from 'ethr-did'
import { Wallet } from 'ethers'
import { Buffer } from 'buffer'


export interface DIDContext {
  did: DID
  getIssuer?: any;
  issuer?: any
}
/**
 * Manages DIDs
 */
export class DIDManager {
  /**
   * Create DID
   * using XDV
   * @param privateKeyBytes EdDSA secret
   * @param privateKeyHex EdDSA secret hex
   */
  createEthrDID(
    address: string,
    ecKP: ec.KeyPair,
    registry: string,
    rpcUrl: string,
  ): EthrDID {
    const did = new EthrDID({
      privateKey: ecKP.getPrivate('hex'),
      address,
      registry,
      rpcUrl,
    })
    return did
  }

  /**
   * Create 3ID
   * using XDV
   * @param edDSAKeyPair EdDSA keypair
   */
  async create3ID_Ed25519(edDSAKeyPair: eddsa.KeyPair):  Promise<DIDContext> {
    let seed = edDSAKeyPair.getSecret().slice(0, 32)

    const provider = new Ed25519Provider(seed)
    const did = new DID(({
      provider,
      resolver: KeyResolver.getResolver(),
    } as unknown) as DIDOptions)
    const issuer = () => ({
      signer: (data: eddsa.Bytes) => {
        return edDSAKeyPair.sign(data).toHex()
      },
      alg: 'Ed25519',
      did: did.id,
    })

    return {
      did,
      getIssuer: issuer
    } as DIDContext;
  }

  /**
   * Create 3ID
   * using XDV
   * @param address address
   * @param ecKeyPair ECDSA key pair
   * @param web3provider Web3 Provider
   */
  async create3IDWeb3(
    address: any,
    ecKeyPair: ec.KeyPair,
    web3provider: any,
    registry: string,
  ): Promise<DIDContext> {
    const threeid = new ThreeIdConnect()
    const authProvider = new EthereumAuthProvider(web3provider, address)
    await threeid.connect(authProvider)
    const did = new DID({
      provider: (await threeid.getDidProvider()) as any,
      resolver: KeyResolver.getResolver(),
    } as unknown)
    const issuer = new EthrDID({
      privateKey: ecKeyPair.getPrivate('hex'),
      address,
      web3: web3provider,
      registry,
    })

    return {
      did,
      issuer
    } as DIDContext
  }

  /**
   * Create 3ID Web3 External
   * using XDV
   * @param address address
   * @param ecKeyPair ECDSA key pair
   * @param web3provider Web3 Provider
   */
  async create3IDWeb3External(
    web3provider: any,
    address: string,
  ): Promise<DIDContext> {
    const threeid = new ThreeIdConnect()
    const authProvider = new EthereumAuthProvider(web3provider, address)
    await threeid.connect(authProvider)
    
    const did = new DID({
      provider: (await threeid.getDidProvider()) as any,
      resolver: KeyResolver.getResolver(),
    } as unknown)

    return {
      did,
      issuer: null
    } as DIDContext
  }
}
