"use strict";
// https://stackoverflow.com/questions/63044970/how-to-convert-javascript-bigint-to-uint8array-with-negative-values-considered
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigToUint8Array = void 0;
const big0 = BigInt(0);
const big1 = BigInt(1);
const big8 = BigInt(8);
function bigToUint8Array(big) {
    if (big < big0) {
        // work out how long is the big int in bits and add 1
        const bits = (BigInt(big.toString(2).length) / big8 + big1) * big8;
        // create a BigInt that's 100000... of length of big + 1
        const prefix1 = big1 << bits;
        big += prefix1;
    }
    let hex = big.toString(16);
    if (hex.length % 2) {
        hex = '0' + hex;
    }
    const len = hex.length / 2;
    const u8 = new Uint8Array(len);
    var i = 0;
    var j = 0;
    while (i < len) {
        u8[i] = parseInt(hex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }
    return u8;
}
exports.bigToUint8Array = bigToUint8Array;
//# sourceMappingURL=BigIntToUint8Array.js.map