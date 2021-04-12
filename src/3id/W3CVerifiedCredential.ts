import { JwtCredentialPayload, createVerifiableCredentialJwt, createVerifiablePresentationJwt, JwtPresentationPayload } from 'did-jwt-vc'
import { DID } from 'dids'
import moment from 'moment'

export class W3CVerifiedCredential {
  constructor() {}

  /**
   * Issue a VC Credential
   * @param did DID
   * @param issuer Issuer
   * @param holderInfo Holder Info
   */
  issueCredential(did: DID, issuer: any, holderInfo: any) {
    const vcPayload: JwtCredentialPayload = {
      sub: did.id,
      nbf: moment().unix(),
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
          ...holderInfo,
        },
      },
    }

    return createVerifiableCredentialJwt(vcPayload, issuer)
  }

  /**
   * Creates a VP
   * @param credential Verified Credential
   * @param issuer Issuer
   */
  createVerifiablePresentation(credential: string, issuer: any) {
    const vpPayload: JwtPresentationPayload = {
      vp: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        verifiableCredential: [credential],
      },
    }

    return createVerifiablePresentationJwt(vpPayload, issuer)

  }
}
