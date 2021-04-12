import dagJose from 'dag-jose'
import multiformats from 'multiformats/cjs/src/basics'
import legacy from 'multiformats/cjs/src/legacy'
import { DID } from 'dids'
import { ethers } from 'ethers'
import moment from 'moment'
import IPFSClient from 'ipfs-http-client';
import { keccak256 } from 'ethers/lib/utils'
const multicodec = require('multicodec')


export class IPLDManager {
    client: any;
    provider: ethers.providers.JsonRpcProvider;
    ipld: any;
    did: DID;

    constructor (did: DID) {
        this.did = did;
    }

    async start(hostname?: string){
       this.client = IPFSClient({ url: hostname || `http://ifesa.ipfs.pa:5001` });
    }

    /**
     * Converts Blob to Keccak 256 hash
     * @param payload 
     */
    async blobToKeccak256(payload: Blob): Promise<string> {
        let ab = await payload.arrayBuffer();
        let buf = new Uint8Array(ab);
        return keccak256(buf) as string;
    }

    /**
     * Add Signed Object
     * @param did DID
     * @param payload Payload, either Buffer or Blob 
     * @param previousNode If it has previous node
     */
    async addSignedObject(
        payload: Uint8Array,
        options = {
            contentType: '',
            name: '',
            lastModified: new Date()
        } ) {
        let temp: string;
        let content: Buffer;

        // if (payload instanceof File) {
        //     temp = await this.blobToKeccak256(payload);
        //     content = Buffer.from((await payload.arrayBuffer()));
        // } else 
        
        if (payload instanceof Uint8Array) {
            temp = keccak256(payload);
            content = Buffer.from(payload);
        }
        else {
            throw new Error('addSignedObject: must be a file object or Uint8Array');
        }
        temp = temp.replace('0x', '');
        // sign the payload as dag-cbor
        
        const { jws, linkedBlock } = await this.did.createDagJWS({
            // @ts-ignore
            contentType: options.contentType ||  payload.type,
            // @ts-ignore
            name: options.name || payload.name,
            // @ts-ignore
            lastModified: options.lastModified || payload.lastModified,
            timestamp: moment().unix(),
            hash: temp,
            id: keccak256(ethers.utils.toUtf8Bytes(moment().unix() + temp)),
            content: content.toString('base64'),
            documentPubCert: undefined,
            documentSignature: undefined,
            signaturePreset: undefined
        });
        // put the JWS into the ipfs dag
        const jwsCid = await this.client.dag.put(jws, multicodec.DAG_CBOR);
        // put the payload into the ipfs dag
        await this.client.block.put(linkedBlock, { cid: jws.link })
        return jwsCid.toString();
    }

    createSignedContent({
        contentType,
        name,
        lastModified,
        size,
        content,
        hash,
        documentPubCert,
        documentSignature,
        signaturePreset
    }) {
        return {
            contentType,
            name,
            lastModified,
            size,
            content,
            hash,
            created: moment().unix(),
            documentPubCert,
            documentSignature,
            signaturePreset,
        };
    }

    async addIndex(
        documents: any[]) {
        // sign the payload as dag-cbor
        const { jws, linkedBlock } = await this.did.createDagJWS({
            documents
        });
        
        // put the JWS into the ipfs dag
        const jwsCid = await this.client.dag.put(jws, multicodec.DAG_CBOR);
        // put the payload into the ipfs dag
        await this.client.blocks.put(linkedBlock, { cid: jws.link });
        const cid = jwsCid.toString()
        return cid;
    }
    /**
     * Get IPLD object
     * @param cid content id
     */
    async getObject(cid: string): Promise<any> {
        let temp = await this.client.dag.get(cid);
        const res = {
            metadata: {
                ...temp,
            },
            payload: undefined
        }
        temp = await this.client.dag.get(cid, { path: '/link' });
        res.payload = {
            ...temp,
        };

        return temp;
    }

    verify(obj: any): Promise<any> {
        return this.did.verifyJWS(obj.metadata);
    }

    async encryptObject(cleartext, dids: string[]) {
        const jwe = await this.did.createDagJWE(cleartext, dids)
        return this.client.dag.put(jwe, multicodec.DAG_CBOR);
    }

    async decryptObject(didInstance: DID, cid, query) {
        const jwe = (await this.client.dag.get(cid, query)).value
        const cleartext = await didInstance.decryptDagJWE(jwe)
        return { jwe, cleartext };
    }
    async addPublicWallet(
        did: DID,
        payload: Buffer) {
        let temp: string;
        let content: Buffer;
        temp = keccak256(payload);
        content = payload;
        temp = temp.replace('0x', '');
        // sign the payload as dag-cbor
        const cid = await this.client.add({
            path: 'index.json',
            content
        });
        return cid.toString()
    }
}