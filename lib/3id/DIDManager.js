"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIDManager = void 0;
const tslib_1 = require("tslib");
const _3id_connect_1 = require("3id-connect");
const key_did_provider_ed25519_1 = require("key-did-provider-ed25519");
const key_did_resolver_1 = tslib_1.__importDefault(require("@ceramicnetwork/key-did-resolver"));
const dids_1 = require("dids");
const ethr_did_1 = tslib_1.__importDefault(require("ethr-did"));
/**
 * Manages DIDs
 */
class DIDManager {
    /**
     * Create DID
     * using XDV
     * @param privateKeyBytes EdDSA secret
     * @param privateKeyHex EdDSA secret hex
     */
    createEthrDID(address, ecKP, registry, rpcUrl) {
        const did = new ethr_did_1.default({
            privateKey: ecKP.getPrivate('hex'),
            address,
            registry,
            rpcUrl,
        });
        return did;
    }
    /**
     * Create 3ID
     * using XDV
     * @param edDSAKeyPair EdDSA keypair
     */
    async create3ID_Ed25519(edDSAKeyPair) {
        let seed = edDSAKeyPair.getSecret().slice(0, 32);
        const provider = new key_did_provider_ed25519_1.Ed25519Provider(seed);
        const did = new dids_1.DID({
            provider,
            resolver: key_did_resolver_1.default.getResolver(),
        });
        const issuer = () => ({
            signer: (data) => {
                return edDSAKeyPair.sign(data).toHex();
            },
            alg: 'Ed25519',
            did: did.id,
        });
        return {
            did,
            getIssuer: issuer
        };
    }
    /**
     * Create 3ID
     * using XDV
     * @param address address
     * @param ecKeyPair ECDSA key pair
     * @param web3provider Web3 Provider
     */
    async create3IDWeb3(address, ecKeyPair, web3provider, registry) {
        const threeid = new _3id_connect_1.ThreeIdConnect();
        const authProvider = new _3id_connect_1.EthereumAuthProvider(web3provider, address);
        await threeid.connect(authProvider);
        const did = new dids_1.DID({
            provider: (await threeid.getDidProvider()),
            resolver: key_did_resolver_1.default.getResolver(),
        });
        const issuer = new ethr_did_1.default({
            privateKey: ecKeyPair.getPrivate('hex'),
            address,
            web3: web3provider,
            registry,
        });
        return {
            did,
            issuer
        };
    }
    /**
     * Create 3ID Web3 External
     * using XDV
     * @param address address
     * @param ecKeyPair ECDSA key pair
     * @param web3provider Web3 Provider
     */
    async create3IDWeb3External(web3provider, address) {
        const threeid = new _3id_connect_1.ThreeIdConnect();
        const authProvider = new _3id_connect_1.EthereumAuthProvider(web3provider, address);
        await threeid.connect(authProvider);
        const did = new dids_1.DID({
            provider: (await threeid.getDidProvider()),
            resolver: key_did_resolver_1.default.getResolver(),
        });
        return {
            did,
            issuer: null
        };
    }
}
exports.DIDManager = DIDManager;
//# sourceMappingURL=DIDManager.js.map