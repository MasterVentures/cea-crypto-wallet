
import { VerifiableCredential } from 'did-jwt-vc'
import { KeystoreDbModel, Wallet } from './Wallet'
import {
  IIssueProps,
  IQueryProps,
  ISignerProps,
  ITransferProps,
  IUniversalWallet,
} from './IUniversalWallet'
import { resolveAuthenticator } from 'did-jwt/lib/JWT'

export class UniversalWallet extends Wallet implements IUniversalWallet {
  /**
   * Imports a key
   * @param mnemonic Mnemonic
   * @param passphrase Passphrase
   */
  async import(mnemonic: string, passphrase: string): Promise<any> {
    const accountName = 'myEtherWallet'
    await this.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await this.enrollAccount({
      passphrase,
      accountName: 'mywallet1',
    })

    return this.addWallet({ mnemonic })
  }
  export(walletId: string, passphrase: string): Promise<object> {
    throw new Error('Method not implemented.')
  }
  async unlock(walletId: string, passphrase: string): Promise<object> {
    //TODO - Build JSON
    try {
      const a = await this.getAccount()
      //@ts-ignore
      const ks = a.keystores.find(
        //@ts-ignore
        (i) => i._id === a.currentKeystoreId,
      ) as KeystoreDbModel
      return ks
    } catch (e) {
      //@ts-ignore
      this.db.crypto(passphrase)
      //
    }
  }
  async lock(passphrase: string): Promise<object> {
    //TODO - Build JSON
    try {
      const a = await this.getAccount()
      //@ts-ignore
      const ks = a.keystores.find(
        //@ts-ignore
        (i) => i._id === a.currentKeystoreId,
      ) as KeystoreDbModel
      //@ts-ignore
      this.db.crypto(passphrase)
    } catch (e) {
    }
    return {}
  }
  signRaw(buf: Uint8Array, options: ISignerProps): Promise<object> {
    throw new Error('Method not implemented.')
  }
  verifyRaw(buf: Uint8Array, options: ISignerProps): Promise<object> {
    throw new Error('Method not implemented.')
  }
  verify(vc: VerifiableCredential): Promise<object> {
    throw new Error('Method not implemented.')
  }
  issue(vc: VerifiableCredential, options: IIssueProps): Promise<object> {
    throw new Error('Method not implemented.')
  }
  prove(ids: string[], options: IIssueProps): Promise<object> {
    throw new Error('Method not implemented.')
  }
  transfer(options: ITransferProps): Promise<object> {
    throw new Error('Method not implemented.')
  }
  query(search: IQueryProps): Promise<object> {
    throw new Error('Method not implemented.')
  }
}
