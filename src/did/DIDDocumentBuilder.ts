import { DIDDocument } from './DIDDocument';
import { PublicKey } from './PublicKey';
import { PrivateKey } from './PrivateKey';
import { validateOrReject, isDateString } from 'class-validator';
import { Authentication } from './Authentication';
import { ServiceEndpoint } from './ServiceEndpoint';



export class DIDDocumentBuilder {

    public static async createDID({ issuer, verificationKeys, authenticationKeys, services = [] }:
        { issuer: string; verificationKeys: PublicKey[]; authenticationKeys: Authentication[]; services?: ServiceEndpoint[]; }) {
        const document = new DIDDocument();


        document.id = issuer;
        document.publicKey = await Promise.all(verificationKeys.map(async key => {
            await validateOrReject(key)

            return { ...key, owner: issuer };
        }));


        document.authentication = await Promise.all(authenticationKeys.map(async key => {
            await validateOrReject(key)

            return key;
        }));

        document.service = await Promise.all(services.map(async s => {
            await validateOrReject(s)

            return <ServiceEndpoint>{
                ...s
            };
        }));

        // document.proofs = await Promise.all(authenticationKeys.map(async key => {
        //     await validateOrReject(key)

        //     return <Authentication>{
        //         publicKey: key.publicKeyBase58,
        //         type: key.type,
        //     };
        // }));

        return document;

    }
}