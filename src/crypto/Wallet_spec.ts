import { bigToUint8Array } from '../crypto/BigIntToUint8Array'
import { DIDDocumentBuilder } from '../did/DIDDocumentBuilder'
import { BigNumber, ethers } from 'ethers'
import { expect } from 'chai'
import { JOSEService } from './JOSEService'
import { JWTService } from './JWTService'
import { KeyConvert, X509Info } from './KeyConvert'
import { LDCryptoTypes } from './LDCryptoTypes'
import { Wallet, XDVUniversalProvider } from './Wallet'
import { DIDManager } from '../3id/DIDManager'
import { IPLDManager } from '../3id/IPLDManager'
import * as privateBox from 'private-box'
import { W3CVerifiedCredential } from '../3id/W3CVerifiedCredential'

let localStorage = {}
let id = null
let url = 'https://ropsten.infura.io/v3/79110f2241304162b087759b5c49cf99'

describe('universal wallet - wallet and 3ID', function () {
  let wallet: Wallet
  before(async function () {})

  it('when calling createWeb3Provider, should return a web3 instance and wallet id', async function () {
    wallet = new Wallet()

    // Password 12 characters or more
    const passphrase = 'qwerty123456'
    const accountName = 'molekilla'

    await wallet.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await wallet.enrollAccount({
      passphrase,
      accountName: 'mywallet1',
    })

    let acct = await wallet.getAccount()

    // Assert keystores length is 0, enrollAccount only creates an account
    if (acct.get('keystores').length === 0) {
      expect(acct.get('keystores').length).equal(0)
    }

    // add wallet with no mnemonic
    const walletId = await wallet.addWallet()

    // Assert keystores exists
    if (acct.get('keystores').length > 0) {
      expect(acct.get('keystores').length).greaterThan(0)
    }

    // Create 3ID enabled Web3 provider
    const result = await wallet.createWeb3Provider({
      rpcUrl: url,
      walletId
    })

    expect(result.id.length).to.be.above(0)
    // wallet.close();
  })

  it('when calling createWeb3Provider and create3IDWeb3, should return a web3 instance and wallet id', async function () {
    // Password 12 characters or more
    const passphrase = 'qwerty123456'
    const accountName = 'molekilla'

    await wallet.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await wallet.enrollAccount({
      passphrase,
      accountName: 'mywallet1',
    })

    let acct = await wallet.getAccount()

    // Assert keystores length is 0, enrollAccount only creates an account
    if (acct.get('keystores').length === 0) {
      expect(acct.get('keystores').length).equal(0)
    }

    // add wallet with no mnemonic
    const walletId = await wallet.addWallet()

    // Assert keystores exists
    if (acct.get('keystores').length > 0) {
      expect(acct.get('keystores').length).greaterThan(0)
    }
    id = walletId

    expect(id.length).to.be.above(0)
  })
  it('when calling createES256K with an existing id, should return a web3 instance and wallet id', async function () {
    // Password 12 characters or more
    const passphrase = 'qwerty123456'
    const accountName = 'molekilla'

    await wallet.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await wallet.enrollAccount({
      passphrase,
      accountName,
    })

    let acct = await wallet.getAccount()
    // add wallet with no mnemonic
    const walletId = await wallet.addWallet()

    const result = await wallet.createES256K({
      passphrase: '1234',
      rpcUrl: url,
      walletId,
      registry: '',
      accountName: '',
    })

    expect(result.address).equal(result.address)
  })

  it('when calling createES256K with an existing id and create a VC, should return a web3 instance and wallet id', async function () {
    // Password 12 characters or more
    const passphrase = 'qwerty123456'
    const accountName = 'molekilla'

    await wallet.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await wallet.enrollAccount({
      passphrase,
      accountName,
    })

    let acct = await wallet.getAccount()
    // add wallet with no mnemonic
    const walletId = await wallet.addWallet()

    const result = await wallet.createES256K({
      passphrase: '1234',
      rpcUrl: url,
      walletId,
      registry: '',
      accountName: '',
    })

    const vcService = new W3CVerifiedCredential()
    const vc = await vcService.issueCredential(result.did, result.did, {
      name: 'Rogelio',
      lastName: 'Morrell',
      cedula: '8-713-2230',
      nationality: 'Panamanian',
      email: 'rogelio@ifesa.tech',
    })
    expect(vc.length).to.be.above(0)
  })

  it('when calling create3IDEd25519 , should return a did instance and wallet id', async function () {
    // Password 12 characters or more
    const passphrase = 'qwerty123456'
    const accountName = 'molekilla'

    await wallet.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await wallet.enrollAccount({
      passphrase,
      accountName,
    })

    let acct = await wallet.getAccount()
    // add wallet with no mnemonic
    const walletId = await wallet.addWallet()

    const result = await wallet.createEd25519({
      rpcUrl: url,
      walletId,
      registry: '',
    })

    // ed25519creds: XDVUniversalProvider
    await wallet.mapWeb3AddressToEd25519(address, ed25519creds) // A <---> B address
        // get previously created key pair map
        // walletId saved in local storage look up in 
    const ed25519creds = await wallet.getDIDAccountFromWeb3Address(address)

    await result.did.authenticate()
    const issuer = result.getIssuer()
    expect(issuer.alg).equal('Ed25519')
    expect(result.did.id.length).to.be.above(0)
  })
})

describe('universal wallet - wallet, 3ID and IPLD', function () {
  let wallet: Wallet
  before(async function () {})

  it('when adding a signed DID/IPLD object , should fetch and return uploaded data', async function () {
    wallet = new Wallet()
    // Password 12 characters or more
    const passphrase = 'qwerty123456'
    const accountName = 'molekilla'

    await wallet.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await wallet.enrollAccount({
      passphrase,
      accountName,
    })

    let acct = await wallet.getAccount()
    // add wallet with no mnemonic
    const walletId = await wallet.addWallet()

    const result = await wallet.createEd25519({
      rpcUrl: url,
      walletId,
      registry: '',
    })
    const ipfsManager = new IPLDManager(result.did)
    await ipfsManager.start()

    const fil = Buffer.from('fffffffffffffffffffffff')
    // auth
    await result.did.authenticate()
    const cid = await ipfsManager.addSignedObject(fil, {
      name: 'UnitTest.txt',
      contentType: 'text/text',
      lastModified: new Date(),
    })
    expect(cid.length).to.be.above(0)

    const res = await ipfsManager.getObject(cid)
    expect(res.value.name).equal('UnitTest.txt')
  })

  it('when adding a signed and encrypted DID/IPLD object , should fetch and return uploaded data', async function () {
    // Password 12 characters or more
    const passphrase = 'qwerty123456'
    const accountName = 'molekilla'

    await wallet.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await wallet.enrollAccount({
      passphrase,
      accountName,
    })

    let acct = await wallet.getAccount()
    // add wallet with no mnemonic
    const walletAId = await wallet.addWallet()
    const walletBId = await wallet.addWallet()

    const did = await wallet.createEd25519({
      walletId: walletAId
    })
    const didBob = await wallet.createEd25519({
      walletId: walletBId
    })

    const ipfsManager = new IPLDManager(did.did)
    await ipfsManager.start()

    // auth
    await did.did.authenticate()
    await didBob.did.authenticate()
    // Alice encrypts, and both Alice and Bob can decrypt
    const enc = await ipfsManager.encryptObject('Hola Mundo !!!', [
      didBob.did.id,
    ])

    console.log(enc.toString())

    // const cid = await ipfsManager.addSignedObject(Buffer.from(enc.toString()), {
    //   name: 'UnitTestEnc.txt',
    //   contentType: 'text/text',
    //   lastModified: new Date(),
    // })
    // expect(cid.length).to.be.above(0)
    const res = await ipfsManager.decryptObject(didBob.did, enc.toString(), {})
    expect(res.cleartext).equal('Hola Mundo !!!')
  })

  it('when adding a signed and encrypted DID/IPLD object , should failed decrypting if not allowed', async function () {
    // Password 12 characters or more
    const passphrase = 'qwerty123456'
    const accountName = 'molekilla'

    await wallet.open(accountName, passphrase)

    // Enroll account only needs to done once
    // Returns account if already created
    await wallet.enrollAccount({
      passphrase,
      accountName,
    })

    let acct = await wallet.getAccount()
    // add wallet with no mnemonic
    const walletAId = await wallet.addWallet()
    const walletBId = await wallet.addWallet()

    const walletProviderAlice = await wallet.createES256K({
      walletId: walletAId
    })
    const walletProviderBob = await wallet.createES256K({
      walletId: walletBId
    })

    const ipfsManager = new IPLDManager(walletProviderAlice.did)
    await ipfsManager.start()
    console.log(walletProviderBob.publicKey)
    const message = await walletProviderAlice.secureMessage.encrypt(
      walletProviderBob.publicKey,
      Buffer.from('Hola Mundo Secreto!'),
    )

    const plaintext = await walletProviderBob.secureMessage.decrypt(message)

    expect(plaintext).equal('Hola Mundo Secreto!')
  })

  describe('mapWeb3AddressToEd25519 ...', () => {
    const testAddress = '0x234324';
    
    //
    // CREATE ed25519c
    const ed25519credsToInsert: XDVUniversalProvider = {

    }
    const wallet = new Wallet();
    wallet.mapWeb3AddressToEd25519(testAddress, ed25519credsToInsert);

    // TODO get from DB to check it was inserted
    it('should insert ed25519creds into the lookup table with corresponding key address', () =>{

    })
  });

  describe('getDIDAccountFromWeb3Address ...', () => {

    it('should get an existing ed25519creds from the lookup table with corresponding key address', () =>{
      
    })
  });
})
