"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPLDManager = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const moment_1 = tslib_1.__importDefault(require("moment"));
const ipfs_http_client_1 = tslib_1.__importDefault(require("ipfs-http-client"));
const utils_1 = require("ethers/lib/utils");
const multicodec = require('multicodec');
class IPLDManager {
    constructor(did) {
        this.did = did;
    }
    async start(hostname) {
        this.client = ipfs_http_client_1.default({ url: hostname || `http://ifesa.ipfs.pa:5001` });
    }
    /**
     * Converts Blob to Keccak 256 hash
     * @param payload
     */
    async blobToKeccak256(payload) {
        let ab = await payload.arrayBuffer();
        let buf = new Uint8Array(ab);
        return utils_1.keccak256(buf);
    }
    /**
     * Add Signed Object
     * @param did DID
     * @param payload Payload, either Buffer or Blob
     * @param previousNode If it has previous node
     */
    async addSignedObject(payload, options = {
        contentType: '',
        name: '',
        lastModified: new Date()
    }) {
        let temp;
        let content;
        // if (payload instanceof File) {
        //     temp = await this.blobToKeccak256(payload);
        //     content = Buffer.from((await payload.arrayBuffer()));
        // } else 
        if (payload instanceof Uint8Array) {
            temp = utils_1.keccak256(payload);
            content = Buffer.from(payload);
        }
        else {
            throw new Error('addSignedObject: must be a file object or Uint8Array');
        }
        temp = temp.replace('0x', '');
        // sign the payload as dag-cbor
        const { jws, linkedBlock } = await this.did.createDagJWS({
            // @ts-ignore
            contentType: options.contentType || payload.type,
            // @ts-ignore
            name: options.name || payload.name,
            // @ts-ignore
            lastModified: options.lastModified || payload.lastModified,
            timestamp: moment_1.default().unix(),
            hash: temp,
            id: utils_1.keccak256(ethers_1.ethers.utils.toUtf8Bytes(moment_1.default().unix() + temp)),
            content: content.toString('base64'),
            documentPubCert: undefined,
            documentSignature: undefined,
            signaturePreset: undefined
        });
        // put the JWS into the ipfs dag
        const jwsCid = await this.client.dag.put(jws, multicodec.DAG_CBOR);
        // put the payload into the ipfs dag
        await this.client.block.put(linkedBlock, { cid: jws.link });
        return jwsCid.toString();
    }
    createSignedContent({ contentType, name, lastModified, size, content, hash, documentPubCert, documentSignature, signaturePreset }) {
        return {
            contentType,
            name,
            lastModified,
            size,
            content,
            hash,
            created: moment_1.default().unix(),
            documentPubCert,
            documentSignature,
            signaturePreset,
        };
    }
    async addIndex(documents) {
        // sign the payload as dag-cbor
        const { jws, linkedBlock } = await this.did.createDagJWS({
            documents
        });
        // put the JWS into the ipfs dag
        const jwsCid = await this.client.dag.put(jws, multicodec.DAG_CBOR);
        // put the payload into the ipfs dag
        await this.client.blocks.put(linkedBlock, { cid: jws.link });
        const cid = jwsCid.toString();
        return cid;
    }
    /**
     * Get IPLD object
     * @param cid content id
     */
    async getObject(cid) {
        let temp = await this.client.dag.get(cid);
        const res = {
            metadata: Object.assign({}, temp),
            payload: undefined
        };
        temp = await this.client.dag.get(cid, { path: '/link' });
        res.payload = Object.assign({}, temp);
        return temp;
    }
    verify(obj) {
        return this.did.verifyJWS(obj.metadata);
    }
    async encryptObject(cleartext, dids) {
        const jwe = await this.did.createDagJWE(cleartext, dids);
        return this.client.dag.put(jwe, multicodec.DAG_CBOR);
    }
    async decryptObject(didInstance, cid, query) {
        const jwe = (await this.client.dag.get(cid, query)).value;
        const cleartext = await didInstance.decryptDagJWE(jwe);
        return { jwe, cleartext };
    }
    async addPublicWallet(did, payload) {
        let temp;
        let content;
        temp = utils_1.keccak256(payload);
        content = payload;
        temp = temp.replace('0x', '');
        // sign the payload as dag-cbor
        const cid = await this.client.add({
            path: 'index.json',
            content
        });
        return cid.toString();
    }
}
exports.IPLDManager = IPLDManager;
//# sourceMappingURL=IPLDManager.js.map