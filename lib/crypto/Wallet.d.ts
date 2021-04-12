/// <reference types="node" />
/// <reference types="pouchdb-core" />
import EthrDID from 'ethr-did';
import { ec, eddsa } from 'elliptic';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import { DID } from 'dids';
import { RxDatabase, RxDocument } from 'rxdb';
export declare type AlgorithmTypeString = keyof typeof AlgorithmType;
export declare enum AlgorithmType {
    RSA = 0,
    ES256K = 1,
    P256 = 2,
    ED25519 = 3,
    BLS = 4,
    P256_JWK_PUBLIC = 5,
    ED25519_JWK_PUBLIC = 6,
    ES256K_JWK_PUBLIC = 7,
    RSA_JWK_PUBLIC = 8,
    RSA_PEM_PUBLIC = 9
}
export declare class WalletOptions {
    password: string;
    mnemonic?: string;
}
export interface XDVUniversalProvider {
    did: DID & EthrDID;
    secureMessage: any;
    privateKey: any;
    getIssuer: Function;
    issuer?: EthrDID;
    id: string;
    web3?: Web3;
    address?: string;
    publicKey: any;
}
export interface ICreateOrLoadWalletProps {
    walletId?: string;
    passphrase?: string;
    registry?: string;
    rpcUrl?: string;
    mnemonic?: string;
    accountName?: string;
}
export interface KeyStoreModel {
    ES256K: any;
    P256: any;
    ED25519: any;
}
export interface KeystoreDbModel {
    walletId: string;
    keypairs: KeyStoreModel;
    path?: string;
    mnemonic: string;
    keypairExports: KeyStoreModel;
    publicKeys?: any;
}
export declare class KeyStore implements KeyStoreModel {
    ED25519: any;
    ES256K: any;
    P256: any;
    constructor();
}
export interface Account {
    id: string;
    created: number;
    isLocked: boolean;
    description: string;
    attributes: any[];
    currentKeystoreId: string;
    keystores: KeystoreDbModel[];
}
export declare const AddressSchema: {
    title: string;
    version: number;
    description: string;
    type: string;
    properties: {
        key: {
            type: string;
            primary: boolean;
        };
        value: {
            type: string;
        };
    };
    encrypted: string[];
};
export declare const XDVWalletSchema: {
    title: string;
    version: number;
    description: string;
    type: string;
    properties: {
        id: {
            type: string;
            primary: boolean;
        };
        created: {
            type: string;
        };
        isLocked: {
            type: string;
        };
        currentKeystoreId: {
            type: string;
        };
        attributes: {
            type: string;
        };
        keystores: {
            type: string;
            items: {
                type: string;
                properties: {
                    walletId: {
                        type: string;
                    };
                    mnemonic: {
                        type: string;
                    };
                    keystoreSeed: {
                        type: string;
                    };
                    keypairs: {
                        type: string;
                    };
                    keypairExports: {
                        type: string;
                    };
                    publicKeys: {
                        type: string;
                    };
                    path: {
                        type: string;
                    };
                };
            };
        };
        description: {
            type: string;
        };
    };
    encrypted: string[];
};
/**
 * XDV Wallet for DID and VC use cases
 */
export declare class Wallet {
    private readonly DB_NAME;
    onRequestPassphraseSubscriber: Subject<any>;
    onRequestPassphraseWallet: Subject<any>;
    onSignExternal: Subject<any>;
    protected db: RxDatabase;
    accepted: any;
    isWeb: boolean;
    /**
     * Creates a new Wallet
     * @param param0 isWeb, true if used by browser otherwise false
     */
    constructor({ isWeb }?: {
        isWeb: boolean;
    });
    /**\
     * Opens a db
     */
    open(accountName: string, passphrase: string): Promise<this>;
    /**
     * Enrolls account, returns false if already exists, otherwise account model
     * @param options create or load wallet options, password must be at least 12 chars
     */
    enrollAccount(options: ICreateOrLoadWalletProps): Promise<any>;
    close(): Promise<void>;
    getUniversalWalletKey(alg: string): Promise<void>;
    /**
     * Creates an universal wallet for ES256K
     * @param options { passphrase, walletid, registry, rpcUrl }
     */
    createES256K(options: ICreateOrLoadWalletProps): Promise<XDVUniversalProvider>;
    /**
     * Creates an universal wallet for Ed25519
     * @param nodeurl EVM Node
     * @param options { passphrase, walletid }
     */
    createEd25519(options: ICreateOrLoadWalletProps): Promise<XDVUniversalProvider>;
    /**
     * Creates an universal wallet  for Web3 Providers
     * @param options { passphrase, walletid, registry, rpcUrl }
     */
    createWeb3Provider(options: ICreateOrLoadWalletProps): Promise<XDVUniversalProvider>;
    /**
     * Adds a set of ES256K and ED25519 Wallets
     * @param options
     */
    addWallet(options?: ICreateOrLoadWalletProps): Promise<string>;
    /**
     * Get private key as elliptic keypair
     * @param algorithm
     * @param keystoreId
     */
    protected getPrivateKey(algorithm: AlgorithmTypeString, keystoreId: string): Promise<ec.KeyPair | eddsa.KeyPair>;
    /**
     * Get private key exports
     * @param algorithm
     * @param keystoreId
     */
    protected getPrivateKeyExports(algorithm: AlgorithmTypeString, keystoreId: string): Promise<any>;
    canUse(): Promise<unknown>;
    /**
     * Signs with selected algorithm
     * @param algorithm Algorithm
     * @param payload Payload as buffer
     * @param options options
     */
    sign(algorithm: AlgorithmTypeString, keystoreId: string, payload: Buffer): Promise<[Error, any?]>;
    /**
     * Signs a JWT for single recipient
     * @param algorithm Algorithm
     * @param payload Payload as buffer
     * @param options options
     */
    signJWT(algorithm: AlgorithmTypeString, keystoreId: string, payload: any, options: any): Promise<[Error, any?]>;
    /**
     * Signs JWT using public keys
     * @param publicKey
     * @param payload
     * @param options
     */
    signJWTFromPublic(publicKey: any, payload: any, options: any): Promise<[Error, any?]>;
    /**
     * Encrypts JWE
     * @param algorithm Algorithm
     * @param payload Payload as buffer
     * @param overrideWithKey Uses this key instead of current wallet key
     *
     */
    encryptJWE(algorithm: AlgorithmTypeString, keystoreId: string, payload: any, overrideWithKey: any): Promise<[Error, any?]>;
    /**
     * Decript JWE
     * @param algorithm
     * @param keystoreId
     * @param payload
     */
    decryptJWE(algorithm: AlgorithmTypeString, keystoreId: string, payload: any): Promise<[Error, any?]>;
    /**
     * Generates a mnemonic
     */
    static generateMnemonic(): ethers.utils.Mnemonic;
    /**
     * Derives a wallet from a path
     */
    deriveFromPath(mnemonic: string, path: string): any;
    /**
     * Gets EdDSA key pair
     */
    getEd25519(mnemonic: string): eddsa.KeyPair;
    /**
     * Gets ECDSA key pair
     * @param mnemonic
     */
    getES256K(mnemonic: string): ec.KeyPair;
    /**
     * Gets keystore from session db
     */
    getAccount(passphrase?: string): Promise<RxDocument>;
    /**
     * Sets account lock
     * @param id
     */
    setAccountLock(lock: boolean): Promise<any>;
    /**
     * Sets current keystore
     * @param passphrase
     * @param id
     *
     */
    setCurrentKeystore(id: string): Promise<any>;
    generateRadomSeed(): Uint8Array;
    mapWeb3AddressToEd25519Seed(address: string, seed: Uint8Array): Promise<Uint8Array>;
    getDIDAccountFromWeb3Address(address: string): Promise<DID>;
    create3ID(address: any): Promise<DID>;
}
