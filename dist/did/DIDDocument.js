"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedDID = exports.Params = exports.DIDDocument = void 0;
class DIDDocument {
    constructor() {
        this.created = new Date();
        this.updated = new Date();
        this['@context'] = 'https://w3id.org/did/v1';
    }
}
exports.DIDDocument = DIDDocument;
class Params {
}
exports.Params = Params;
class ParsedDID {
}
exports.ParsedDID = ParsedDID;
