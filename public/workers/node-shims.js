/* Minimal browser-side shims for the Node builtins the content's demos require
 * (events, util, crypto). They reproduce Node's observable output for the common
 * cases — notably a correct SHA-256 so password-hash/HMAC demos match the stored
 * expected output. Shared by the JS worker and scripts/check-runnable.ts.
 */
(function (global) {
  const enc = new TextEncoder();

  function toBytes(input) {
    if (input instanceof Uint8Array) return input;
    return enc.encode(String(input));
  }
  function bytesToHex(bytes) {
    let s = "";
    for (let i = 0; i < bytes.length; i++) s += bytes[i].toString(16).padStart(2, "0");
    return s;
  }
  function bytesToBase64(bytes) {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return (global.btoa ? global.btoa(bin) : Buffer.from(bytes).toString("base64"));
  }
  function encodeOut(bytes, encoding) {
    if (encoding === "hex") return bytesToHex(bytes);
    if (encoding === "base64") return bytesToBase64(bytes);
    if (encoding === "base64url")
      return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return bytes;
  }

  // ---- SHA-256 (FIPS 180-4) ----
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  function sha256(msgBytes) {
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const l = msgBytes.length;
    const withOne = l + 1;
    const k = (56 - (withOne % 64) + 64) % 64;
    const total = withOne + k + 8;
    const m = new Uint8Array(total);
    m.set(msgBytes);
    m[l] = 0x80;
    const bitLen = l * 8;
    const dv = new DataView(m.buffer);
    dv.setUint32(total - 4, bitLen >>> 0);
    dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000));
    const w = new Uint32Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < total; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    const out = new Uint8Array(32);
    const odv = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) odv.setUint32(i * 4, H[i] >>> 0);
    return out;
  }
  function hmacSha256(keyInput, msgInput) {
    let key = toBytes(keyInput);
    if (key.length > 64) key = sha256(key);
    const block = new Uint8Array(64);
    block.set(key);
    const ipad = new Uint8Array(64);
    const opad = new Uint8Array(64);
    for (let i = 0; i < 64; i++) {
      ipad[i] = block[i] ^ 0x36;
      opad[i] = block[i] ^ 0x5c;
    }
    const msg = toBytes(msgInput);
    const inner = new Uint8Array(64 + msg.length);
    inner.set(ipad); inner.set(msg, 64);
    const innerHash = sha256(inner);
    const outer = new Uint8Array(64 + 32);
    outer.set(opad); outer.set(innerHash, 64);
    return sha256(outer);
  }

  function getRandomValues(arr) {
    if (global.crypto && global.crypto.getRandomValues) return global.crypto.getRandomValues(arr);
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    return arr;
  }

  const crypto = {
    createHash(algo) {
      if (!/^sha-?256$/i.test(algo)) {
        return {
          _chunks: [],
          update() { return this; },
          digest() { throw new Error(`crypto hash '${algo}' is not supported in the browser playground (sha256 only)`); },
        };
      }
      let buf = new Uint8Array(0);
      return {
        update(data) {
          const b = toBytes(data);
          const next = new Uint8Array(buf.length + b.length);
          next.set(buf); next.set(b, buf.length);
          buf = next;
          return this;
        },
        digest(encoding) {
          return encodeOut(sha256(buf), encoding);
        },
      };
    },
    createHmac(algo, key) {
      let buf = new Uint8Array(0);
      return {
        update(data) {
          const b = toBytes(data);
          const next = new Uint8Array(buf.length + b.length);
          next.set(buf); next.set(b, buf.length);
          buf = next;
          return this;
        },
        digest(encoding) {
          return encodeOut(hmacSha256(key, buf), encoding);
        },
      };
    },
    randomBytes(n) {
      const bytes = getRandomValues(new Uint8Array(n));
      return {
        length: n,
        toString: (encoding) => encodeOut(bytes, encoding || "hex"),
        _bytes: bytes,
      };
    },
    randomUUID() {
      const b = getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      const h = bytesToHex(b);
      return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    },
    randomInt(min, max) {
      if (max === undefined) { max = min; min = 0; }
      return min + Math.floor(Math.random() * (max - min));
    },
    timingSafeEqual(a, b) {
      const ba = a && a._bytes ? a._bytes : toBytes(a);
      const bb = b && b._bytes ? b._bytes : toBytes(b);
      if (ba.length !== bb.length) throw new Error("Input buffers must have the same byte length");
      let diff = 0;
      for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
      return diff === 0;
    },
    scryptSync() {
      throw new Error("crypto.scryptSync is not supported in the browser playground");
    },
    pbkdf2Sync() {
      throw new Error("crypto.pbkdf2Sync is not supported in the browser playground");
    },
  };

  // ---- events.EventEmitter ----
  class EventEmitter {
    constructor() { this._ev = Object.create(null); }
    on(name, fn) { (this._ev[name] || (this._ev[name] = [])).push(fn); return this; }
    addListener(name, fn) { return this.on(name, fn); }
    once(name, fn) {
      const wrap = (...a) => { this.off(name, wrap); fn(...a); };
      return this.on(name, wrap);
    }
    off(name, fn) {
      const l = this._ev[name];
      if (l) this._ev[name] = l.filter((f) => f !== fn);
      return this;
    }
    removeListener(name, fn) { return this.off(name, fn); }
    removeAllListeners(name) { if (name) delete this._ev[name]; else this._ev = Object.create(null); return this; }
    emit(name, ...args) {
      const l = this._ev[name];
      if (!l || !l.length) return false;
      for (const fn of l.slice()) fn(...args);
      return true;
    }
    listeners(name) { return (this._ev[name] || []).slice(); }
    listenerCount(name) { return (this._ev[name] || []).length; }
  }

  const util = {
    inspect: (v, opts) => global.__tddInspect(v, 0, (opts && opts.depth) != null ? opts.depth : 2, new Set()),
    format: (...args) => {
      if (typeof args[0] === "string" && /%[sdifjoO%]/.test(args[0])) {
        let i = 1;
        const out = args[0].replace(/%[sdifjoO%]/g, (m) => {
          if (m === "%%") return "%";
          if (i >= args.length) return m;
          const a = args[i++];
          if (m === "%d" || m === "%i") return String(parseInt(a, 10));
          if (m === "%f") return String(parseFloat(a));
          if (m === "%j") return JSON.stringify(a);
          if (m === "%s") return typeof a === "string" ? a : global.__tddFormatArg(a);
          return global.__tddInspect(a, 0, 2, new Set());
        });
        const rest = args.slice(i).map((a) => global.__tddFormatArg(a));
        return [out, ...rest].join(" ");
      }
      return args.map((a) => global.__tddFormatArg(a)).join(" ");
    },
    promisify: (fn) => (...args) =>
      new Promise((resolve, reject) =>
        fn(...args, (err, res) => (err ? reject(err) : resolve(res))),
      ),
    inherits: (ctor, superCtor) => {
      ctor.super_ = superCtor;
      Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
    },
    isDeepStrictEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    types: {},
  };

  global.__tddNodeBuiltins = {
    crypto,
    "node:crypto": crypto,
    events: Object.assign(EventEmitter, { EventEmitter, default: EventEmitter }),
    "node:events": Object.assign(EventEmitter, { EventEmitter }),
    util,
    "node:util": util,
  };
})(typeof self !== "undefined" ? self : globalThis);
