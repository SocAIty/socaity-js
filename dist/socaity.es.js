var $r = Object.defineProperty;
var zr = (r, e, t) => e in r ? $r(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var b = (r, e, t) => zr(r, typeof e != "symbol" ? e + "" : e, t);
class jt extends Error {
  constructor(e = "Invalid API key format. API keys should start with 'sk_' and be 67 characters long.") {
    super(e), this.name = "ApiKeyError", Error.captureStackTrace && Error.captureStackTrace(this, jt);
  }
}
const ie = class ie {
  constructor(e = {}) {
    b(this, "apiKey");
    b(this, "baseUrl");
    b(this, "pollInterval");
    b(this, "maxRetries");
    this.apiKey = e.apiKey, this.baseUrl = "http://localhost:8000/v0", this.pollInterval = e.pollInterval || 5e3, this.maxRetries = e.maxRetries || 3;
  }
  /**
   * Get the global configuration instance
   */
  static getInstance() {
    return ie.instance || (ie.instance = new ie()), ie.instance;
  }
  /**
   * Updates global configuration with new values
   */
  static update(e) {
    if (e.apiKey !== void 0 && (!e.apiKey.startsWith("sk_") || e.apiKey.length != 67))
      throw new jt("API key is wrong. Get your API key from the Socaity https://www.socaity.ai dashboard.");
    const t = ie.getInstance();
    Object.assign(t, e);
  }
};
b(ie, "instance");
let re = ie;
function ir(r, e) {
  return function() {
    return r.apply(e, arguments);
  };
}
const { toString: qr } = Object.prototype, { getPrototypeOf: Lt } = Object, ft = /* @__PURE__ */ ((r) => (e) => {
  const t = qr.call(e);
  return r[t] || (r[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), W = (r) => (r = r.toLowerCase(), (e) => ft(e) === r), ht = (r) => (e) => typeof e === r, { isArray: Re } = Array, je = ht("undefined");
function Jr(r) {
  return r !== null && !je(r) && r.constructor !== null && !je(r.constructor) && z(r.constructor.isBuffer) && r.constructor.isBuffer(r);
}
const ar = W("ArrayBuffer");
function Vr(r) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(r) : e = r && r.buffer && ar(r.buffer), e;
}
const Hr = ht("string"), z = ht("function"), or = ht("number"), pt = (r) => r !== null && typeof r == "object", Wr = (r) => r === !0 || r === !1, Ye = (r) => {
  if (ft(r) !== "object")
    return !1;
  const e = Lt(r);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in r) && !(Symbol.iterator in r);
}, Gr = W("Date"), Kr = W("File"), Qr = W("Blob"), Xr = W("FileList"), Yr = (r) => pt(r) && z(r.pipe), es = (r) => {
  let e;
  return r && (typeof FormData == "function" && r instanceof FormData || z(r.append) && ((e = ft(r)) === "formdata" || // detect form-data instance
  e === "object" && z(r.toString) && r.toString() === "[object FormData]"));
}, ts = W("URLSearchParams"), [rs, ss, ns, is] = ["ReadableStream", "Request", "Response", "Headers"].map(W), as = (r) => r.trim ? r.trim() : r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Ge(r, e, { allOwnKeys: t = !1 } = {}) {
  if (r === null || typeof r > "u")
    return;
  let s, n;
  if (typeof r != "object" && (r = [r]), Re(r))
    for (s = 0, n = r.length; s < n; s++)
      e.call(null, r[s], s, r);
  else {
    const i = t ? Object.getOwnPropertyNames(r) : Object.keys(r), a = i.length;
    let o;
    for (s = 0; s < a; s++)
      o = i[s], e.call(null, r[o], o, r);
  }
}
function cr(r, e) {
  e = e.toLowerCase();
  const t = Object.keys(r);
  let s = t.length, n;
  for (; s-- > 0; )
    if (n = t[s], e === n.toLowerCase())
      return n;
  return null;
}
const pe = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, ur = (r) => !je(r) && r !== pe;
function Et() {
  const { caseless: r } = ur(this) && this || {}, e = {}, t = (s, n) => {
    const i = r && cr(e, n) || n;
    Ye(e[i]) && Ye(s) ? e[i] = Et(e[i], s) : Ye(s) ? e[i] = Et({}, s) : Re(s) ? e[i] = s.slice() : e[i] = s;
  };
  for (let s = 0, n = arguments.length; s < n; s++)
    arguments[s] && Ge(arguments[s], t);
  return e;
}
const os = (r, e, t, { allOwnKeys: s } = {}) => (Ge(e, (n, i) => {
  t && z(n) ? r[i] = ir(n, t) : r[i] = n;
}, { allOwnKeys: s }), r), cs = (r) => (r.charCodeAt(0) === 65279 && (r = r.slice(1)), r), us = (r, e, t, s) => {
  r.prototype = Object.create(e.prototype, s), r.prototype.constructor = r, Object.defineProperty(r, "super", {
    value: e.prototype
  }), t && Object.assign(r.prototype, t);
}, ls = (r, e, t, s) => {
  let n, i, a;
  const o = {};
  if (e = e || {}, r == null) return e;
  do {
    for (n = Object.getOwnPropertyNames(r), i = n.length; i-- > 0; )
      a = n[i], (!s || s(a, r, e)) && !o[a] && (e[a] = r[a], o[a] = !0);
    r = t !== !1 && Lt(r);
  } while (r && (!t || t(r, e)) && r !== Object.prototype);
  return e;
}, ds = (r, e, t) => {
  r = String(r), (t === void 0 || t > r.length) && (t = r.length), t -= e.length;
  const s = r.indexOf(e, t);
  return s !== -1 && s === t;
}, fs = (r) => {
  if (!r) return null;
  if (Re(r)) return r;
  let e = r.length;
  if (!or(e)) return null;
  const t = new Array(e);
  for (; e-- > 0; )
    t[e] = r[e];
  return t;
}, hs = /* @__PURE__ */ ((r) => (e) => r && e instanceof r)(typeof Uint8Array < "u" && Lt(Uint8Array)), ps = (r, e) => {
  const s = (r && r[Symbol.iterator]).call(r);
  let n;
  for (; (n = s.next()) && !n.done; ) {
    const i = n.value;
    e.call(r, i[0], i[1]);
  }
}, ms = (r, e) => {
  let t;
  const s = [];
  for (; (t = r.exec(e)) !== null; )
    s.push(t);
  return s;
}, ys = W("HTMLFormElement"), gs = (r) => r.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(t, s, n) {
    return s.toUpperCase() + n;
  }
), Zt = (({ hasOwnProperty: r }) => (e, t) => r.call(e, t))(Object.prototype), _s = W("RegExp"), lr = (r, e) => {
  const t = Object.getOwnPropertyDescriptors(r), s = {};
  Ge(t, (n, i) => {
    let a;
    (a = e(n, i, r)) !== !1 && (s[i] = a || n);
  }), Object.defineProperties(r, s);
}, bs = (r) => {
  lr(r, (e, t) => {
    if (z(r) && ["arguments", "caller", "callee"].indexOf(t) !== -1)
      return !1;
    const s = r[t];
    if (z(s)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, vs = (r, e) => {
  const t = {}, s = (n) => {
    n.forEach((i) => {
      t[i] = !0;
    });
  };
  return Re(r) ? s(r) : s(String(r).split(e)), t;
}, ws = () => {
}, xs = (r, e) => r != null && Number.isFinite(r = +r) ? r : e;
function Es(r) {
  return !!(r && z(r.append) && r[Symbol.toStringTag] === "FormData" && r[Symbol.iterator]);
}
const Ts = (r) => {
  const e = new Array(10), t = (s, n) => {
    if (pt(s)) {
      if (e.indexOf(s) >= 0)
        return;
      if (!("toJSON" in s)) {
        e[n] = s;
        const i = Re(s) ? [] : {};
        return Ge(s, (a, o) => {
          const u = t(a, n + 1);
          !je(u) && (i[o] = u);
        }), e[n] = void 0, i;
      }
    }
    return s;
  };
  return t(r, 0);
}, ks = W("AsyncFunction"), Ss = (r) => r && (pt(r) || z(r)) && z(r.then) && z(r.catch), dr = ((r, e) => r ? setImmediate : e ? ((t, s) => (pe.addEventListener("message", ({ source: n, data: i }) => {
  n === pe && i === t && s.length && s.shift()();
}, !1), (n) => {
  s.push(n), pe.postMessage(t, "*");
}))(`axios@${Math.random()}`, []) : (t) => setTimeout(t))(
  typeof setImmediate == "function",
  z(pe.postMessage)
), As = typeof queueMicrotask < "u" ? queueMicrotask.bind(pe) : typeof process < "u" && process.nextTick || dr, l = {
  isArray: Re,
  isArrayBuffer: ar,
  isBuffer: Jr,
  isFormData: es,
  isArrayBufferView: Vr,
  isString: Hr,
  isNumber: or,
  isBoolean: Wr,
  isObject: pt,
  isPlainObject: Ye,
  isReadableStream: rs,
  isRequest: ss,
  isResponse: ns,
  isHeaders: is,
  isUndefined: je,
  isDate: Gr,
  isFile: Kr,
  isBlob: Qr,
  isRegExp: _s,
  isFunction: z,
  isStream: Yr,
  isURLSearchParams: ts,
  isTypedArray: hs,
  isFileList: Xr,
  forEach: Ge,
  merge: Et,
  extend: os,
  trim: as,
  stripBOM: cs,
  inherits: us,
  toFlatObject: ls,
  kindOf: ft,
  kindOfTest: W,
  endsWith: ds,
  toArray: fs,
  forEachEntry: ps,
  matchAll: ms,
  isHTMLForm: ys,
  hasOwnProperty: Zt,
  hasOwnProp: Zt,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: lr,
  freezeMethods: bs,
  toObjectSet: vs,
  toCamelCase: gs,
  noop: ws,
  toFiniteNumber: xs,
  findKey: cr,
  global: pe,
  isContextDefined: ur,
  isSpecCompliantForm: Es,
  toJSONObject: Ts,
  isAsyncFn: ks,
  isThenable: Ss,
  setImmediate: dr,
  asap: As
};
function x(r, e, t, s, n) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = r, this.name = "AxiosError", e && (this.code = e), t && (this.config = t), s && (this.request = s), n && (this.response = n, this.status = n.status ? n.status : null);
}
l.inherits(x, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: l.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const fr = x.prototype, hr = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((r) => {
  hr[r] = { value: r };
});
Object.defineProperties(x, hr);
Object.defineProperty(fr, "isAxiosError", { value: !0 });
x.from = (r, e, t, s, n, i) => {
  const a = Object.create(fr);
  return l.toFlatObject(r, a, function(u) {
    return u !== Error.prototype;
  }, (o) => o !== "isAxiosError"), x.call(a, r.message, e, t, s, n), a.cause = r, a.name = r.name, i && Object.assign(a, i), a;
};
const Rs = null;
function Tt(r) {
  return l.isPlainObject(r) || l.isArray(r);
}
function pr(r) {
  return l.endsWith(r, "[]") ? r.slice(0, -2) : r;
}
function $t(r, e, t) {
  return r ? r.concat(e).map(function(n, i) {
    return n = pr(n), !t && i ? "[" + n + "]" : n;
  }).join(t ? "." : "") : e;
}
function Cs(r) {
  return l.isArray(r) && !r.some(Tt);
}
const Os = l.toFlatObject(l, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function mt(r, e, t) {
  if (!l.isObject(r))
    throw new TypeError("target must be an object");
  e = e || new FormData(), t = l.toFlatObject(t, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(T, _) {
    return !l.isUndefined(_[T]);
  });
  const s = t.metaTokens, n = t.visitor || d, i = t.dots, a = t.indexes, u = (t.Blob || typeof Blob < "u" && Blob) && l.isSpecCompliantForm(e);
  if (!l.isFunction(n))
    throw new TypeError("visitor must be a function");
  function c(g) {
    if (g === null) return "";
    if (l.isDate(g))
      return g.toISOString();
    if (!u && l.isBlob(g))
      throw new x("Blob is not supported. Use a Buffer instead.");
    return l.isArrayBuffer(g) || l.isTypedArray(g) ? u && typeof Blob == "function" ? new Blob([g]) : Buffer.from(g) : g;
  }
  function d(g, T, _) {
    let N = g;
    if (g && !_ && typeof g == "object") {
      if (l.endsWith(T, "{}"))
        T = s ? T : T.slice(0, -2), g = JSON.stringify(g);
      else if (l.isArray(g) && Cs(g) || (l.isFileList(g) || l.endsWith(T, "[]")) && (N = l.toArray(g)))
        return T = pr(T), N.forEach(function(L, Y) {
          !(l.isUndefined(L) || L === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            a === !0 ? $t([T], Y, i) : a === null ? T : T + "[]",
            c(L)
          );
        }), !1;
    }
    return Tt(g) ? !0 : (e.append($t(_, T, i), c(g)), !1);
  }
  const p = [], A = Object.assign(Os, {
    defaultVisitor: d,
    convertValue: c,
    isVisitable: Tt
  });
  function C(g, T) {
    if (!l.isUndefined(g)) {
      if (p.indexOf(g) !== -1)
        throw Error("Circular reference detected in " + T.join("."));
      p.push(g), l.forEach(g, function(N, P) {
        (!(l.isUndefined(N) || N === null) && n.call(
          e,
          N,
          l.isString(P) ? P.trim() : P,
          T,
          A
        )) === !0 && C(N, T ? T.concat(P) : [P]);
      }), p.pop();
    }
  }
  if (!l.isObject(r))
    throw new TypeError("data must be an object");
  return C(r), e;
}
function zt(r) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(r).replace(/[!'()~]|%20|%00/g, function(s) {
    return e[s];
  });
}
function Dt(r, e) {
  this._pairs = [], r && mt(r, this, e);
}
const mr = Dt.prototype;
mr.append = function(e, t) {
  this._pairs.push([e, t]);
};
mr.toString = function(e) {
  const t = e ? function(s) {
    return e.call(this, s, zt);
  } : zt;
  return this._pairs.map(function(n) {
    return t(n[0]) + "=" + t(n[1]);
  }, "").join("&");
};
function Ns(r) {
  return encodeURIComponent(r).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function yr(r, e, t) {
  if (!e)
    return r;
  const s = t && t.encode || Ns;
  l.isFunction(t) && (t = {
    serialize: t
  });
  const n = t && t.serialize;
  let i;
  if (n ? i = n(e, t) : i = l.isURLSearchParams(e) ? e.toString() : new Dt(e, t).toString(s), i) {
    const a = r.indexOf("#");
    a !== -1 && (r = r.slice(0, a)), r += (r.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return r;
}
class qt {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(e, t, s) {
    return this.handlers.push({
      fulfilled: e,
      rejected: t,
      synchronous: s ? s.synchronous : !1,
      runWhen: s ? s.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(e) {
    this.handlers[e] && (this.handlers[e] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(e) {
    l.forEach(this.handlers, function(s) {
      s !== null && e(s);
    });
  }
}
const gr = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Is = typeof URLSearchParams < "u" ? URLSearchParams : Dt, Ps = typeof FormData < "u" ? FormData : null, js = typeof Blob < "u" ? Blob : null, Ls = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Is,
    FormData: Ps,
    Blob: js
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Bt = typeof window < "u" && typeof document < "u", kt = typeof navigator == "object" && navigator || void 0, Ds = Bt && (!kt || ["ReactNative", "NativeScript", "NS"].indexOf(kt.product) < 0), Bs = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Us = Bt && window.location.href || "http://localhost", Ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Bt,
  hasStandardBrowserEnv: Ds,
  hasStandardBrowserWebWorkerEnv: Bs,
  navigator: kt,
  origin: Us
}, Symbol.toStringTag, { value: "Module" })), B = {
  ...Ms,
  ...Ls
};
function Fs(r, e) {
  return mt(r, new B.classes.URLSearchParams(), Object.assign({
    visitor: function(t, s, n, i) {
      return B.isNode && l.isBuffer(t) ? (this.append(s, t.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    }
  }, e));
}
function Zs(r) {
  return l.matchAll(/\w+|\[(\w*)]/g, r).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function $s(r) {
  const e = {}, t = Object.keys(r);
  let s;
  const n = t.length;
  let i;
  for (s = 0; s < n; s++)
    i = t[s], e[i] = r[i];
  return e;
}
function _r(r) {
  function e(t, s, n, i) {
    let a = t[i++];
    if (a === "__proto__") return !0;
    const o = Number.isFinite(+a), u = i >= t.length;
    return a = !a && l.isArray(n) ? n.length : a, u ? (l.hasOwnProp(n, a) ? n[a] = [n[a], s] : n[a] = s, !o) : ((!n[a] || !l.isObject(n[a])) && (n[a] = []), e(t, s, n[a], i) && l.isArray(n[a]) && (n[a] = $s(n[a])), !o);
  }
  if (l.isFormData(r) && l.isFunction(r.entries)) {
    const t = {};
    return l.forEachEntry(r, (s, n) => {
      e(Zs(s), n, t, 0);
    }), t;
  }
  return null;
}
function zs(r, e, t) {
  if (l.isString(r))
    try {
      return (e || JSON.parse)(r), l.trim(r);
    } catch (s) {
      if (s.name !== "SyntaxError")
        throw s;
    }
  return (t || JSON.stringify)(r);
}
const Ke = {
  transitional: gr,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(e, t) {
    const s = t.getContentType() || "", n = s.indexOf("application/json") > -1, i = l.isObject(e);
    if (i && l.isHTMLForm(e) && (e = new FormData(e)), l.isFormData(e))
      return n ? JSON.stringify(_r(e)) : e;
    if (l.isArrayBuffer(e) || l.isBuffer(e) || l.isStream(e) || l.isFile(e) || l.isBlob(e) || l.isReadableStream(e))
      return e;
    if (l.isArrayBufferView(e))
      return e.buffer;
    if (l.isURLSearchParams(e))
      return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
    let o;
    if (i) {
      if (s.indexOf("application/x-www-form-urlencoded") > -1)
        return Fs(e, this.formSerializer).toString();
      if ((o = l.isFileList(e)) || s.indexOf("multipart/form-data") > -1) {
        const u = this.env && this.env.FormData;
        return mt(
          o ? { "files[]": e } : e,
          u && new u(),
          this.formSerializer
        );
      }
    }
    return i || n ? (t.setContentType("application/json", !1), zs(e)) : e;
  }],
  transformResponse: [function(e) {
    const t = this.transitional || Ke.transitional, s = t && t.forcedJSONParsing, n = this.responseType === "json";
    if (l.isResponse(e) || l.isReadableStream(e))
      return e;
    if (e && l.isString(e) && (s && !this.responseType || n)) {
      const a = !(t && t.silentJSONParsing) && n;
      try {
        return JSON.parse(e);
      } catch (o) {
        if (a)
          throw o.name === "SyntaxError" ? x.from(o, x.ERR_BAD_RESPONSE, this, null, this.response) : o;
      }
    }
    return e;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: B.classes.FormData,
    Blob: B.classes.Blob
  },
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
l.forEach(["delete", "get", "head", "post", "put", "patch"], (r) => {
  Ke.headers[r] = {};
});
const qs = l.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), Js = (r) => {
  const e = {};
  let t, s, n;
  return r && r.split(`
`).forEach(function(a) {
    n = a.indexOf(":"), t = a.substring(0, n).trim().toLowerCase(), s = a.substring(n + 1).trim(), !(!t || e[t] && qs[t]) && (t === "set-cookie" ? e[t] ? e[t].push(s) : e[t] = [s] : e[t] = e[t] ? e[t] + ", " + s : s);
  }), e;
}, Jt = Symbol("internals");
function Oe(r) {
  return r && String(r).trim().toLowerCase();
}
function et(r) {
  return r === !1 || r == null ? r : l.isArray(r) ? r.map(et) : String(r);
}
function Vs(r) {
  const e = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; s = t.exec(r); )
    e[s[1]] = s[2];
  return e;
}
const Hs = (r) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(r.trim());
function bt(r, e, t, s, n) {
  if (l.isFunction(s))
    return s.call(this, e, t);
  if (n && (e = t), !!l.isString(e)) {
    if (l.isString(s))
      return e.indexOf(s) !== -1;
    if (l.isRegExp(s))
      return s.test(e);
  }
}
function Ws(r) {
  return r.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, s) => t.toUpperCase() + s);
}
function Gs(r, e) {
  const t = l.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((s) => {
    Object.defineProperty(r, s + t, {
      value: function(n, i, a) {
        return this[s].call(this, e, n, i, a);
      },
      configurable: !0
    });
  });
}
let $ = class {
  constructor(e) {
    e && this.set(e);
  }
  set(e, t, s) {
    const n = this;
    function i(o, u, c) {
      const d = Oe(u);
      if (!d)
        throw new Error("header name must be a non-empty string");
      const p = l.findKey(n, d);
      (!p || n[p] === void 0 || c === !0 || c === void 0 && n[p] !== !1) && (n[p || u] = et(o));
    }
    const a = (o, u) => l.forEach(o, (c, d) => i(c, d, u));
    if (l.isPlainObject(e) || e instanceof this.constructor)
      a(e, t);
    else if (l.isString(e) && (e = e.trim()) && !Hs(e))
      a(Js(e), t);
    else if (l.isHeaders(e))
      for (const [o, u] of e.entries())
        i(u, o, s);
    else
      e != null && i(t, e, s);
    return this;
  }
  get(e, t) {
    if (e = Oe(e), e) {
      const s = l.findKey(this, e);
      if (s) {
        const n = this[s];
        if (!t)
          return n;
        if (t === !0)
          return Vs(n);
        if (l.isFunction(t))
          return t.call(this, n, s);
        if (l.isRegExp(t))
          return t.exec(n);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, t) {
    if (e = Oe(e), e) {
      const s = l.findKey(this, e);
      return !!(s && this[s] !== void 0 && (!t || bt(this, this[s], s, t)));
    }
    return !1;
  }
  delete(e, t) {
    const s = this;
    let n = !1;
    function i(a) {
      if (a = Oe(a), a) {
        const o = l.findKey(s, a);
        o && (!t || bt(s, s[o], o, t)) && (delete s[o], n = !0);
      }
    }
    return l.isArray(e) ? e.forEach(i) : i(e), n;
  }
  clear(e) {
    const t = Object.keys(this);
    let s = t.length, n = !1;
    for (; s--; ) {
      const i = t[s];
      (!e || bt(this, this[i], i, e, !0)) && (delete this[i], n = !0);
    }
    return n;
  }
  normalize(e) {
    const t = this, s = {};
    return l.forEach(this, (n, i) => {
      const a = l.findKey(s, i);
      if (a) {
        t[a] = et(n), delete t[i];
        return;
      }
      const o = e ? Ws(i) : String(i).trim();
      o !== i && delete t[i], t[o] = et(n), s[o] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const t = /* @__PURE__ */ Object.create(null);
    return l.forEach(this, (s, n) => {
      s != null && s !== !1 && (t[n] = e && l.isArray(s) ? s.join(", ") : s);
    }), t;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([e, t]) => e + ": " + t).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(e) {
    return e instanceof this ? e : new this(e);
  }
  static concat(e, ...t) {
    const s = new this(e);
    return t.forEach((n) => s.set(n)), s;
  }
  static accessor(e) {
    const s = (this[Jt] = this[Jt] = {
      accessors: {}
    }).accessors, n = this.prototype;
    function i(a) {
      const o = Oe(a);
      s[o] || (Gs(n, a), s[o] = !0);
    }
    return l.isArray(e) ? e.forEach(i) : i(e), this;
  }
};
$.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
l.reduceDescriptors($.prototype, ({ value: r }, e) => {
  let t = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => r,
    set(s) {
      this[t] = s;
    }
  };
});
l.freezeMethods($);
function vt(r, e) {
  const t = this || Ke, s = e || t, n = $.from(s.headers);
  let i = s.data;
  return l.forEach(r, function(o) {
    i = o.call(t, i, n.normalize(), e ? e.status : void 0);
  }), n.normalize(), i;
}
function br(r) {
  return !!(r && r.__CANCEL__);
}
function Ce(r, e, t) {
  x.call(this, r ?? "canceled", x.ERR_CANCELED, e, t), this.name = "CanceledError";
}
l.inherits(Ce, x, {
  __CANCEL__: !0
});
function vr(r, e, t) {
  const s = t.config.validateStatus;
  !t.status || !s || s(t.status) ? r(t) : e(new x(
    "Request failed with status code " + t.status,
    [x.ERR_BAD_REQUEST, x.ERR_BAD_RESPONSE][Math.floor(t.status / 100) - 4],
    t.config,
    t.request,
    t
  ));
}
function Ks(r) {
  const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(r);
  return e && e[1] || "";
}
function Qs(r, e) {
  r = r || 10;
  const t = new Array(r), s = new Array(r);
  let n = 0, i = 0, a;
  return e = e !== void 0 ? e : 1e3, function(u) {
    const c = Date.now(), d = s[i];
    a || (a = c), t[n] = u, s[n] = c;
    let p = i, A = 0;
    for (; p !== n; )
      A += t[p++], p = p % r;
    if (n = (n + 1) % r, n === i && (i = (i + 1) % r), c - a < e)
      return;
    const C = d && c - d;
    return C ? Math.round(A * 1e3 / C) : void 0;
  };
}
function Xs(r, e) {
  let t = 0, s = 1e3 / e, n, i;
  const a = (c, d = Date.now()) => {
    t = d, n = null, i && (clearTimeout(i), i = null), r.apply(null, c);
  };
  return [(...c) => {
    const d = Date.now(), p = d - t;
    p >= s ? a(c, d) : (n = c, i || (i = setTimeout(() => {
      i = null, a(n);
    }, s - p)));
  }, () => n && a(n)];
}
const rt = (r, e, t = 3) => {
  let s = 0;
  const n = Qs(50, 250);
  return Xs((i) => {
    const a = i.loaded, o = i.lengthComputable ? i.total : void 0, u = a - s, c = n(u), d = a <= o;
    s = a;
    const p = {
      loaded: a,
      total: o,
      progress: o ? a / o : void 0,
      bytes: u,
      rate: c || void 0,
      estimated: c && o && d ? (o - a) / c : void 0,
      event: i,
      lengthComputable: o != null,
      [e ? "download" : "upload"]: !0
    };
    r(p);
  }, t);
}, Vt = (r, e) => {
  const t = r != null;
  return [(s) => e[0]({
    lengthComputable: t,
    total: r,
    loaded: s
  }), e[1]];
}, Ht = (r) => (...e) => l.asap(() => r(...e)), Ys = B.hasStandardBrowserEnv ? /* @__PURE__ */ ((r, e) => (t) => (t = new URL(t, B.origin), r.protocol === t.protocol && r.host === t.host && (e || r.port === t.port)))(
  new URL(B.origin),
  B.navigator && /(msie|trident)/i.test(B.navigator.userAgent)
) : () => !0, en = B.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(r, e, t, s, n, i) {
      const a = [r + "=" + encodeURIComponent(e)];
      l.isNumber(t) && a.push("expires=" + new Date(t).toGMTString()), l.isString(s) && a.push("path=" + s), l.isString(n) && a.push("domain=" + n), i === !0 && a.push("secure"), document.cookie = a.join("; ");
    },
    read(r) {
      const e = document.cookie.match(new RegExp("(^|;\\s*)(" + r + ")=([^;]*)"));
      return e ? decodeURIComponent(e[3]) : null;
    },
    remove(r) {
      this.write(r, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function tn(r) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(r);
}
function rn(r, e) {
  return e ? r.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : r;
}
function wr(r, e, t) {
  let s = !tn(e);
  return r && s || t == !1 ? rn(r, e) : e;
}
const Wt = (r) => r instanceof $ ? { ...r } : r;
function ge(r, e) {
  e = e || {};
  const t = {};
  function s(c, d, p, A) {
    return l.isPlainObject(c) && l.isPlainObject(d) ? l.merge.call({ caseless: A }, c, d) : l.isPlainObject(d) ? l.merge({}, d) : l.isArray(d) ? d.slice() : d;
  }
  function n(c, d, p, A) {
    if (l.isUndefined(d)) {
      if (!l.isUndefined(c))
        return s(void 0, c, p, A);
    } else return s(c, d, p, A);
  }
  function i(c, d) {
    if (!l.isUndefined(d))
      return s(void 0, d);
  }
  function a(c, d) {
    if (l.isUndefined(d)) {
      if (!l.isUndefined(c))
        return s(void 0, c);
    } else return s(void 0, d);
  }
  function o(c, d, p) {
    if (p in e)
      return s(c, d);
    if (p in r)
      return s(void 0, c);
  }
  const u = {
    url: i,
    method: i,
    data: i,
    baseURL: a,
    transformRequest: a,
    transformResponse: a,
    paramsSerializer: a,
    timeout: a,
    timeoutMessage: a,
    withCredentials: a,
    withXSRFToken: a,
    adapter: a,
    responseType: a,
    xsrfCookieName: a,
    xsrfHeaderName: a,
    onUploadProgress: a,
    onDownloadProgress: a,
    decompress: a,
    maxContentLength: a,
    maxBodyLength: a,
    beforeRedirect: a,
    transport: a,
    httpAgent: a,
    httpsAgent: a,
    cancelToken: a,
    socketPath: a,
    responseEncoding: a,
    validateStatus: o,
    headers: (c, d, p) => n(Wt(c), Wt(d), p, !0)
  };
  return l.forEach(Object.keys(Object.assign({}, r, e)), function(d) {
    const p = u[d] || n, A = p(r[d], e[d], d);
    l.isUndefined(A) && p !== o || (t[d] = A);
  }), t;
}
const xr = (r) => {
  const e = ge({}, r);
  let { data: t, withXSRFToken: s, xsrfHeaderName: n, xsrfCookieName: i, headers: a, auth: o } = e;
  e.headers = a = $.from(a), e.url = yr(wr(e.baseURL, e.url), r.params, r.paramsSerializer), o && a.set(
    "Authorization",
    "Basic " + btoa((o.username || "") + ":" + (o.password ? unescape(encodeURIComponent(o.password)) : ""))
  );
  let u;
  if (l.isFormData(t)) {
    if (B.hasStandardBrowserEnv || B.hasStandardBrowserWebWorkerEnv)
      a.setContentType(void 0);
    else if ((u = a.getContentType()) !== !1) {
      const [c, ...d] = u ? u.split(";").map((p) => p.trim()).filter(Boolean) : [];
      a.setContentType([c || "multipart/form-data", ...d].join("; "));
    }
  }
  if (B.hasStandardBrowserEnv && (s && l.isFunction(s) && (s = s(e)), s || s !== !1 && Ys(e.url))) {
    const c = n && i && en.read(i);
    c && a.set(n, c);
  }
  return e;
}, sn = typeof XMLHttpRequest < "u", nn = sn && function(r) {
  return new Promise(function(t, s) {
    const n = xr(r);
    let i = n.data;
    const a = $.from(n.headers).normalize();
    let { responseType: o, onUploadProgress: u, onDownloadProgress: c } = n, d, p, A, C, g;
    function T() {
      C && C(), g && g(), n.cancelToken && n.cancelToken.unsubscribe(d), n.signal && n.signal.removeEventListener("abort", d);
    }
    let _ = new XMLHttpRequest();
    _.open(n.method.toUpperCase(), n.url, !0), _.timeout = n.timeout;
    function N() {
      if (!_)
        return;
      const L = $.from(
        "getAllResponseHeaders" in _ && _.getAllResponseHeaders()
      ), F = {
        data: !o || o === "text" || o === "json" ? _.responseText : _.response,
        status: _.status,
        statusText: _.statusText,
        headers: L,
        config: r,
        request: _
      };
      vr(function(de) {
        t(de), T();
      }, function(de) {
        s(de), T();
      }, F), _ = null;
    }
    "onloadend" in _ ? _.onloadend = N : _.onreadystatechange = function() {
      !_ || _.readyState !== 4 || _.status === 0 && !(_.responseURL && _.responseURL.indexOf("file:") === 0) || setTimeout(N);
    }, _.onabort = function() {
      _ && (s(new x("Request aborted", x.ECONNABORTED, r, _)), _ = null);
    }, _.onerror = function() {
      s(new x("Network Error", x.ERR_NETWORK, r, _)), _ = null;
    }, _.ontimeout = function() {
      let Y = n.timeout ? "timeout of " + n.timeout + "ms exceeded" : "timeout exceeded";
      const F = n.transitional || gr;
      n.timeoutErrorMessage && (Y = n.timeoutErrorMessage), s(new x(
        Y,
        F.clarifyTimeoutError ? x.ETIMEDOUT : x.ECONNABORTED,
        r,
        _
      )), _ = null;
    }, i === void 0 && a.setContentType(null), "setRequestHeader" in _ && l.forEach(a.toJSON(), function(Y, F) {
      _.setRequestHeader(F, Y);
    }), l.isUndefined(n.withCredentials) || (_.withCredentials = !!n.withCredentials), o && o !== "json" && (_.responseType = n.responseType), c && ([A, g] = rt(c, !0), _.addEventListener("progress", A)), u && _.upload && ([p, C] = rt(u), _.upload.addEventListener("progress", p), _.upload.addEventListener("loadend", C)), (n.cancelToken || n.signal) && (d = (L) => {
      _ && (s(!L || L.type ? new Ce(null, r, _) : L), _.abort(), _ = null);
    }, n.cancelToken && n.cancelToken.subscribe(d), n.signal && (n.signal.aborted ? d() : n.signal.addEventListener("abort", d)));
    const P = Ks(n.url);
    if (P && B.protocols.indexOf(P) === -1) {
      s(new x("Unsupported protocol " + P + ":", x.ERR_BAD_REQUEST, r));
      return;
    }
    _.send(i || null);
  });
}, an = (r, e) => {
  const { length: t } = r = r ? r.filter(Boolean) : [];
  if (e || t) {
    let s = new AbortController(), n;
    const i = function(c) {
      if (!n) {
        n = !0, o();
        const d = c instanceof Error ? c : this.reason;
        s.abort(d instanceof x ? d : new Ce(d instanceof Error ? d.message : d));
      }
    };
    let a = e && setTimeout(() => {
      a = null, i(new x(`timeout ${e} of ms exceeded`, x.ETIMEDOUT));
    }, e);
    const o = () => {
      r && (a && clearTimeout(a), a = null, r.forEach((c) => {
        c.unsubscribe ? c.unsubscribe(i) : c.removeEventListener("abort", i);
      }), r = null);
    };
    r.forEach((c) => c.addEventListener("abort", i));
    const { signal: u } = s;
    return u.unsubscribe = () => l.asap(o), u;
  }
}, on = function* (r, e) {
  let t = r.byteLength;
  if (t < e) {
    yield r;
    return;
  }
  let s = 0, n;
  for (; s < t; )
    n = s + e, yield r.slice(s, n), s = n;
}, cn = async function* (r, e) {
  for await (const t of un(r))
    yield* on(t, e);
}, un = async function* (r) {
  if (r[Symbol.asyncIterator]) {
    yield* r;
    return;
  }
  const e = r.getReader();
  try {
    for (; ; ) {
      const { done: t, value: s } = await e.read();
      if (t)
        break;
      yield s;
    }
  } finally {
    await e.cancel();
  }
}, Gt = (r, e, t, s) => {
  const n = cn(r, e);
  let i = 0, a, o = (u) => {
    a || (a = !0, s && s(u));
  };
  return new ReadableStream({
    async pull(u) {
      try {
        const { done: c, value: d } = await n.next();
        if (c) {
          o(), u.close();
          return;
        }
        let p = d.byteLength;
        if (t) {
          let A = i += p;
          t(A);
        }
        u.enqueue(new Uint8Array(d));
      } catch (c) {
        throw o(c), c;
      }
    },
    cancel(u) {
      return o(u), n.return();
    }
  }, {
    highWaterMark: 2
  });
}, yt = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Er = yt && typeof ReadableStream == "function", ln = yt && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((r) => (e) => r.encode(e))(new TextEncoder()) : async (r) => new Uint8Array(await new Response(r).arrayBuffer())), Tr = (r, ...e) => {
  try {
    return !!r(...e);
  } catch {
    return !1;
  }
}, dn = Er && Tr(() => {
  let r = !1;
  const e = new Request(B.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return r = !0, "half";
    }
  }).headers.has("Content-Type");
  return r && !e;
}), Kt = 64 * 1024, St = Er && Tr(() => l.isReadableStream(new Response("").body)), st = {
  stream: St && ((r) => r.body)
};
yt && ((r) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
    !st[e] && (st[e] = l.isFunction(r[e]) ? (t) => t[e]() : (t, s) => {
      throw new x(`Response type '${e}' is not supported`, x.ERR_NOT_SUPPORT, s);
    });
  });
})(new Response());
const fn = async (r) => {
  if (r == null)
    return 0;
  if (l.isBlob(r))
    return r.size;
  if (l.isSpecCompliantForm(r))
    return (await new Request(B.origin, {
      method: "POST",
      body: r
    }).arrayBuffer()).byteLength;
  if (l.isArrayBufferView(r) || l.isArrayBuffer(r))
    return r.byteLength;
  if (l.isURLSearchParams(r) && (r = r + ""), l.isString(r))
    return (await ln(r)).byteLength;
}, hn = async (r, e) => {
  const t = l.toFiniteNumber(r.getContentLength());
  return t ?? fn(e);
}, pn = yt && (async (r) => {
  let {
    url: e,
    method: t,
    data: s,
    signal: n,
    cancelToken: i,
    timeout: a,
    onDownloadProgress: o,
    onUploadProgress: u,
    responseType: c,
    headers: d,
    withCredentials: p = "same-origin",
    fetchOptions: A
  } = xr(r);
  c = c ? (c + "").toLowerCase() : "text";
  let C = an([n, i && i.toAbortSignal()], a), g;
  const T = C && C.unsubscribe && (() => {
    C.unsubscribe();
  });
  let _;
  try {
    if (u && dn && t !== "get" && t !== "head" && (_ = await hn(d, s)) !== 0) {
      let F = new Request(e, {
        method: "POST",
        body: s,
        duplex: "half"
      }), ne;
      if (l.isFormData(s) && (ne = F.headers.get("content-type")) && d.setContentType(ne), F.body) {
        const [de, Xe] = Vt(
          _,
          rt(Ht(u))
        );
        s = Gt(F.body, Kt, de, Xe);
      }
    }
    l.isString(p) || (p = p ? "include" : "omit");
    const N = "credentials" in Request.prototype;
    g = new Request(e, {
      ...A,
      signal: C,
      method: t.toUpperCase(),
      headers: d.normalize().toJSON(),
      body: s,
      duplex: "half",
      credentials: N ? p : void 0
    });
    let P = await fetch(g);
    const L = St && (c === "stream" || c === "response");
    if (St && (o || L && T)) {
      const F = {};
      ["status", "statusText", "headers"].forEach((Ft) => {
        F[Ft] = P[Ft];
      });
      const ne = l.toFiniteNumber(P.headers.get("content-length")), [de, Xe] = o && Vt(
        ne,
        rt(Ht(o), !0)
      ) || [];
      P = new Response(
        Gt(P.body, Kt, de, () => {
          Xe && Xe(), T && T();
        }),
        F
      );
    }
    c = c || "text";
    let Y = await st[l.findKey(st, c) || "text"](P, r);
    return !L && T && T(), await new Promise((F, ne) => {
      vr(F, ne, {
        data: Y,
        headers: $.from(P.headers),
        status: P.status,
        statusText: P.statusText,
        config: r,
        request: g
      });
    });
  } catch (N) {
    throw T && T(), N && N.name === "TypeError" && /fetch/i.test(N.message) ? Object.assign(
      new x("Network Error", x.ERR_NETWORK, r, g),
      {
        cause: N.cause || N
      }
    ) : x.from(N, N && N.code, r, g);
  }
}), At = {
  http: Rs,
  xhr: nn,
  fetch: pn
};
l.forEach(At, (r, e) => {
  if (r) {
    try {
      Object.defineProperty(r, "name", { value: e });
    } catch {
    }
    Object.defineProperty(r, "adapterName", { value: e });
  }
});
const Qt = (r) => `- ${r}`, mn = (r) => l.isFunction(r) || r === null || r === !1, kr = {
  getAdapter: (r) => {
    r = l.isArray(r) ? r : [r];
    const { length: e } = r;
    let t, s;
    const n = {};
    for (let i = 0; i < e; i++) {
      t = r[i];
      let a;
      if (s = t, !mn(t) && (s = At[(a = String(t)).toLowerCase()], s === void 0))
        throw new x(`Unknown adapter '${a}'`);
      if (s)
        break;
      n[a || "#" + i] = s;
    }
    if (!s) {
      const i = Object.entries(n).map(
        ([o, u]) => `adapter ${o} ` + (u === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let a = e ? i.length > 1 ? `since :
` + i.map(Qt).join(`
`) : " " + Qt(i[0]) : "as no adapter specified";
      throw new x(
        "There is no suitable adapter to dispatch the request " + a,
        "ERR_NOT_SUPPORT"
      );
    }
    return s;
  },
  adapters: At
};
function wt(r) {
  if (r.cancelToken && r.cancelToken.throwIfRequested(), r.signal && r.signal.aborted)
    throw new Ce(null, r);
}
function Xt(r) {
  return wt(r), r.headers = $.from(r.headers), r.data = vt.call(
    r,
    r.transformRequest
  ), ["post", "put", "patch"].indexOf(r.method) !== -1 && r.headers.setContentType("application/x-www-form-urlencoded", !1), kr.getAdapter(r.adapter || Ke.adapter)(r).then(function(s) {
    return wt(r), s.data = vt.call(
      r,
      r.transformResponse,
      s
    ), s.headers = $.from(s.headers), s;
  }, function(s) {
    return br(s) || (wt(r), s && s.response && (s.response.data = vt.call(
      r,
      r.transformResponse,
      s.response
    ), s.response.headers = $.from(s.response.headers))), Promise.reject(s);
  });
}
const Sr = "1.8.2", gt = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((r, e) => {
  gt[r] = function(s) {
    return typeof s === r || "a" + (e < 1 ? "n " : " ") + r;
  };
});
const Yt = {};
gt.transitional = function(e, t, s) {
  function n(i, a) {
    return "[Axios v" + Sr + "] Transitional option '" + i + "'" + a + (s ? ". " + s : "");
  }
  return (i, a, o) => {
    if (e === !1)
      throw new x(
        n(a, " has been removed" + (t ? " in " + t : "")),
        x.ERR_DEPRECATED
      );
    return t && !Yt[a] && (Yt[a] = !0, console.warn(
      n(
        a,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(i, a, o) : !0;
  };
};
gt.spelling = function(e) {
  return (t, s) => (console.warn(`${s} is likely a misspelling of ${e}`), !0);
};
function yn(r, e, t) {
  if (typeof r != "object")
    throw new x("options must be an object", x.ERR_BAD_OPTION_VALUE);
  const s = Object.keys(r);
  let n = s.length;
  for (; n-- > 0; ) {
    const i = s[n], a = e[i];
    if (a) {
      const o = r[i], u = o === void 0 || a(o, i, r);
      if (u !== !0)
        throw new x("option " + i + " must be " + u, x.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (t !== !0)
      throw new x("Unknown option " + i, x.ERR_BAD_OPTION);
  }
}
const tt = {
  assertOptions: yn,
  validators: gt
}, G = tt.validators;
let me = class {
  constructor(e) {
    this.defaults = e, this.interceptors = {
      request: new qt(),
      response: new qt()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(e, t) {
    try {
      return await this._request(e, t);
    } catch (s) {
      if (s instanceof Error) {
        let n = {};
        Error.captureStackTrace ? Error.captureStackTrace(n) : n = new Error();
        const i = n.stack ? n.stack.replace(/^.+\n/, "") : "";
        try {
          s.stack ? i && !String(s.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (s.stack += `
` + i) : s.stack = i;
        } catch {
        }
      }
      throw s;
    }
  }
  _request(e, t) {
    typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {}, t = ge(this.defaults, t);
    const { transitional: s, paramsSerializer: n, headers: i } = t;
    s !== void 0 && tt.assertOptions(s, {
      silentJSONParsing: G.transitional(G.boolean),
      forcedJSONParsing: G.transitional(G.boolean),
      clarifyTimeoutError: G.transitional(G.boolean)
    }, !1), n != null && (l.isFunction(n) ? t.paramsSerializer = {
      serialize: n
    } : tt.assertOptions(n, {
      encode: G.function,
      serialize: G.function
    }, !0)), t.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : t.allowAbsoluteUrls = !0), tt.assertOptions(t, {
      baseUrl: G.spelling("baseURL"),
      withXsrfToken: G.spelling("withXSRFToken")
    }, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase();
    let a = i && l.merge(
      i.common,
      i[t.method]
    );
    i && l.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (g) => {
        delete i[g];
      }
    ), t.headers = $.concat(a, i);
    const o = [];
    let u = !0;
    this.interceptors.request.forEach(function(T) {
      typeof T.runWhen == "function" && T.runWhen(t) === !1 || (u = u && T.synchronous, o.unshift(T.fulfilled, T.rejected));
    });
    const c = [];
    this.interceptors.response.forEach(function(T) {
      c.push(T.fulfilled, T.rejected);
    });
    let d, p = 0, A;
    if (!u) {
      const g = [Xt.bind(this), void 0];
      for (g.unshift.apply(g, o), g.push.apply(g, c), A = g.length, d = Promise.resolve(t); p < A; )
        d = d.then(g[p++], g[p++]);
      return d;
    }
    A = o.length;
    let C = t;
    for (p = 0; p < A; ) {
      const g = o[p++], T = o[p++];
      try {
        C = g(C);
      } catch (_) {
        T.call(this, _);
        break;
      }
    }
    try {
      d = Xt.call(this, C);
    } catch (g) {
      return Promise.reject(g);
    }
    for (p = 0, A = c.length; p < A; )
      d = d.then(c[p++], c[p++]);
    return d;
  }
  getUri(e) {
    e = ge(this.defaults, e);
    const t = wr(e.baseURL, e.url, e.allowAbsoluteUrls);
    return yr(t, e.params, e.paramsSerializer);
  }
};
l.forEach(["delete", "get", "head", "options"], function(e) {
  me.prototype[e] = function(t, s) {
    return this.request(ge(s || {}, {
      method: e,
      url: t,
      data: (s || {}).data
    }));
  };
});
l.forEach(["post", "put", "patch"], function(e) {
  function t(s) {
    return function(i, a, o) {
      return this.request(ge(o || {}, {
        method: e,
        headers: s ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: a
      }));
    };
  }
  me.prototype[e] = t(), me.prototype[e + "Form"] = t(!0);
});
let gn = class Ar {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let t;
    this.promise = new Promise(function(i) {
      t = i;
    });
    const s = this;
    this.promise.then((n) => {
      if (!s._listeners) return;
      let i = s._listeners.length;
      for (; i-- > 0; )
        s._listeners[i](n);
      s._listeners = null;
    }), this.promise.then = (n) => {
      let i;
      const a = new Promise((o) => {
        s.subscribe(o), i = o;
      }).then(n);
      return a.cancel = function() {
        s.unsubscribe(i);
      }, a;
    }, e(function(i, a, o) {
      s.reason || (s.reason = new Ce(i, a, o), t(s.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(e) {
    if (this.reason) {
      e(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(e) : this._listeners = [e];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(e) {
    if (!this._listeners)
      return;
    const t = this._listeners.indexOf(e);
    t !== -1 && this._listeners.splice(t, 1);
  }
  toAbortSignal() {
    const e = new AbortController(), t = (s) => {
      e.abort(s);
    };
    return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let e;
    return {
      token: new Ar(function(n) {
        e = n;
      }),
      cancel: e
    };
  }
};
function _n(r) {
  return function(t) {
    return r.apply(null, t);
  };
}
function bn(r) {
  return l.isObject(r) && r.isAxiosError === !0;
}
const Rt = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(Rt).forEach(([r, e]) => {
  Rt[e] = r;
});
function Rr(r) {
  const e = new me(r), t = ir(me.prototype.request, e);
  return l.extend(t, me.prototype, e, { allOwnKeys: !0 }), l.extend(t, e, null, { allOwnKeys: !0 }), t.create = function(n) {
    return Rr(ge(r, n));
  }, t;
}
const R = Rr(Ke);
R.Axios = me;
R.CanceledError = Ce;
R.CancelToken = gn;
R.isCancel = br;
R.VERSION = Sr;
R.toFormData = mt;
R.AxiosError = x;
R.Cancel = R.CanceledError;
R.all = function(e) {
  return Promise.all(e);
};
R.spread = _n;
R.isAxiosError = bn;
R.mergeConfig = ge;
R.AxiosHeaders = $;
R.formToJSON = (r) => _r(l.isHTMLForm(r) ? new FormData(r) : r);
R.getAdapter = kr.getAdapter;
R.HttpStatusCode = Rt;
R.default = R;
const {
  Axios: Bi,
  AxiosError: Ui,
  CanceledError: Mi,
  isCancel: Fi,
  CancelToken: Zi,
  VERSION: $i,
  all: zi,
  Cancel: qi,
  isAxiosError: Ji,
  spread: Vi,
  toFormData: Hi,
  AxiosHeaders: Wi,
  HttpStatusCode: Gi,
  formToJSON: Ki,
  getAdapter: Qi,
  mergeConfig: Xi
} = R;
class Ut {
  constructor() {
    b(this, "config");
    b(this, "axiosInstance");
    b(this, "cancelTokenSource");
    this.config = re.getInstance(), this.cancelTokenSource = R.CancelToken.source(), this.axiosInstance = R.create({
      baseURL: this.config.baseUrl,
      timeout: 3e4,
      // 30 seconds timeout
      headers: {
        "Content-Type": "application/json"
      }
    }), this.axiosInstance.interceptors.response.use(
      (e) => e,
      (e) => {
        if (R.isCancel(e))
          return Promise.reject(new Error("Request canceled"));
        if (e.response) {
          const t = e.response.status, s = typeof e.response.data == "string" ? e.response.data : JSON.stringify(e.response.data);
          return Promise.reject(new Error(`API error (${t}): ${s}`));
        }
        return Promise.reject(e);
      }
    );
  }
  /**
   * Handle file upload
   * @param file File to upload
   */
  async handleFileUpload(e) {
    return null;
  }
  /**
   * Match request parameters against defined parameters
   * @param definingParams Expected parameters
   * @param params Actual parameters
   */
  matchParams(e, t) {
    const s = {};
    for (const [n, i] of Object.entries(e))
      n in t ? s[n] = t[n] : i !== void 0 && (s[n] = i);
    return s;
  }
  /**
   * Parse query parameters for the request
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   */
  parseQueryParams(e, t) {
    return e.queryParams ? this.matchParams(e.queryParams, t) : {};
  }
  /**
   * Parse body parameters for the request
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   */
  parseBodyParams(e, t) {
    return e.bodyParams ? this.matchParams(e.bodyParams, t) : {};
  }
  /**
   * Validates that an API key is available
   * @private
   */
  validateAPIKey(e) {
    const t = e || this.config.apiKey;
    if (!t)
      throw new Error("API key not provided");
    return t;
  }
  /**
   * Send a request to the API
   * @param path API endpoint path
   * @param method HTTP method
   * @param queryParams URL query parameters
   * @param bodyParams Request body parameters
   * @param apiKey API key for authentication
   * @param file Optional file to upload
   */
  async sendRequest(e, t = "POST", s = {}, n = {}, i, a) {
    const o = this.validateAPIKey(i), u = {
      method: t,
      url: e,
      headers: {
        Authorization: `Bearer ${o}`
      },
      cancelToken: this.cancelTokenSource.token
    };
    Object.keys(s).length > 0 && (u.params = s), t === "POST" && Object.keys(n).length > 0 && (u.data = n), t === "GET" && Object.keys(n).length > 0 && (u.params = {
      ...u.params,
      ...n
    });
    try {
      return (await this.axiosInstance(u)).data;
    } catch (c) {
      throw c instanceof Error ? c : new Error(`Network error: ${String(c)}`);
    }
  }
  /**
   * Make a request to a specific endpoint
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   * @param apiKey API key
   * @param file Optional file to upload
   */
  async request_endpoint(e, t, s, n) {
    const i = this.parseQueryParams(e, t), a = this.parseBodyParams(e, t);
    return n = await this.handleFileUpload(n), this.sendRequest(
      e.path,
      e.method,
      i,
      a,
      s,
      n
    );
  }
  /**
   * Abort any ongoing requests
   */
  abort() {
    this.cancelTokenSource.cancel("Request canceled by user"), this.cancelTokenSource = R.CancelToken.source();
  }
}
var j = /* @__PURE__ */ ((r) => (r.CREATED = "CREATED", r.QUEUED = "QUEUED", r.PROCESSING = "PROCESSING", r.COMPLETED = "COMPLETED", r.FAILED = "FAILED", r))(j || {}), I = /* @__PURE__ */ ((r) => (r.INITIALIZING = "INITIALIZING", r.PREPARING = "PREPARING", r.SENDING = "SENDING", r.TRACKING = "TRACKING", r.PROCESSING_RESULT = "PROCESSING_RESULT", r.COMPLETED = "COMPLETED", r.FAILED = "FAILED", r))(I || {});
class Le {
  /**
   * Creates a new MediaFile instance.
   * 
   * @param file_name - Default filename to use
   * @param content_type - Default content type to use
   */
  constructor(e = "file", t = "application/octet-stream") {
    b(this, "content_type");
    b(this, "file_name");
    b(this, "_content", null);
    b(this, "_isNode");
    this.content_type = t, this.file_name = e, this._isNode = typeof window > "u";
  }
  /**
   * Factory method to create a MediaFile from any supported data type.
   * Automatically detects data type and uses the appropriate method.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @returns Promise resolving to a MediaFile instance or null
   */
  static async create(e) {
    return e == null ? null : new Le().fromAny(e);
  }
  /**
   * Load a file from any supported data type.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @param websafe - Prevents loading from file paths and malformatted base64 strings.
   * @returns Promise resolving to a MediaFile instance or null
   */
  async fromAny(e) {
    if (e instanceof Le)
      return e;
    if (this._isNode && this._isBuffer(e))
      return this.fromBytes(e);
    if (typeof Blob < "u" && e instanceof Blob) {
      const t = await e.arrayBuffer();
      return this.fromBytes(t);
    }
    if (e instanceof ArrayBuffer || e instanceof Uint8Array)
      return this.fromBytes(e);
    if (typeof e == "string") {
      if (this._isUrl(e))
        return await this.fromUrl(e);
      if (this._isBase64Data(e))
        return this.fromBase64(e);
      if (this._isNode && this._isValidFilePath(e))
        return await this.fromFile(e);
      try {
        return this.fromBase64(e);
      } catch {
        return console.error(`Could not process string data: ${e.substring(0, 50)}...`), null;
      }
    }
    return this._isFileResult(e) ? await this.fromDict(e) : this;
  }
  /** 
  Load a file from any supported data type, with additional checks for websafe content.
  Prevents loading from file paths and malformatted base64 strings.
  @param data - Data to load (file path, URL, base64 string, etc.)
  @returns Promise resolving to a MediaFile instance or null
  */
  async fromAnyWebsafe(e) {
    if (typeof e == "string" && !this._isUrl(e) && !this._isBase64Data(e) && !this._isFileResult(e))
      throw new Error("Invalid data type for websafe MediaFile");
    return this._isFileResult(e) ? await this.fromAnyWebsafe(e.content) : await this.fromAny(e);
  }
  /**
   * Load file from a file path (Node.js only).
   * 
   * @param filePath - Path to the file
   * @returns Promise resolving to the MediaFile instance
   */
  async fromFile(e) {
    if (!this._isNode)
      throw new Error("Loading from file path is only supported in Node.js environment");
    try {
      const s = await (await import("fs/promises")).readFile(e), n = await import("path");
      return this.file_name = n.basename(e), this._content = this._bufferToArrayBuffer(s), this._setContentTypeFromFileName(), this;
    } catch (t) {
      throw new Error(`Failed to load file from path: ${e}. ${t.message}`);
    }
  }
  /**
   * Load file from a URL.
   * 
   * @param url - URL to fetch the file from
   * @param headers - Optional headers for the request
   * @returns Promise resolving to the MediaFile instance
   */
  async fromUrl(e, t) {
    try {
      const s = await R.get(e, {
        responseType: "arraybuffer",
        headers: t || {
          "User-Agent": "MediaFile/1.0.0"
        }
      });
      this.content_type = s.headers["content-type"] || "application/octet-stream";
      const n = s.headers["content-disposition"];
      if (n) {
        const i = n.match(/filename=(?:['"]?)([^'";\n]+)/i);
        i && i[1] && (this.file_name = i[1]);
      }
      if (!this.file_name || this.file_name === "file") {
        const a = new URL(e).pathname.split("/"), o = a[a.length - 1];
        o && o.trim() !== "" ? this.file_name = decodeURIComponent(o) : this.file_name = "downloaded_file";
      }
      return this._content = s.data, this;
    } catch (s) {
      throw new Error(`Failed to load file from URL: ${e}. ${s.message}`);
    }
  }
  /**
   * Load file from base64 encoded string.
   * 
   * @param base64Data - Base64 encoded string, optionally with data URI prefix
   * @returns The MediaFile instance
   */
  fromBase64(e) {
    const { data: t, mediaType: s } = this._parseBase64Uri(e);
    s && (this.content_type = s);
    try {
      return this._content = this._isNode ? this._decodeBase64NodeJs(t) : this._decodeBase64Browser(t), this;
    } catch (n) {
      throw new Error(`Failed to decode base64 data: ${n.message}`);
    }
  }
  /**
   * Load file from binary data.
   * 
   * @param data - ArrayBuffer, Buffer, or Uint8Array containing the file data
   * @returns The MediaFile instance
   */
  fromBytes(e) {
    if (e instanceof SharedArrayBuffer) {
      const t = new Uint8Array(e), s = new ArrayBuffer(t.byteLength);
      return new Uint8Array(s).set(t), this._content = s, this;
    }
    if (e instanceof Uint8Array)
      if (e.buffer instanceof SharedArrayBuffer) {
        const t = new Uint8Array(e);
        this._content = t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength);
      } else
        this._content = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
    else if (this._isNode && Buffer.isBuffer(e))
      if (e.buffer instanceof SharedArrayBuffer) {
        const t = new Uint8Array(e);
        this._content = t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength);
      } else
        this._content = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
    else
      this._content = new Uint8Array(e).buffer;
    return this;
  }
  /**
   * Load file from a FileResult object.
   * 
   * @param fileResult - FileResult object with file metadata and base64 content
   * @returns The MediaFile instance
   */
  async fromDict(e) {
    return this.file_name = e.file_name, this.content_type = e.content_type, await this.fromAny(e.content);
  }
  /**
   * Convert the file to a Blob (browser only).
   * 
   * @returns Blob object representing the file
   */
  toBlob() {
    if (this._ensureContent(), typeof Blob > "u")
      throw new Error("Blob is not available in this environment");
    return new Blob([new Uint8Array(this._content)], { type: this.content_type });
  }
  /**
   * Convert the file to an ArrayBuffer.
   * 
   * @returns ArrayBuffer containing the file data
   */
  toArrayBuffer() {
    return this._ensureContent(), this._content instanceof SharedArrayBuffer ? this._content.slice(0) : this._content;
  }
  /**
   * Convert the file to a Uint8Array.
   * 
   * @returns Uint8Array containing the file data
   */
  toUint8Array() {
    return this._ensureContent(), new Uint8Array(this._content);
  }
  /**
   * Convert the file to a Node.js Buffer (Node.js only).
   * 
   * @returns Buffer containing the file data
   */
  toBuffer() {
    if (this._ensureContent(), !this._isNode)
      throw new Error("Buffer is only available in Node.js environment");
    return Buffer.from(this._content);
  }
  /**
   * Convert the file to a base64 encoded string.
   * 
   * @param includeDataUri - Whether to include the data URI prefix
   * @returns Base64 encoded string of the file data
   */
  toBase64(e = !0) {
    this._ensureContent();
    let t;
    if (this._isNode)
      t = Buffer.from(this._content).toString("base64");
    else {
      const s = new Uint8Array(this._content);
      let n = "";
      const i = 10240;
      for (let a = 0; a < s.length; a += i) {
        const o = s.subarray(a, Math.min(a + i, s.length));
        n += String.fromCharCode.apply(null, Array.from(o));
      }
      t = btoa(n);
    }
    return e ? `data:${this.content_type};base64,${t}` : t;
  }
  /**
   * Convert the file to a FileResult object.
   * 
   * @returns FileResult object with file metadata and base64 content
   */
  toJson() {
    return {
      file_name: this.file_name,
      content_type: this.content_type,
      content: this.toBase64()
    };
  }
  /**
   * Save the file to disk (Node.js) or trigger download (browser).
   * 
   * @param filePath - Optional file path (Node.js) or filename (browser)
   * @returns Promise that resolves when the file is saved
   */
  async save(e) {
    this._ensureContent();
    const t = e || this.file_name;
    if (this._isNode)
      try {
        const s = await import("fs/promises").then((a) => a.default || a), n = await import("path").then((a) => a.default || a);
        if (!n || typeof n.dirname != "function")
          throw new Error("Failed to load 'path' module.");
        const i = n.dirname(t);
        i !== "." && await s.mkdir(i, { recursive: !0 }).catch(() => {
        }), await s.writeFile(t, Buffer.from(this._content));
      } catch (s) {
        throw new Error(`Failed to save file: ${s.message}`);
      }
    else {
      const s = this.toBlob(), n = URL.createObjectURL(s), i = document.createElement("a");
      i.href = n, i.download = t, document.body.appendChild(i), i.click(), setTimeout(() => {
        document.body.removeChild(i), URL.revokeObjectURL(n);
      }, 100);
    }
  }
  /**
   * Get the file size in bytes.
   * 
   * @param unit - Unit to return the size in ('bytes', 'kb', 'mb', or 'gb')
   * @returns File size in the specified unit
   */
  fileSize(e = "bytes") {
    if (!this._content)
      return 0;
    const t = this._content.byteLength;
    switch (e) {
      case "kb":
        return t / 1024;
      case "mb":
        return t / (1024 * 1024);
      case "gb":
        return t / (1024 * 1024 * 1024);
      default:
        return t;
    }
  }
  /**
   * Get the file extension based on the content type or filename.
   * 
   * @returns File extension without the leading dot, or null if it cannot be determined
   */
  get extension() {
    var e;
    if (this.content_type && this.content_type !== "application/octet-stream") {
      const t = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/svg+xml": "svg",
        "audio/mpeg": "mp3",
        "audio/wav": "wav",
        "audio/ogg": "ogg",
        "video/mp4": "mp4",
        "video/quicktime": "mov",
        "application/pdf": "pdf",
        "text/plain": "txt",
        "text/html": "html",
        "application/json": "json"
      };
      if (this.content_type in t)
        return t[this.content_type];
      if (this._isNode)
        try {
          const n = require("mime-types").extension(this.content_type);
          if (n) return n;
        } catch {
        }
    }
    return this.file_name && this.file_name.includes(".") && ((e = this.file_name.split(".").pop()) == null ? void 0 : e.toLowerCase()) || null;
  }
  /**
   * Get the filename.
   */
  getFileName() {
    return this.file_name;
  }
  /**
   * Set the filename.
   */
  setFileName(e) {
    this.file_name = e;
  }
  /**
   * Get the content type.
   */
  getContentType() {
    return this.content_type;
  }
  /**
   * Set the content type.
   */
  setContentType(e) {
    this.content_type = e;
  }
  /**
   * Read raw file data.
   * 
   * @returns ArrayBuffer containing the file data
   */
  read() {
    return this._ensureContent(), this._content;
  }
  /**
   * Check if the file is empty.
   * 
   * @returns Boolean indicating if the file has content
   */
  isEmpty() {
    return !this._content || this._content.byteLength === 0;
  }
  /**
   * Get info about the file.
   * 
   * @returns Object with file information
   */
  getInfo() {
    return {
      fileName: this.file_name,
      contentType: this.content_type,
      size: this.fileSize(),
      extension: this.extension
    };
  }
  /**
   * Detect MIME type for the file based on file extension.
   * Updates the content_type property.
   * 
   * @private 
   */
  _setContentTypeFromFileName() {
    var s;
    if (!this.file_name) return;
    const e = (s = this.file_name.split(".").pop()) == null ? void 0 : s.toLowerCase();
    if (!e) return;
    if (this._isNode)
      try {
        const i = require("mime-types").lookup(this.file_name);
        if (i) {
          this.content_type = i;
          return;
        }
      } catch {
      }
    const t = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      mp4: "video/mp4",
      mov: "video/quicktime",
      pdf: "application/pdf",
      txt: "text/plain",
      html: "text/html",
      htm: "text/html",
      json: "application/json",
      js: "application/javascript",
      css: "text/css",
      xml: "application/xml",
      zip: "application/zip"
    };
    e in t && (this.content_type = t[e]);
  }
  /**
   * Parse a base64 data URI into content and media type.
   * 
   * @param data - Base64 string, potentially with data URI prefix
   * @returns Object containing the parsed data and media type
   * @private
   */
  _parseBase64Uri(e) {
    if (e.startsWith("data:")) {
      const [t, s] = e.split(",", 2), n = t.match(/^data:([^;,]+)/), i = n ? n[1] : null;
      return { data: s, mediaType: i };
    }
    return { data: e, mediaType: null };
  }
  /**
   * Ensure content exists before operating on it.
   * 
   * @private
   */
  _ensureContent() {
    if (!this._content)
      throw new Error("No content available. Load content first using fromFile, fromUrl, etc.");
  }
  /**
   * Check if a string is a valid file path.
   * 
   * @param path - Path to check
   * @returns Whether the path is valid
   * @private
   */
  _isValidFilePath(e) {
    if (!this._isNode)
      return !1;
    try {
      const t = require("fs");
      return t.existsSync(e) && t.statSync(e).isFile();
    } catch {
      return !1;
    }
  }
  /**
   * Check if a string is a URL.
   * 
   * @param url - URL to check
   * @returns Whether the string is a URL
   * @private
   */
  _isUrl(e) {
    try {
      const t = new URL(e);
      return t.protocol === "http:" || t.protocol === "https:";
    } catch {
      return !1;
    }
  }
  /**
   * Check if a string is a base64 data URI.
   * 
   * @param data - String to check
   * @returns Whether the string is a base64 data URI
   * @private
   */
  _isBase64Data(e) {
    return e.startsWith("data:") || this._isBase64String(e);
  }
  /**
   * Check if an object is a FileResult.
   * 
   * @param obj - Object to check
   * @returns Whether the object is a FileResult
   * @private
   */
  _isFileResult(e) {
    return e && typeof e == "object" && "file_name" in e && "content_type" in e && "content" in e;
  }
  /**
   * Check if an object is a Buffer.
   * 
   * @param obj - Object to check
   * @returns Whether the object is a Buffer
   * @private
   */
  _isBuffer(e) {
    return this._isNode && Buffer.isBuffer(e);
  }
  /**
   * Decode base64 string in Node.js environment.
   * 
   * @param base64 - Base64 string to decode
   * @returns ArrayBuffer containing the decoded data
   * @private
   */
  _decodeBase64NodeJs(e) {
    const t = Buffer.from(e, "base64");
    return this._bufferToArrayBuffer(t);
  }
  /**
   * Decode base64 string in browser environment.
   * 
   * @param base64 - Base64 string to decode
   * @returns ArrayBuffer containing the decoded data
   * @private
   */
  _decodeBase64Browser(e) {
    const t = atob(e), s = new Uint8Array(t.length);
    for (let n = 0; n < t.length; n++)
      s[n] = t.charCodeAt(n);
    return s.buffer;
  }
  /**
   * Convert a Node.js Buffer to an ArrayBuffer.
   * 
   * @param buffer - Buffer to convert
   * @returns ArrayBuffer containing the data
   * @private
   */
  _bufferToArrayBuffer(e) {
    if (e.buffer instanceof SharedArrayBuffer) {
      const t = new ArrayBuffer(e.byteLength);
      return new Uint8Array(t).set(new Uint8Array(e)), t;
    } else
      return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
  }
  /**
   * Check if a string appears to be base64 encoded.
   * 
   * @param str - String to check
   * @returns Whether the string is base64 encoded
   * @private
   */
  _isBase64String(e) {
    return /^[A-Za-z0-9+/=]+$/.test(e) && e.length % 4 === 0;
  }
}
class vn {
  /**
   * Check if the response can be parsed by this parser
   */
  canParse(e) {
    return e ? !!(e.id || e.jobId || e.id && (e.status || e.state) || e.id && e.status && e.urls) : !1;
  }
  /**
   * Parse response into standardized job format
   */
  async parse(e) {
    return {
      id: e.id || e.jobId || "",
      status: this.parseStatus(e),
      progress: this.parseProgress(e),
      result: this.parseResult(e.result),
      error: e.error || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
  /**
   * Parse status from different API formats
   */
  parseStatus(e) {
    const t = (e.status || "").toUpperCase();
    if (t === "COMPLETED" || t === "SUCCEEDED" || t === "FINISHED")
      return j.COMPLETED;
    if (t === "FAILED" || t === "ERROR")
      return j.FAILED;
    if (t === "IN_PROGRESS" || t === "PROCESSING" || t === "RUNNING" || t === "BOOTING")
      return j.PROCESSING;
    if (t === "QUEUED" || t === "PENDING" || t === "IN_QUEUE" || t === "STARTING")
      return j.QUEUED;
    if (e.state) {
      const s = e.state.toUpperCase();
      if (s === "COMPLETED") return j.COMPLETED;
      if (s === "FAILED") return j.FAILED;
      if (s === "IN_PROGRESS") return j.PROCESSING;
      if (s === "IN_QUEUE") return j.QUEUED;
      if (s === "CANCELLED" || s === "TIMED_OUT") return j.FAILED;
    }
    return j.CREATED;
  }
  /**
   * Parse progress from different API formats
   */
  parseProgress(e) {
    let t = e.progress || 0, s = e.message;
    typeof t == "object" && t !== null && (s = t.message || s, t = t.progress || 0);
    try {
      t = typeof t == "number" ? t : t !== null ? parseFloat(String(t)) : 0;
    } catch {
      t = 0;
    }
    return this.parseStatus(e) === j.COMPLETED && (t = 1), {
      progress: t,
      message: s
    };
  }
  async parseResult(e) {
    if (e == null)
      return null;
    if (typeof e != "string" && Array.isArray(e)) {
      let t = e.map((s) => this.parseResult(s));
      return await Promise.all(t);
    }
    if (typeof e == "object" || typeof e == "string")
      try {
        return await new Le().fromAnyWebsafe(e);
      } catch {
        return e;
      }
    return e;
  }
}
const fe = class fe {
  /**
   * Private constructor to enforce singleton pattern
   * @param requestHandler - RequestHandler for API communication
   */
  constructor(e) {
    b(this, "requestHandler");
    b(this, "config");
    b(this, "jobs");
    b(this, "responseParser");
    b(this, "mediaHandler");
    this.requestHandler = e, this.config = re.getInstance(), this.jobs = /* @__PURE__ */ new Map(), this.responseParser = new vn(), this.mediaHandler = new Le();
  }
  /**
   * Get the singleton instance of JobManager
   * @param requestHandler - Optional RequestHandler to use when creating the instance
   * @returns The JobManager instance
   */
  static getInstance(e) {
    return fe.instance || (e || (e = new Ut()), fe.instance = new fe(e)), fe.instance;
  }
  /**
   * Submit a new job to the API
   * @param endpoint - API endpoint to call
   * @param params - Parameters for the job
   * @param apiKey - Optional API key to use for this request
   * @param file - Optional file to include
   * @returns Promise resolving to the created job
   */
  async submitJob(e, t, s, n) {
    try {
      const i = await this.requestHandler.request_endpoint(e, t, s, n);
      if (!this.responseParser.canParse(i))
        throw new Error("Unexpected response format from API");
      const a = await this.responseParser.parse(i);
      return this.jobs.set(a.id, a), a;
    } catch (i) {
      throw i instanceof Error ? i : new Error(`Failed to submit job: ${String(i)}`);
    }
  }
  /**
   * Get all tracked jobs
   */
  getAllJobs() {
    return Array.from(this.jobs.values());
  }
  /**
   * Get a specific job by ID
   * @param jobId - ID of the job to retrieve
   */
  getJob(e) {
    return this.jobs.get(e);
  }
  /**
   * Track a job until it completes
   * @param job - The job to track
   * @returns Promise resolving to the final result of the job
   */
  async trackJobToCompletion(e) {
    let t = 0;
    for (; t < this.config.maxRetries; )
      try {
        const s = await this.requestHandler.sendRequest("status", "POST", { job_id: e.id }), n = await this.responseParser.parse(s);
        if (this.jobs.set(e.id, n), n.status === j.COMPLETED)
          return n.result;
        if (n.status === j.FAILED)
          throw new Error(`Job failed: ${n.error}`);
        await new Promise((i) => setTimeout(i, this.config.pollInterval));
      } catch (s) {
        if (t++, t >= this.config.maxRetries)
          throw s;
        await new Promise((n) => setTimeout(n, this.config.pollInterval * t));
      }
    throw new Error("Max retries exceeded while tracking job");
  }
  /**
   * Cancel a running job
   * @param jobId - ID of the job to cancel
   * @returns Promise resolving to true if the job was cancelled
   */
  async cancelJob(e) {
    try {
      return await this.requestHandler.sendRequest("cancel", "GET", { job_id: e }), this.jobs.delete(e), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Clear completed or failed jobs from tracking
   */
  clearCompletedJobs() {
    for (const [e, t] of this.jobs.entries())
      (t.status === j.COMPLETED || t.status === j.FAILED) && this.jobs.delete(e);
  }
};
b(fe, "instance");
let nt = fe;
const Pe = typeof process < "u" && process.stdout && process.stdout.clearLine;
let Ee;
if (Pe)
  try {
    Ee = require("cli-progress");
  } catch {
    console.warn("cli-progress package not found. Using basic console output for progress.");
  }
const he = class he {
  constructor() {
    b(this, "multiBar");
    b(this, "bars", /* @__PURE__ */ new Map());
    b(this, "isInitialized", !1);
    Pe && Ee && (this.multiBar = new Ee.MultiBar({
      clearOnComplete: !1,
      hideCursor: !0,
      format: "{bar} {percentage}% | {jobId} | {phase} | {message}"
    }), this.isInitialized = !0);
  }
  static getInstance() {
    return he.instance || (he.instance = new he()), he.instance;
  }
  createBar(e, t) {
    if (!this.isInitialized) return null;
    const s = this.multiBar.create(100, 0, {
      jobId: e,
      phase: t,
      message: "Starting..."
    });
    return this.bars.set(e, s), s;
  }
  updateBar(e, t, s) {
    const n = this.bars.get(e);
    n && n.update(t, s);
  }
  removeBar(e) {
    const t = this.bars.get(e);
    t && (t.stop(), this.multiBar.remove(t), this.bars.delete(e));
  }
  stopAll() {
    this.isInitialized && (this.multiBar.stop(), this.bars.clear());
  }
};
b(he, "instance");
let Ct = he;
class wn {
  constructor(e, t, s, n = !0) {
    b(this, "apiJob");
    b(this, "endpoint");
    b(this, "processingState");
    b(this, "jobManager");
    b(this, "result", null);
    b(this, "error", null);
    b(this, "completed", !1);
    b(this, "resolvePromise");
    b(this, "rejectPromise");
    b(this, "promise");
    b(this, "eventListeners", /* @__PURE__ */ new Map());
    b(this, "verbose");
    b(this, "progressBar", null);
    b(this, "progressBarManager");
    // Keep track of the last logged message to avoid duplicates
    b(this, "_lastLoggedMessage", null);
    this.apiJob = e, this.jobManager = t, this.endpoint = s, this.verbose = n, this.processingState = {
      phase: I.INITIALIZING,
      progress: 0
    }, this.progressBarManager = Ct.getInstance(), this.promise = new Promise((i, a) => {
      this.resolvePromise = i, this.rejectPromise = a;
    }), setTimeout(() => this.startTracking(), 0), this.verbose && this.initProgressDisplay();
  }
  /**
   * Initialize the progress display
   */
  initProgressDisplay() {
    this.verbose && (Pe && Ee ? (this.progressBar = this.progressBarManager.createBar(
      this.apiJob.id || "initializing",
      this.processingState.phase
    ), this.updateProgressDisplay()) : this.logProgress());
  }
  /**
   * Update the progress display based on current state
   */
  updateProgressDisplay() {
    if (!this.verbose) return;
    const e = this.processingState.phase, t = this.calculateProgressPercent(), s = this.formatProgressMessage();
    Pe && Ee && this.progressBar ? this.progressBarManager.updateBar(this.apiJob.id, t, {
      phase: e,
      message: s.replace(/^.*\| /, "")
      // Remove the progress percentage part
    }) : this.logProgress();
  }
  /**
   * Calculate progress percentage based on current state
   */
  calculateProgressPercent() {
    var t;
    const e = this.processingState.phase;
    if (e === I.TRACKING && ((t = this.apiJob.progress) != null && t.progress))
      return Math.round(this.apiJob.progress.progress * 100);
    switch (e) {
      case I.INITIALIZING:
        return 0;
      case I.PREPARING:
        return 5;
      case I.SENDING:
        return 10;
      case I.TRACKING:
        return 15;
      case I.PROCESSING_RESULT:
        return 90;
      case I.COMPLETED:
        return 100;
      case I.FAILED:
        return 100;
      default:
        return 0;
    }
  }
  /**
   * Format a human-readable progress message
   */
  formatProgressMessage() {
    var s;
    const e = this.processingState.phase, t = this.apiJob.id || "initializing";
    if (e === I.INITIALIZING || e === I.PREPARING || e === I.SENDING)
      return `${e} job | API: ${this.endpoint.path}`;
    if (e === I.TRACKING) {
      const n = this.apiJob.progress ? `${Math.round(this.apiJob.progress.progress * 100)}%` : "unknown";
      let i = `Job ${t} | Progress: ${n} | API: ${this.endpoint.path}`;
      return (s = this.apiJob.progress) != null && s.message && (i += ` | ${this.apiJob.progress.message}`), i;
    } else
      return `Job ${t} | ${e} | API: ${this.endpoint.path}`;
  }
  /**
   * Log progress to console (for browser environments)
   */
  logProgress() {
    const e = this.formatProgressMessage();
    (!this._lastLoggedMessage || this._lastLoggedMessage !== e) && (console.log(e), this._lastLoggedMessage = e);
  }
  /**
   * Stop the progress display
   */
  stopProgressDisplay() {
    if (!this.verbose) return;
    Pe && Ee && this.progressBar && (this.progressBarManager.removeBar(this.apiJob.id), this.progressBar = null);
    const e = this.processingState.phase;
    e === I.COMPLETED ? console.log(`✓ Job ${this.apiJob.id} completed successfully (${this.endpoint.path})`) : e === I.FAILED && console.log(`✗ Job ${this.apiJob.id} failed: ${this.processingState.message} (${this.endpoint.path})`);
  }
  /**
   * Add an event listener
   */
  on(e, t) {
    return this.eventListeners.has(e) || this.eventListeners.set(e, []), this.eventListeners.get(e).push(t), this;
  }
  /**
   * Emit an event
   */
  emit(e, ...t) {
    const s = this.eventListeners.get(e);
    s && s.forEach((n) => n(...t));
  }
  /**
   * Poll for job status updates
   */
  async pollJobStatus() {
    if (!(this.completed || !this.apiJob.id))
      try {
        const e = await this.jobManager.requestHandler.sendRequest("status", "GET", { job_id: this.apiJob.id });
        if (!e) {
          setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
          return;
        }
        const t = await this.jobManager.responseParser.parse(e);
        if (this.apiJob = t, this.emitJobUpdate(), this.verbose && this.updateProgressDisplay(), t.status === j.COMPLETED) {
          this.updateProcessingState(I.PROCESSING_RESULT, 0.9, "Processing result");
          try {
            this.result = await t.result, this.complete();
          } catch (s) {
            this.fail(s instanceof Error ? s : new Error(String(s)));
          }
        } else t.status === j.FAILED ? (this.updateProcessingState(I.FAILED, 1, t.error || "Job failed"), this.fail(new Error(t.error || "Job failed with no error message"))) : setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
      } catch (e) {
        console.error("Error polling job status:", e), setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
      }
  }
  /**
   * Start tracking the job
   */
  startTracking() {
    this.updateProcessingState(I.TRACKING, 0, "Tracking job status"), this.pollJobStatus();
  }
  /**
   * Mark the job as completed
   */
  complete() {
    this.updateProcessingState(I.COMPLETED, 1, "Job completed"), this.cleanup(), this.completed = !0, this.emit("completed", this.result), this.resolvePromise(this.result);
  }
  /**
   * Mark the job as failed
   */
  fail(e) {
    this.updateProcessingState(I.FAILED, 1, e.message), this.cleanup(), this.completed = !0, this.error = e, this.emit("failed", e), this.rejectPromise(e);
  }
  /**
   * Clean up resources
   */
  cleanup() {
    this.stopProgressDisplay();
  }
  /**
   * Update the internal processing state
   */
  updateProcessingState(e, t, s) {
    this.processingState = {
      phase: e,
      progress: t,
      message: s
    }, this.verbose && this.updateProgressDisplay(), this.emit("processingUpdated", this.processingState);
  }
  /**
   * Emit job update event
   */
  emitJobUpdate() {
    this.emit("progressUpdated", this.apiJob.progress), this.emit("statusUpdated", this.apiJob.status);
  }
  /**
   * Set verbosity of progress display
   * @param verbose Whether to display progress information
   */
  setVerbose(e) {
    return this.verbose = e, e && !this.progressBar && !this.completed ? this.initProgressDisplay() : !e && this.progressBar && this.stopProgressDisplay(), this;
  }
  /**
   * Register a callback for job completion
   */
  onCompleted(e) {
    return this.on("completed", e), this.completed && this.result !== null && setTimeout(() => e(this.result), 0), this;
  }
  /**
   * Register a callback for job failure
   */
  onFailed(e) {
    return this.on("failed", e), this.completed && this.error !== null && setTimeout(() => e(this.error), 0), this;
  }
  /**
   * Register a callback for job progress updates
   */
  onProgress(e) {
    return this.on("progressUpdated", e), setTimeout(() => e(this.apiJob.progress), 0), this;
  }
  /**
   * Register a callback for job status updates
   */
  onStatus(e) {
    return this.on("statusUpdated", e), setTimeout(() => e(this.apiJob.status), 0), this;
  }
  /**
   * Register a callback for internal processing state updates
   */
  onProcessingUpdated(e) {
    return this.on("processingUpdated", e), setTimeout(() => e(this.processingState), 0), this;
  }
  /**
   * Cancel the job
   */
  async cancel() {
    try {
      const e = await this.jobManager.cancelJob(this.apiJob.id);
      return e && (this.cleanup(), this.fail(new Error("Job cancelled by user"))), e;
    } catch {
      return !1;
    }
  }
  /**
   * Get the current job ID
   */
  get id() {
    return this.apiJob.id;
  }
  /**
   * Get the current job status
   */
  get status() {
    return this.apiJob.status;
  }
  /**
   * Get the current job progress
   */
  get progress() {
    return this.apiJob.progress || null;
  }
  /**
   * Get the current processing phase
   */
  get phase() {
    return this.processingState.phase;
  }
  /**
   * Implementation of the PromiseLike interface
   */
  then(e, t) {
    return this.promise.then(e, t);
  }
}
const Z = class Z {
  constructor() {
    b(this, "registeredClients", /* @__PURE__ */ new Map());
    b(this, "clientConstructors", /* @__PURE__ */ new Map());
  }
  static getInstance() {
    return Z.instance || (Z.instance = new Z()), Z.instance;
  }
  static registerClientType(e, t) {
    const s = Z.getInstance(), n = Z.normalizeClientName(e);
    s.clientConstructors.set(n, t);
  }
  static registerClient(e) {
    const t = Z.getInstance(), s = Z.normalizeClientName(e.name);
    t.registeredClients.set(s, e);
  }
  static getClient(e) {
    const t = Z.getInstance(), s = Z.normalizeClientName(e);
    let n = t.registeredClients.get(s);
    if (!n) {
      const i = t.clientConstructors.get(s);
      if (!i)
        throw new Error(
          `Client "${e}" not found. Available clients: ${Array.from(t.clientConstructors.keys()).join(", ")}`
        );
      n = new i(), t.registeredClients.set(s, n);
    }
    return n;
  }
  static getAvailableClients() {
    const e = Z.getInstance();
    return Array.from(e.clientConstructors.keys());
  }
  static normalizeClientName(e) {
    return e.toLowerCase().replace(/[^a-z0-9-]/g, "");
  }
};
b(Z, "instance");
let ae = Z;
class Cr {
  constructor(e) {
    b(this, "requestHandler");
    b(this, "config");
    b(this, "endpoints");
    b(this, "jobManager");
    // Name of the API client. Has influence on path variable in the requests which will be formatted like /api/v1/{name}/{endpoint}
    b(this, "name");
    this.name = e, this.config = re.getInstance(), this.requestHandler = new Ut(), this.endpoints = /* @__PURE__ */ new Map(), this.jobManager = nt.getInstance(this.requestHandler), this.registerEndpoints(), ae.registerClient(this);
  }
  sanitizePath(e) {
    return e.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  }
  /**
   * Register a new endpoint with the client
   */
  registerEndpoint(e) {
    const t = this.sanitizePath(e.path);
    e.path = this.name + "/" + t, this.endpoints.set(t, e);
  }
  /**
   * Get an endpoint by name
   */
  getEndpoint(e) {
    e = this.sanitizePath(e);
    const t = this.endpoints.get(e);
    if (!t)
      throw new Error(`Unknown endpoint: ${e}`);
    return t;
  }
  /**
   * Update the client configuration
   */
  updateConfig(e) {
    re.update(e);
  }
  /**
   * Submit a job to the API and return a TrackedJob for monitoring
   * @param endpoint - API endpoint path
   * @param params - Request parameters
   * @param apiKey - Optional API key to override the default
   * @param file - Optional file to upload
   * @returns A TrackedJob for monitoring the job
   */
  async submitTrackedJob(e, t, s, n, i = !0) {
    const a = await this.jobManager.submitJob(e, t, s, n);
    return new wn(a, this.jobManager, e, i);
  }
  /**
   * Get all active jobs for this client
   */
  getJobs() {
    return this.jobManager.getAllJobs();
  }
  /**
   * Get a specific job by ID
   */
  getJob(e) {
    return this.jobManager.getJob(e);
  }
  /**
   * Cancel a running job
   */
  async cancelJob(e) {
    return this.jobManager.cancelJob(e);
  }
}
var S;
(function(r) {
  r.assertEqual = (n) => n;
  function e(n) {
  }
  r.assertIs = e;
  function t(n) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (n) => {
    const i = {};
    for (const a of n)
      i[a] = a;
    return i;
  }, r.getValidEnumValues = (n) => {
    const i = r.objectKeys(n).filter((o) => typeof n[n[o]] != "number"), a = {};
    for (const o of i)
      a[o] = n[o];
    return r.objectValues(a);
  }, r.objectValues = (n) => r.objectKeys(n).map(function(i) {
    return n[i];
  }), r.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
    const i = [];
    for (const a in n)
      Object.prototype.hasOwnProperty.call(n, a) && i.push(a);
    return i;
  }, r.find = (n, i) => {
    for (const a of n)
      if (i(a))
        return a;
  }, r.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && isFinite(n) && Math.floor(n) === n;
  function s(n, i = " | ") {
    return n.map((a) => typeof a == "string" ? `'${a}'` : a).join(i);
  }
  r.joinValues = s, r.jsonStringifyReplacer = (n, i) => typeof i == "bigint" ? i.toString() : i;
})(S || (S = {}));
var Ot;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Ot || (Ot = {}));
const m = S.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), te = (r) => {
  switch (typeof r) {
    case "undefined":
      return m.undefined;
    case "string":
      return m.string;
    case "number":
      return isNaN(r) ? m.nan : m.number;
    case "boolean":
      return m.boolean;
    case "function":
      return m.function;
    case "bigint":
      return m.bigint;
    case "symbol":
      return m.symbol;
    case "object":
      return Array.isArray(r) ? m.array : r === null ? m.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? m.promise : typeof Map < "u" && r instanceof Map ? m.map : typeof Set < "u" && r instanceof Set ? m.set : typeof Date < "u" && r instanceof Date ? m.date : m.object;
    default:
      return m.unknown;
  }
}, f = S.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), xn = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class q extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(i) {
      return i.message;
    }, s = { _errors: [] }, n = (i) => {
      for (const a of i.issues)
        if (a.code === "invalid_union")
          a.unionErrors.map(n);
        else if (a.code === "invalid_return_type")
          n(a.returnTypeError);
        else if (a.code === "invalid_arguments")
          n(a.argumentsError);
        else if (a.path.length === 0)
          s._errors.push(t(a));
        else {
          let o = s, u = 0;
          for (; u < a.path.length; ) {
            const c = a.path[u];
            u === a.path.length - 1 ? (o[c] = o[c] || { _errors: [] }, o[c]._errors.push(t(a))) : o[c] = o[c] || { _errors: [] }, o = o[c], u++;
          }
        }
    };
    return n(this), s;
  }
  static assert(e) {
    if (!(e instanceof q))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, S.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const n of this.issues)
      n.path.length > 0 ? (t[n.path[0]] = t[n.path[0]] || [], t[n.path[0]].push(e(n))) : s.push(e(n));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
q.create = (r) => new q(r);
const ke = (r, e) => {
  let t;
  switch (r.code) {
    case f.invalid_type:
      r.received === m.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case f.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, S.jsonStringifyReplacer)}`;
      break;
    case f.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${S.joinValues(r.keys, ", ")}`;
      break;
    case f.invalid_union:
      t = "Invalid input";
      break;
    case f.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${S.joinValues(r.options)}`;
      break;
    case f.invalid_enum_value:
      t = `Invalid enum value. Expected ${S.joinValues(r.options)}, received '${r.received}'`;
      break;
    case f.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case f.invalid_return_type:
      t = "Invalid function return type";
      break;
    case f.invalid_date:
      t = "Invalid date";
      break;
    case f.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : S.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case f.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case f.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case f.custom:
      t = "Invalid input";
      break;
    case f.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case f.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case f.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, S.assertNever(r);
  }
  return { message: t };
};
let Or = ke;
function En(r) {
  Or = r;
}
function it() {
  return Or;
}
const at = (r) => {
  const { data: e, path: t, errorMaps: s, issueData: n } = r, i = [...t, ...n.path || []], a = {
    ...n,
    path: i
  };
  if (n.message !== void 0)
    return {
      ...n,
      path: i,
      message: n.message
    };
  let o = "";
  const u = s.filter((c) => !!c).slice().reverse();
  for (const c of u)
    o = c(a, { data: e, defaultError: o }).message;
  return {
    ...n,
    path: i,
    message: o
  };
}, Tn = [];
function h(r, e) {
  const t = it(), s = at({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      // contextual error map is first priority
      r.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === ke ? void 0 : ke
      // then global default map
    ].filter((n) => !!n)
  });
  r.common.issues.push(s);
}
class U {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const s = [];
    for (const n of t) {
      if (n.status === "aborted")
        return w;
      n.status === "dirty" && e.dirty(), s.push(n.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const n of t) {
      const i = await n.key, a = await n.value;
      s.push({
        key: i,
        value: a
      });
    }
    return U.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const n of t) {
      const { key: i, value: a } = n;
      if (i.status === "aborted" || a.status === "aborted")
        return w;
      i.status === "dirty" && e.dirty(), a.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof a.value < "u" || n.alwaysSet) && (s[i.value] = a.value);
    }
    return { status: e.value, value: s };
  }
}
const w = Object.freeze({
  status: "aborted"
}), xe = (r) => ({ status: "dirty", value: r }), M = (r) => ({ status: "valid", value: r }), Nt = (r) => r.status === "aborted", It = (r) => r.status === "dirty", _e = (r) => r.status === "valid", De = (r) => typeof Promise < "u" && r instanceof Promise;
function ot(r, e, t, s) {
  if (typeof e == "function" ? r !== e || !0 : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function Nr(r, e, t, s, n) {
  if (typeof e == "function" ? r !== e || !0 : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var y;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(y || (y = {}));
var Ne, Ie;
class Q {
  constructor(e, t, s, n) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const er = (r, e) => {
  if (_e(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new q(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function E(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: n } = r;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (a, o) => {
    var u, c;
    const { message: d } = r;
    return a.code === "invalid_enum_value" ? { message: d ?? o.defaultError } : typeof o.data > "u" ? { message: (u = d ?? s) !== null && u !== void 0 ? u : o.defaultError } : a.code !== "invalid_type" ? { message: o.defaultError } : { message: (c = d ?? t) !== null && c !== void 0 ? c : o.defaultError };
  }, description: n };
}
class k {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return te(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: te(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new U(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: te(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (De(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    var s;
    const n = {
      common: {
        issues: [],
        async: (s = t == null ? void 0 : t.async) !== null && s !== void 0 ? s : !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: te(e)
    }, i = this._parseSync({ data: e, path: n.path, parent: n });
    return er(n, i);
  }
  "~validate"(e) {
    var t, s;
    const n = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: te(e)
    };
    if (!this["~standard"].async)
      try {
        const i = this._parseSync({ data: e, path: [], parent: n });
        return _e(i) ? {
          value: i.value
        } : {
          issues: n.common.issues
        };
      } catch (i) {
        !((s = (t = i == null ? void 0 : i.message) === null || t === void 0 ? void 0 : t.toLowerCase()) === null || s === void 0) && s.includes("encountered") && (this["~standard"].async = !0), n.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: n }).then((i) => _e(i) ? {
      value: i.value
    } : {
      issues: n.common.issues
    });
  }
  async parseAsync(e, t) {
    const s = await this.safeParseAsync(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: te(e)
    }, n = this._parse({ data: e, path: s.path, parent: s }), i = await (De(n) ? n : Promise.resolve(n));
    return er(s, i);
  }
  refine(e, t) {
    const s = (n) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(n) : t;
    return this._refinement((n, i) => {
      const a = e(n), o = () => i.addIssue({
        code: f.custom,
        ...s(n)
      });
      return typeof Promise < "u" && a instanceof Promise ? a.then((u) => u ? !0 : (o(), !1)) : a ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, n) => e(s) ? !0 : (n.addIssue(typeof t == "function" ? t(s, n) : t), !1));
  }
  _refinement(e) {
    return new H({
      schema: this,
      typeName: v.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return K.create(this, this._def);
  }
  nullable() {
    return le.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return V.create(this);
  }
  promise() {
    return Ae.create(this, this._def);
  }
  or(e) {
    return Fe.create([this, e], this._def);
  }
  and(e) {
    return Ze.create(this, e, this._def);
  }
  transform(e) {
    return new H({
      ...E(this._def),
      schema: this,
      typeName: v.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Ve({
      ...E(this._def),
      innerType: this,
      defaultValue: t,
      typeName: v.ZodDefault
    });
  }
  brand() {
    return new Mt({
      typeName: v.ZodBranded,
      type: this,
      ...E(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new He({
      ...E(this._def),
      innerType: this,
      catchValue: t,
      typeName: v.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Qe.create(this, e);
  }
  readonly() {
    return We.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const kn = /^c[^\s-]{8,}$/i, Sn = /^[0-9a-z]+$/, An = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Rn = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Cn = /^[a-z0-9_-]{21}$/i, On = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Nn = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, In = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Pn = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let xt;
const jn = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Ln = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Dn = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Bn = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Un = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Mn = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ir = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Fn = new RegExp(`^${Ir}$`);
function Pr(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function Zn(r) {
  return new RegExp(`^${Pr(r)}$`);
}
function jr(r) {
  let e = `${Ir}T${Pr(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function $n(r, e) {
  return !!((e === "v4" || !e) && jn.test(r) || (e === "v6" || !e) && Dn.test(r));
}
function zn(r, e) {
  if (!On.test(r))
    return !1;
  try {
    const [t] = r.split("."), s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n = JSON.parse(atob(s));
    return !(typeof n != "object" || n === null || !n.typ || !n.alg || e && n.alg !== e);
  } catch {
    return !1;
  }
}
function qn(r, e) {
  return !!((e === "v4" || !e) && Ln.test(r) || (e === "v6" || !e) && Bn.test(r));
}
class J extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== m.string) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: m.string,
        received: i.parsedType
      }), w;
    }
    const s = new U();
    let n;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (n = this._getOrReturnCtx(e, n), h(n, {
          code: f.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), s.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (n = this._getOrReturnCtx(e, n), h(n, {
          code: f.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), s.dirty());
      else if (i.kind === "length") {
        const a = e.data.length > i.value, o = e.data.length < i.value;
        (a || o) && (n = this._getOrReturnCtx(e, n), a ? h(n, {
          code: f.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : o && h(n, {
          code: f.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), s.dirty());
      } else if (i.kind === "email")
        In.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "email",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "emoji")
        xt || (xt = new RegExp(Pn, "u")), xt.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "emoji",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "uuid")
        Rn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "uuid",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "nanoid")
        Cn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "nanoid",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "cuid")
        kn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "cuid",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "cuid2")
        Sn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "cuid2",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "ulid")
        An.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "ulid",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          n = this._getOrReturnCtx(e, n), h(n, {
            validation: "url",
            code: f.invalid_string,
            message: i.message
          }), s.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "regex",
        code: f.invalid_string,
        message: i.message
      }), s.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), s.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), s.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), s.dirty()) : i.kind === "datetime" ? jr(i).test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: "datetime",
        message: i.message
      }), s.dirty()) : i.kind === "date" ? Fn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: "date",
        message: i.message
      }), s.dirty()) : i.kind === "time" ? Zn(i).test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: "time",
        message: i.message
      }), s.dirty()) : i.kind === "duration" ? Nn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "duration",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "ip" ? $n(e.data, i.version) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "ip",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "jwt" ? zn(e.data, i.alg) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "jwt",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "cidr" ? qn(e.data, i.version) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "cidr",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "base64" ? Un.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "base64",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "base64url" ? Mn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "base64url",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : S.assertNever(i);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((n) => e.test(n), {
      validation: t,
      code: f.invalid_string,
      ...y.errToObj(s)
    });
  }
  _addCheck(e) {
    return new J({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...y.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...y.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...y.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...y.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...y.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...y.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...y.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...y.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...y.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...y.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...y.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...y.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...y.errToObj(e) });
  }
  datetime(e) {
    var t, s;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (t = e == null ? void 0 : e.offset) !== null && t !== void 0 ? t : !1,
      local: (s = e == null ? void 0 : e.local) !== null && s !== void 0 ? s : !1,
      ...y.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...y.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...y.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...y.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...y.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...y.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...y.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...y.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...y.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...y.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, y.errToObj(e));
  }
  trim() {
    return new J({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new J({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new J({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
J.create = (r) => {
  var e;
  return new J({
    checks: [],
    typeName: v.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...E(r)
  });
};
function Jn(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, n = t > s ? t : s, i = parseInt(r.toFixed(n).replace(".", "")), a = parseInt(e.toFixed(n).replace(".", ""));
  return i % a / Math.pow(10, n);
}
class oe extends k {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== m.number) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: m.number,
        received: i.parsedType
      }), w;
    }
    let s;
    const n = new U();
    for (const i of this._def.checks)
      i.kind === "int" ? S.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), n.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), n.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), n.dirty()) : i.kind === "multipleOf" ? Jn(e.data, i.value) !== 0 && (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), n.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.not_finite,
        message: i.message
      }), n.dirty()) : S.assertNever(i);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, y.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, y.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, y.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, y.toString(t));
  }
  setLimit(e, t, s, n) {
    return new oe({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: y.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new oe({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: y.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: y.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: y.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: y.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: y.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: y.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: y.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: y.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: y.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && S.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
oe.create = (r) => new oe({
  checks: [],
  typeName: v.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...E(r)
});
class ce extends k {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== m.bigint)
      return this._getInvalidInput(e);
    let s;
    const n = new U();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), n.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), n.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), n.dirty()) : S.assertNever(i);
    return { status: n.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return h(t, {
      code: f.invalid_type,
      expected: m.bigint,
      received: t.parsedType
    }), w;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, y.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, y.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, y.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, y.toString(t));
  }
  setLimit(e, t, s, n) {
    return new ce({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: y.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ce({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: y.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: y.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: y.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: y.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: y.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
ce.create = (r) => {
  var e;
  return new ce({
    checks: [],
    typeName: v.ZodBigInt,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...E(r)
  });
};
class Be extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== m.boolean) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.boolean,
        received: s.parsedType
      }), w;
    }
    return M(e.data);
  }
}
Be.create = (r) => new Be({
  typeName: v.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...E(r)
});
class be extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== m.date) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: m.date,
        received: i.parsedType
      }), w;
    }
    if (isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_date
      }), w;
    }
    const s = new U();
    let n;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), s.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), s.dirty()) : S.assertNever(i);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new be({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: y.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: y.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
be.create = (r) => new be({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: v.ZodDate,
  ...E(r)
});
class ct extends k {
  _parse(e) {
    if (this._getType(e) !== m.symbol) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.symbol,
        received: s.parsedType
      }), w;
    }
    return M(e.data);
  }
}
ct.create = (r) => new ct({
  typeName: v.ZodSymbol,
  ...E(r)
});
class Ue extends k {
  _parse(e) {
    if (this._getType(e) !== m.undefined) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.undefined,
        received: s.parsedType
      }), w;
    }
    return M(e.data);
  }
}
Ue.create = (r) => new Ue({
  typeName: v.ZodUndefined,
  ...E(r)
});
class Me extends k {
  _parse(e) {
    if (this._getType(e) !== m.null) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.null,
        received: s.parsedType
      }), w;
    }
    return M(e.data);
  }
}
Me.create = (r) => new Me({
  typeName: v.ZodNull,
  ...E(r)
});
class Se extends k {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return M(e.data);
  }
}
Se.create = (r) => new Se({
  typeName: v.ZodAny,
  ...E(r)
});
class ye extends k {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return M(e.data);
  }
}
ye.create = (r) => new ye({
  typeName: v.ZodUnknown,
  ...E(r)
});
class se extends k {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return h(t, {
      code: f.invalid_type,
      expected: m.never,
      received: t.parsedType
    }), w;
  }
}
se.create = (r) => new se({
  typeName: v.ZodNever,
  ...E(r)
});
class ut extends k {
  _parse(e) {
    if (this._getType(e) !== m.undefined) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.void,
        received: s.parsedType
      }), w;
    }
    return M(e.data);
  }
}
ut.create = (r) => new ut({
  typeName: v.ZodVoid,
  ...E(r)
});
class V extends k {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== m.array)
      return h(t, {
        code: f.invalid_type,
        expected: m.array,
        received: t.parsedType
      }), w;
    if (n.exactLength !== null) {
      const a = t.data.length > n.exactLength.value, o = t.data.length < n.exactLength.value;
      (a || o) && (h(t, {
        code: a ? f.too_big : f.too_small,
        minimum: o ? n.exactLength.value : void 0,
        maximum: a ? n.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: n.exactLength.message
      }), s.dirty());
    }
    if (n.minLength !== null && t.data.length < n.minLength.value && (h(t, {
      code: f.too_small,
      minimum: n.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.minLength.message
    }), s.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (h(t, {
      code: f.too_big,
      maximum: n.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((a, o) => n.type._parseAsync(new Q(t, a, t.path, o)))).then((a) => U.mergeArray(s, a));
    const i = [...t.data].map((a, o) => n.type._parseSync(new Q(t, a, t.path, o)));
    return U.mergeArray(s, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new V({
      ...this._def,
      minLength: { value: e, message: y.toString(t) }
    });
  }
  max(e, t) {
    return new V({
      ...this._def,
      maxLength: { value: e, message: y.toString(t) }
    });
  }
  length(e, t) {
    return new V({
      ...this._def,
      exactLength: { value: e, message: y.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
V.create = (r, e) => new V({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: v.ZodArray,
  ...E(e)
});
function we(r) {
  if (r instanceof O) {
    const e = {};
    for (const t in r.shape) {
      const s = r.shape[t];
      e[t] = K.create(we(s));
    }
    return new O({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof V ? new V({
    ...r._def,
    type: we(r.element)
  }) : r instanceof K ? K.create(we(r.unwrap())) : r instanceof le ? le.create(we(r.unwrap())) : r instanceof X ? X.create(r.items.map((e) => we(e))) : r;
}
class O extends k {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = S.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== m.object) {
      const c = this._getOrReturnCtx(e);
      return h(c, {
        code: f.invalid_type,
        expected: m.object,
        received: c.parsedType
      }), w;
    }
    const { status: s, ctx: n } = this._processInputParams(e), { shape: i, keys: a } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof se && this._def.unknownKeys === "strip"))
      for (const c in n.data)
        a.includes(c) || o.push(c);
    const u = [];
    for (const c of a) {
      const d = i[c], p = n.data[c];
      u.push({
        key: { status: "valid", value: c },
        value: d._parse(new Q(n, p, n.path, c)),
        alwaysSet: c in n.data
      });
    }
    if (this._def.catchall instanceof se) {
      const c = this._def.unknownKeys;
      if (c === "passthrough")
        for (const d of o)
          u.push({
            key: { status: "valid", value: d },
            value: { status: "valid", value: n.data[d] }
          });
      else if (c === "strict")
        o.length > 0 && (h(n, {
          code: f.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const d of o) {
        const p = n.data[d];
        u.push({
          key: { status: "valid", value: d },
          value: c._parse(
            new Q(n, p, n.path, d)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: d in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
      const c = [];
      for (const d of u) {
        const p = await d.key, A = await d.value;
        c.push({
          key: p,
          value: A,
          alwaysSet: d.alwaysSet
        });
      }
      return c;
    }).then((c) => U.mergeObjectSync(s, c)) : U.mergeObjectSync(s, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return y.errToObj, new O({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var n, i, a, o;
          const u = (a = (i = (n = this._def).errorMap) === null || i === void 0 ? void 0 : i.call(n, t, s).message) !== null && a !== void 0 ? a : s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (o = y.errToObj(e).message) !== null && o !== void 0 ? o : u
          } : {
            message: u
          };
        }
      } : {}
    });
  }
  strip() {
    return new O({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new O({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new O({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new O({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: v.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new O({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return S.objectKeys(e).forEach((s) => {
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    }), new O({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return S.objectKeys(this.shape).forEach((s) => {
      e[s] || (t[s] = this.shape[s]);
    }), new O({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return we(this);
  }
  partial(e) {
    const t = {};
    return S.objectKeys(this.shape).forEach((s) => {
      const n = this.shape[s];
      e && !e[s] ? t[s] = n : t[s] = n.optional();
    }), new O({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return S.objectKeys(this.shape).forEach((s) => {
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let i = this.shape[s];
        for (; i instanceof K; )
          i = i._def.innerType;
        t[s] = i;
      }
    }), new O({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Lr(S.objectKeys(this.shape));
  }
}
O.create = (r, e) => new O({
  shape: () => r,
  unknownKeys: "strip",
  catchall: se.create(),
  typeName: v.ZodObject,
  ...E(e)
});
O.strictCreate = (r, e) => new O({
  shape: () => r,
  unknownKeys: "strict",
  catchall: se.create(),
  typeName: v.ZodObject,
  ...E(e)
});
O.lazycreate = (r, e) => new O({
  shape: r,
  unknownKeys: "strip",
  catchall: se.create(),
  typeName: v.ZodObject,
  ...E(e)
});
class Fe extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function n(i) {
      for (const o of i)
        if (o.result.status === "valid")
          return o.result;
      for (const o of i)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const a = i.map((o) => new q(o.ctx.common.issues));
      return h(t, {
        code: f.invalid_union,
        unionErrors: a
      }), w;
    }
    if (t.common.async)
      return Promise.all(s.map(async (i) => {
        const a = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: t.data,
            path: t.path,
            parent: a
          }),
          ctx: a
        };
      })).then(n);
    {
      let i;
      const a = [];
      for (const u of s) {
        const c = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, d = u._parseSync({
          data: t.data,
          path: t.path,
          parent: c
        });
        if (d.status === "valid")
          return d;
        d.status === "dirty" && !i && (i = { result: d, ctx: c }), c.common.issues.length && a.push(c.common.issues);
      }
      if (i)
        return t.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map((u) => new q(u));
      return h(t, {
        code: f.invalid_union,
        unionErrors: o
      }), w;
    }
  }
  get options() {
    return this._def.options;
  }
}
Fe.create = (r, e) => new Fe({
  options: r,
  typeName: v.ZodUnion,
  ...E(e)
});
const ee = (r) => r instanceof ze ? ee(r.schema) : r instanceof H ? ee(r.innerType()) : r instanceof qe ? [r.value] : r instanceof ue ? r.options : r instanceof Je ? S.objectValues(r.enum) : r instanceof Ve ? ee(r._def.innerType) : r instanceof Ue ? [void 0] : r instanceof Me ? [null] : r instanceof K ? [void 0, ...ee(r.unwrap())] : r instanceof le ? [null, ...ee(r.unwrap())] : r instanceof Mt || r instanceof We ? ee(r.unwrap()) : r instanceof He ? ee(r._def.innerType) : [];
class _t extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== m.object)
      return h(t, {
        code: f.invalid_type,
        expected: m.object,
        received: t.parsedType
      }), w;
    const s = this.discriminator, n = t.data[s], i = this.optionsMap.get(n);
    return i ? t.common.async ? i._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : i._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (h(t, {
      code: f.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [s]
    }), w);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, s) {
    const n = /* @__PURE__ */ new Map();
    for (const i of t) {
      const a = ee(i.shape[e]);
      if (!a.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of a) {
        if (n.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        n.set(o, i);
      }
    }
    return new _t({
      typeName: v.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: n,
      ...E(s)
    });
  }
}
function Pt(r, e) {
  const t = te(r), s = te(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === m.object && s === m.object) {
    const n = S.objectKeys(e), i = S.objectKeys(r).filter((o) => n.indexOf(o) !== -1), a = { ...r, ...e };
    for (const o of i) {
      const u = Pt(r[o], e[o]);
      if (!u.valid)
        return { valid: !1 };
      a[o] = u.data;
    }
    return { valid: !0, data: a };
  } else if (t === m.array && s === m.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const n = [];
    for (let i = 0; i < r.length; i++) {
      const a = r[i], o = e[i], u = Pt(a, o);
      if (!u.valid)
        return { valid: !1 };
      n.push(u.data);
    }
    return { valid: !0, data: n };
  } else return t === m.date && s === m.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class Ze extends k {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = (i, a) => {
      if (Nt(i) || Nt(a))
        return w;
      const o = Pt(i.value, a.value);
      return o.valid ? ((It(i) || It(a)) && t.dirty(), { status: t.value, value: o.data }) : (h(s, {
        code: f.invalid_intersection_types
      }), w);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([i, a]) => n(i, a)) : n(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
Ze.create = (r, e, t) => new Ze({
  left: r,
  right: e,
  typeName: v.ZodIntersection,
  ...E(t)
});
class X extends k {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== m.array)
      return h(s, {
        code: f.invalid_type,
        expected: m.array,
        received: s.parsedType
      }), w;
    if (s.data.length < this._def.items.length)
      return h(s, {
        code: f.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), w;
    !this._def.rest && s.data.length > this._def.items.length && (h(s, {
      code: f.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const i = [...s.data].map((a, o) => {
      const u = this._def.items[o] || this._def.rest;
      return u ? u._parse(new Q(s, a, s.path, o)) : null;
    }).filter((a) => !!a);
    return s.common.async ? Promise.all(i).then((a) => U.mergeArray(t, a)) : U.mergeArray(t, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new X({
      ...this._def,
      rest: e
    });
  }
}
X.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new X({
    items: r,
    typeName: v.ZodTuple,
    rest: null,
    ...E(e)
  });
};
class $e extends k {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== m.object)
      return h(s, {
        code: f.invalid_type,
        expected: m.object,
        received: s.parsedType
      }), w;
    const n = [], i = this._def.keyType, a = this._def.valueType;
    for (const o in s.data)
      n.push({
        key: i._parse(new Q(s, o, s.path, o)),
        value: a._parse(new Q(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? U.mergeObjectAsync(t, n) : U.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof k ? new $e({
      keyType: e,
      valueType: t,
      typeName: v.ZodRecord,
      ...E(s)
    }) : new $e({
      keyType: J.create(),
      valueType: e,
      typeName: v.ZodRecord,
      ...E(t)
    });
  }
}
class lt extends k {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== m.map)
      return h(s, {
        code: f.invalid_type,
        expected: m.map,
        received: s.parsedType
      }), w;
    const n = this._def.keyType, i = this._def.valueType, a = [...s.data.entries()].map(([o, u], c) => ({
      key: n._parse(new Q(s, o, s.path, [c, "key"])),
      value: i._parse(new Q(s, u, s.path, [c, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of a) {
          const c = await u.key, d = await u.value;
          if (c.status === "aborted" || d.status === "aborted")
            return w;
          (c.status === "dirty" || d.status === "dirty") && t.dirty(), o.set(c.value, d.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const u of a) {
        const c = u.key, d = u.value;
        if (c.status === "aborted" || d.status === "aborted")
          return w;
        (c.status === "dirty" || d.status === "dirty") && t.dirty(), o.set(c.value, d.value);
      }
      return { status: t.value, value: o };
    }
  }
}
lt.create = (r, e, t) => new lt({
  valueType: e,
  keyType: r,
  typeName: v.ZodMap,
  ...E(t)
});
class ve extends k {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== m.set)
      return h(s, {
        code: f.invalid_type,
        expected: m.set,
        received: s.parsedType
      }), w;
    const n = this._def;
    n.minSize !== null && s.data.size < n.minSize.value && (h(s, {
      code: f.too_small,
      minimum: n.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.minSize.message
    }), t.dirty()), n.maxSize !== null && s.data.size > n.maxSize.value && (h(s, {
      code: f.too_big,
      maximum: n.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.maxSize.message
    }), t.dirty());
    const i = this._def.valueType;
    function a(u) {
      const c = /* @__PURE__ */ new Set();
      for (const d of u) {
        if (d.status === "aborted")
          return w;
        d.status === "dirty" && t.dirty(), c.add(d.value);
      }
      return { status: t.value, value: c };
    }
    const o = [...s.data.values()].map((u, c) => i._parse(new Q(s, u, s.path, c)));
    return s.common.async ? Promise.all(o).then((u) => a(u)) : a(o);
  }
  min(e, t) {
    return new ve({
      ...this._def,
      minSize: { value: e, message: y.toString(t) }
    });
  }
  max(e, t) {
    return new ve({
      ...this._def,
      maxSize: { value: e, message: y.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ve.create = (r, e) => new ve({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: v.ZodSet,
  ...E(e)
});
class Te extends k {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== m.function)
      return h(t, {
        code: f.invalid_type,
        expected: m.function,
        received: t.parsedType
      }), w;
    function s(o, u) {
      return at({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          it(),
          ke
        ].filter((c) => !!c),
        issueData: {
          code: f.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function n(o, u) {
      return at({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          it(),
          ke
        ].filter((c) => !!c),
        issueData: {
          code: f.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const i = { errorMap: t.common.contextualErrorMap }, a = t.data;
    if (this._def.returns instanceof Ae) {
      const o = this;
      return M(async function(...u) {
        const c = new q([]), d = await o._def.args.parseAsync(u, i).catch((C) => {
          throw c.addIssue(s(u, C)), c;
        }), p = await Reflect.apply(a, this, d);
        return await o._def.returns._def.type.parseAsync(p, i).catch((C) => {
          throw c.addIssue(n(p, C)), c;
        });
      });
    } else {
      const o = this;
      return M(function(...u) {
        const c = o._def.args.safeParse(u, i);
        if (!c.success)
          throw new q([s(u, c.error)]);
        const d = Reflect.apply(a, this, c.data), p = o._def.returns.safeParse(d, i);
        if (!p.success)
          throw new q([n(d, p.error)]);
        return p.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new Te({
      ...this._def,
      args: X.create(e).rest(ye.create())
    });
  }
  returns(e) {
    return new Te({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, s) {
    return new Te({
      args: e || X.create([]).rest(ye.create()),
      returns: t || ye.create(),
      typeName: v.ZodFunction,
      ...E(s)
    });
  }
}
class ze extends k {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
ze.create = (r, e) => new ze({
  getter: r,
  typeName: v.ZodLazy,
  ...E(e)
});
class qe extends k {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return h(t, {
        received: t.data,
        code: f.invalid_literal,
        expected: this._def.value
      }), w;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
qe.create = (r, e) => new qe({
  value: r,
  typeName: v.ZodLiteral,
  ...E(e)
});
function Lr(r, e) {
  return new ue({
    values: r,
    typeName: v.ZodEnum,
    ...E(e)
  });
}
class ue extends k {
  constructor() {
    super(...arguments), Ne.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return h(t, {
        expected: S.joinValues(s),
        received: t.parsedType,
        code: f.invalid_type
      }), w;
    }
    if (ot(this, Ne) || Nr(this, Ne, new Set(this._def.values)), !ot(this, Ne).has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return h(t, {
        received: t.data,
        code: f.invalid_enum_value,
        options: s
      }), w;
    }
    return M(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return ue.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return ue.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
Ne = /* @__PURE__ */ new WeakMap();
ue.create = Lr;
class Je extends k {
  constructor() {
    super(...arguments), Ie.set(this, void 0);
  }
  _parse(e) {
    const t = S.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== m.string && s.parsedType !== m.number) {
      const n = S.objectValues(t);
      return h(s, {
        expected: S.joinValues(n),
        received: s.parsedType,
        code: f.invalid_type
      }), w;
    }
    if (ot(this, Ie) || Nr(this, Ie, new Set(S.getValidEnumValues(this._def.values))), !ot(this, Ie).has(e.data)) {
      const n = S.objectValues(t);
      return h(s, {
        received: s.data,
        code: f.invalid_enum_value,
        options: n
      }), w;
    }
    return M(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ie = /* @__PURE__ */ new WeakMap();
Je.create = (r, e) => new Je({
  values: r,
  typeName: v.ZodNativeEnum,
  ...E(e)
});
class Ae extends k {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== m.promise && t.common.async === !1)
      return h(t, {
        code: f.invalid_type,
        expected: m.promise,
        received: t.parsedType
      }), w;
    const s = t.parsedType === m.promise ? t.data : Promise.resolve(t.data);
    return M(s.then((n) => this._def.type.parseAsync(n, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Ae.create = (r, e) => new Ae({
  type: r,
  typeName: v.ZodPromise,
  ...E(e)
});
class H extends k {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === v.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = this._def.effect || null, i = {
      addIssue: (a) => {
        h(s, a), a.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), n.type === "preprocess") {
      const a = n.transform(s.data, i);
      if (s.common.async)
        return Promise.resolve(a).then(async (o) => {
          if (t.value === "aborted")
            return w;
          const u = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return u.status === "aborted" ? w : u.status === "dirty" || t.value === "dirty" ? xe(u.value) : u;
        });
      {
        if (t.value === "aborted")
          return w;
        const o = this._def.schema._parseSync({
          data: a,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? w : o.status === "dirty" || t.value === "dirty" ? xe(o.value) : o;
      }
    }
    if (n.type === "refinement") {
      const a = (o) => {
        const u = n.refinement(o, i);
        if (s.common.async)
          return Promise.resolve(u);
        if (u instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? w : (o.status === "dirty" && t.dirty(), a(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? w : (o.status === "dirty" && t.dirty(), a(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (n.type === "transform")
      if (s.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!_e(a))
          return a;
        const o = n.transform(a.value, i);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((a) => _e(a) ? Promise.resolve(n.transform(a.value, i)).then((o) => ({ status: t.value, value: o })) : a);
    S.assertNever(n);
  }
}
H.create = (r, e, t) => new H({
  schema: r,
  typeName: v.ZodEffects,
  effect: e,
  ...E(t)
});
H.createWithPreprocess = (r, e, t) => new H({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: v.ZodEffects,
  ...E(t)
});
class K extends k {
  _parse(e) {
    return this._getType(e) === m.undefined ? M(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
K.create = (r, e) => new K({
  innerType: r,
  typeName: v.ZodOptional,
  ...E(e)
});
class le extends k {
  _parse(e) {
    return this._getType(e) === m.null ? M(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
le.create = (r, e) => new le({
  innerType: r,
  typeName: v.ZodNullable,
  ...E(e)
});
class Ve extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === m.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Ve.create = (r, e) => new Ve({
  innerType: r,
  typeName: v.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...E(e)
});
class He extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, n = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: {
        ...s
      }
    });
    return De(n) ? n.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new q(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new q(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
He.create = (r, e) => new He({
  innerType: r,
  typeName: v.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...E(e)
});
class dt extends k {
  _parse(e) {
    if (this._getType(e) !== m.nan) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.nan,
        received: s.parsedType
      }), w;
    }
    return { status: "valid", value: e.data };
  }
}
dt.create = (r) => new dt({
  typeName: v.ZodNaN,
  ...E(r)
});
const Vn = Symbol("zod_brand");
class Mt extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Qe extends k {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return i.status === "aborted" ? w : i.status === "dirty" ? (t.dirty(), xe(i.value)) : this._def.out._parseAsync({
          data: i.value,
          path: s.path,
          parent: s
        });
      })();
    {
      const n = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return n.status === "aborted" ? w : n.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: n.value
      }) : this._def.out._parseSync({
        data: n.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new Qe({
      in: e,
      out: t,
      typeName: v.ZodPipeline
    });
  }
}
class We extends k {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (n) => (_e(n) && (n.value = Object.freeze(n.value)), n);
    return De(t) ? t.then((n) => s(n)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
We.create = (r, e) => new We({
  innerType: r,
  typeName: v.ZodReadonly,
  ...E(e)
});
function tr(r, e) {
  const t = typeof r == "function" ? r(e) : typeof r == "string" ? { message: r } : r;
  return typeof t == "string" ? { message: t } : t;
}
function Dr(r, e = {}, t) {
  return r ? Se.create().superRefine((s, n) => {
    var i, a;
    const o = r(s);
    if (o instanceof Promise)
      return o.then((u) => {
        var c, d;
        if (!u) {
          const p = tr(e, s), A = (d = (c = p.fatal) !== null && c !== void 0 ? c : t) !== null && d !== void 0 ? d : !0;
          n.addIssue({ code: "custom", ...p, fatal: A });
        }
      });
    if (!o) {
      const u = tr(e, s), c = (a = (i = u.fatal) !== null && i !== void 0 ? i : t) !== null && a !== void 0 ? a : !0;
      n.addIssue({ code: "custom", ...u, fatal: c });
    }
  }) : Se.create();
}
const Hn = {
  object: O.lazycreate
};
var v;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(v || (v = {}));
const Wn = (r, e = {
  message: `Input not instance of ${r.name}`
}) => Dr((t) => t instanceof r, e), Br = J.create, Ur = oe.create, Gn = dt.create, Kn = ce.create, Mr = Be.create, Qn = be.create, Xn = ct.create, Yn = Ue.create, ei = Me.create, ti = Se.create, ri = ye.create, si = se.create, ni = ut.create, ii = V.create, ai = O.create, oi = O.strictCreate, ci = Fe.create, ui = _t.create, li = Ze.create, di = X.create, fi = $e.create, hi = lt.create, pi = ve.create, mi = Te.create, yi = ze.create, gi = qe.create, _i = ue.create, bi = Je.create, vi = Ae.create, rr = H.create, wi = K.create, xi = le.create, Ei = H.createWithPreprocess, Ti = Qe.create, ki = () => Br().optional(), Si = () => Ur().optional(), Ai = () => Mr().optional(), Ri = {
  string: (r) => J.create({ ...r, coerce: !0 }),
  number: (r) => oe.create({ ...r, coerce: !0 }),
  boolean: (r) => Be.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => ce.create({ ...r, coerce: !0 }),
  date: (r) => be.create({ ...r, coerce: !0 })
}, Ci = w;
var D = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: ke,
  setErrorMap: En,
  getErrorMap: it,
  makeIssue: at,
  EMPTY_PATH: Tn,
  addIssueToContext: h,
  ParseStatus: U,
  INVALID: w,
  DIRTY: xe,
  OK: M,
  isAborted: Nt,
  isDirty: It,
  isValid: _e,
  isAsync: De,
  get util() {
    return S;
  },
  get objectUtil() {
    return Ot;
  },
  ZodParsedType: m,
  getParsedType: te,
  ZodType: k,
  datetimeRegex: jr,
  ZodString: J,
  ZodNumber: oe,
  ZodBigInt: ce,
  ZodBoolean: Be,
  ZodDate: be,
  ZodSymbol: ct,
  ZodUndefined: Ue,
  ZodNull: Me,
  ZodAny: Se,
  ZodUnknown: ye,
  ZodNever: se,
  ZodVoid: ut,
  ZodArray: V,
  ZodObject: O,
  ZodUnion: Fe,
  ZodDiscriminatedUnion: _t,
  ZodIntersection: Ze,
  ZodTuple: X,
  ZodRecord: $e,
  ZodMap: lt,
  ZodSet: ve,
  ZodFunction: Te,
  ZodLazy: ze,
  ZodLiteral: qe,
  ZodEnum: ue,
  ZodNativeEnum: Je,
  ZodPromise: Ae,
  ZodEffects: H,
  ZodTransformer: H,
  ZodOptional: K,
  ZodNullable: le,
  ZodDefault: Ve,
  ZodCatch: He,
  ZodNaN: dt,
  BRAND: Vn,
  ZodBranded: Mt,
  ZodPipeline: Qe,
  ZodReadonly: We,
  custom: Dr,
  Schema: k,
  ZodSchema: k,
  late: Hn,
  get ZodFirstPartyTypeKind() {
    return v;
  },
  coerce: Ri,
  any: ti,
  array: ii,
  bigint: Kn,
  boolean: Mr,
  date: Qn,
  discriminatedUnion: ui,
  effect: rr,
  enum: _i,
  function: mi,
  instanceof: Wn,
  intersection: li,
  lazy: yi,
  literal: gi,
  map: hi,
  nan: Gn,
  nativeEnum: bi,
  never: si,
  null: ei,
  nullable: xi,
  number: Ur,
  object: ai,
  oboolean: Ai,
  onumber: Si,
  optional: wi,
  ostring: ki,
  pipeline: Ti,
  preprocess: Ei,
  promise: vi,
  record: fi,
  set: pi,
  strictObject: oi,
  string: Br,
  symbol: Xn,
  transformer: rr,
  tuple: di,
  undefined: Yn,
  union: ci,
  unknown: ri,
  void: ni,
  NEVER: Ci,
  ZodIssueCode: f,
  quotelessJson: xn,
  ZodError: q
});
const sr = D.object({
  prompt: D.string().default(""),
  aspect_ratio: D.string().default("1:1"),
  num_outputs: D.number().int().default(1),
  num_inference_steps: D.number().int().gt(0).lt(5).default(4),
  seed: D.number().int().optional().default(() => Math.floor(Math.random() * 1e6)),
  output_format: D.string().default("jpg"),
  disable_safety_checker: D.boolean().default(!1),
  go_fast: D.boolean().default(!1)
});
class Oi extends Cr {
  constructor() {
    super("flux-schnell");
  }
  /**
   * Register FluxSchnell specific endpoints
   */
  registerEndpoints() {
    this.registerEndpoint({
      path: "text2img",
      method: "POST",
      queryParams: sr.parse({}),
      requiresAuth: !0,
      acceptsFile: !1
    });
  }
  /**
   * Generate an image from a text prompt
   * @param text - Text description of the desired image
   * @param args - Additional arguments (Python *args equivalent)
   * @param kwargs - Additional options (Python **kwargs equivalent)
   * @returns TrackedJob that resolves to the generated image
   */
  text2img(e, t) {
    const s = this.getEndpoint("text2img"), n = sr.parse({
      ...t,
      prompt: e
      // Always use the text parameter as the prompt
    });
    return this.submitTrackedJob(s, n, this.config.apiKey);
  }
}
const nr = D.object({
  prompt: D.string().default(""),
  max_tokens: D.number().int().default(20480),
  temperature: D.number().gt(0).lt(1).default(0.1),
  presence_penalty: D.number().gte(0).lte(1).default(0),
  frequency_penalty: D.number().gte(0).lte(1).default(0),
  top_p: D.number().gte(0).lte(1).default(1)
});
class Ni {
  constructor(e) {
    b(this, "answer");
    b(this, "thoughts");
    Array.isArray(e) && (e = e.join(" "));
    let t = e.indexOf("<think>"), s = e.indexOf("</think>", t + 7);
    this.thoughts = e.substring(t + 7, s), this.answer = e.substring(s + 8);
  }
}
class Ii extends Cr {
  constructor() {
    super("deepseek-r1");
  }
  /**
   * Register FluxSchnell specific endpoints
   */
  registerEndpoints() {
    this.registerEndpoint({
      path: "chat",
      method: "POST",
      queryParams: nr.parse({}),
      requiresAuth: !0,
      acceptsFile: !1
    });
  }
  async _infer(e, t) {
    const s = this.getEndpoint("chat"), n = nr.parse({
      ...t,
      prompt: e
      // Always use the text parameter as the prompt
    });
    let i = await this.submitTrackedJob(s, n, this.config.apiKey);
    return new Ni(i);
  }
  /**
   * Generate a chat response from a text prompt
   * @param prompt - Text prompt for the chat model
   * @param options - Additional options for the request
   * @returns TrackedJob that resolves to the generated response text
   */
  async chat(e, t) {
    return (await this._infer(e, t)).answer;
  }
}
ae.registerClientType("flux-schnell", Oi);
ae.registerClientType("deepseek-r1", Ii);
class Pi {
  constructor(e = {}) {
    re.update(e);
  }
  async text2img(e, t = "flux-schnell", s) {
    return ae.getClient(t).text2img(e, s);
  }
  async chat(e, t = "deepseek-r1", s) {
    return ae.getClient(t).chat(e, s);
  }
  getAvailableModels() {
    return ae.getAvailableClients();
  }
}
class Fr extends Pi {
  constructor(t = {}) {
    super(t);
    b(this, "requestHandler");
    b(this, "jobManager");
    this.requestHandler = new Ut(), this.jobManager = nt.getInstance(this.requestHandler);
  }
  /**
   * Set the API key globally
   */
  setApiKey(t) {
    re.update({ apiKey: t });
  }
  /**
   * Set the base URL globally
   */
  setBaseUrl(t) {
    re.update({ baseUrl: t });
  }
  /**
   * Get a list of all active jobs
   * @returns Array of all tracked jobs
   */
  getJobs() {
    return this.jobManager.getAllJobs();
  }
  /**
   * Get a specific job by ID
   * @param jobId - ID of the job to retrieve
   * @returns The job if found, undefined otherwise
   */
  getJob(t) {
    return this.jobManager.getJob(t);
  }
  /**
   * Cancel a running job
   * @param jobId - ID of the job to cancel
   * @returns Promise resolving to true if successful
   */
  async cancelJob(t) {
    return this.jobManager.cancelJob(t);
  }
}
const Zr = new Fr();
typeof window < "u" && (window.socaity = Zr);
typeof module < "u" && module.exports && (module.exports = Zr, module.exports.SocaitySDK = Fr);
process.on("uncaughtException", (r) => {
  if (r.name === "ApiKeyError")
    console.error(`${r.name}: ${r.message}`), process.exit(1);
  else
    throw r;
});
export {
  ae as APIClientFactory,
  Le as MediaFile,
  Fr as SocaitySDK,
  Zr as socaity
};
//# sourceMappingURL=socaity.es.js.map
