# xdv-universal-wallet
XDV Universal Wallet

Creates a 3ID protocol enabled Ed25519 or Web3 provider

## Example

```typescript
    const did = await Wallet.create3IDEd25519({
      passphrase: 'abcdef123456',
    })
    expect(did.id.length).to.be.above(0)

    const ipfsManager = new IPFSManager(did.did)
    await ipfsManager.start()

    const fil = Buffer.from('fffffffffffffffffffffff')
    // auth
    await did.did.authenticate()
    const cid = await ipfsManager.addSignedObject(fil, {
      name: 'UnitTest.txt',
      contentType: 'text/text',
      lastModified: new Date(),
    })
    expect(cid.length).to.be.above(0)

    const res = await ipfsManager.getObject(cid)
    expect(res.value.name).equal('UnitTest.txt')

```

## API

### crypto/Wallet


#### static async createES256K(options: any)
  
Creates an ES256K universal wallet

Parameters

* `passphrase`: Passphrase
* `walletid`: A wallet id, set it to load a previously created wallet, otherwise leave empty
* `rpcUrl`: An EVM Compatible chain (Ethereum, Binance Smart Chain, etc)
* `registry`: Contract address for EVM compatible ethr-did registry

Returns a `XDVUniversalProvider`

* `did`: A DID object from 3ID library. Allows to authenticate and sign with IPLD
* `secureMesssage`: Uses `EthCrypto` for encrypting and decrypting
* `publicKey`: A public key as an array like
* `issuer`: A DID object for issue signers
* `web3`: Web3 instance used by DApps
* `id`: A wallet id
* `address`: Wallet address

#### static async create3IDEd25519(options: any)
  
Creates an Ed25519 universal wallet

>Note: Signing only, support for X25519 will be added later

Creates an universal wallet for ES256K

Parameters

* `passphrase`: Passphrase
* `walletid`: A wallet id, set it to load a previously created wallet, otherwise leave empty

Returns a `XDVUniversalProvider`

* `did`: A DID object from 3ID library. Allows to authenticate and sign with IPLD
* `secureMesssage`: Uses `EthCrypto` for encrypting and decrypting
* `publicKey`: A public key as an array like
* `issuer`: A DID object for issue signers
* `web3`: Web3 instance used by DApps
* `id`: A wallet id
* `address`: Wallet address


#### static async createWeb3Provider(options: any)
  
Creates a Web3 provider universal wallet

Parameters

* `passphrase`: Passphrase
* `walletid`: A wallet id, set it to load a previously created wallet, otherwise leave empty
* `rpcUrl`: An EVM Compatible chain (Ethereum, Binance Smart Chain, etc)
* `registry`: Contract address for EVM compatible ethr-did registry

### 3id/DIDManager

### 3id/DriveManager

### 3id/IPFSManager

### 3id/W3CVerifiedCredential


#### issueCredential(did: DID, issuer: any, holderInfo: any)
  
Issues a Verified Credential

Parameters
* @param options { passphrase, walletid, rpcUrl }
