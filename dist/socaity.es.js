var jr = Object.defineProperty;
var Dr = (r, e, t) => e in r ? jr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var w = (r, e, t) => Dr(r, typeof e != "symbol" ? e + "" : e, t);
const ne = class ne {
  constructor(e = {}) {
    w(this, "apiKey");
    w(this, "baseUrl");
    w(this, "pollInterval");
    w(this, "maxRetries");
    this.apiKey = e.apiKey, this.baseUrl = "http://localhost:8000/v0", this.pollInterval = e.pollInterval || 5e3, this.maxRetries = e.maxRetries || 3;
  }
  /**
   * Get the global configuration instance
   */
  static getInstance() {
    return ne.instance || (ne.instance = new ne()), ne.instance;
  }
  /**
   * Updates global configuration with new values
   */
  static update(e) {
    const t = ne.getInstance();
    e.apiKey !== void 0 && (t.apiKey = e.apiKey), e.baseUrl !== void 0 && (t.baseUrl = e.baseUrl), e.pollInterval !== void 0 && (t.pollInterval = e.pollInterval), e.maxRetries !== void 0 && (t.maxRetries = e.maxRetries);
  }
};
w(ne, "instance");
let te = ne;
function er(r, e) {
  return function() {
    return r.apply(e, arguments);
  };
}
const { toString: Lr } = Object.prototype, { getPrototypeOf: Nt } = Object, ut = /* @__PURE__ */ ((r) => (e) => {
  const t = Lr.call(e);
  return r[t] || (r[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), V = (r) => (r = r.toLowerCase(), (e) => ut(e) === r), lt = (r) => (e) => typeof e === r, { isArray: Se } = Array, Ie = lt("undefined");
function Mr(r) {
  return r !== null && !Ie(r) && r.constructor !== null && !Ie(r.constructor) && F(r.constructor.isBuffer) && r.constructor.isBuffer(r);
}
const tr = V("ArrayBuffer");
function Ur(r) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(r) : e = r && r.buffer && tr(r.buffer), e;
}
const Zr = lt("string"), F = lt("function"), rr = lt("number"), dt = (r) => r !== null && typeof r == "object", Br = (r) => r === !0 || r === !1, Ke = (r) => {
  if (ut(r) !== "object")
    return !1;
  const e = Nt(r);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in r) && !(Symbol.iterator in r);
}, Fr = V("Date"), $r = V("File"), zr = V("Blob"), Jr = V("FileList"), qr = (r) => dt(r) && F(r.pipe), Vr = (r) => {
  let e;
  return r && (typeof FormData == "function" && r instanceof FormData || F(r.append) && ((e = ut(r)) === "formdata" || // detect form-data instance
  e === "object" && F(r.toString) && r.toString() === "[object FormData]"));
}, Hr = V("URLSearchParams"), [Gr, Wr, Kr, Qr] = ["ReadableStream", "Request", "Response", "Headers"].map(V), Xr = (r) => r.trim ? r.trim() : r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Ve(r, e, { allOwnKeys: t = !1 } = {}) {
  if (r === null || typeof r > "u")
    return;
  let s, n;
  if (typeof r != "object" && (r = [r]), Se(r))
    for (s = 0, n = r.length; s < n; s++)
      e.call(null, r[s], s, r);
  else {
    const i = t ? Object.getOwnPropertyNames(r) : Object.keys(r), a = i.length;
    let o;
    for (s = 0; s < a; s++)
      o = i[s], e.call(null, r[o], o, r);
  }
}
function sr(r, e) {
  e = e.toLowerCase();
  const t = Object.keys(r);
  let s = t.length, n;
  for (; s-- > 0; )
    if (n = t[s], e === n.toLowerCase())
      return n;
  return null;
}
const fe = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, nr = (r) => !Ie(r) && r !== fe;
function bt() {
  const { caseless: r } = nr(this) && this || {}, e = {}, t = (s, n) => {
    const i = r && sr(e, n) || n;
    Ke(e[i]) && Ke(s) ? e[i] = bt(e[i], s) : Ke(s) ? e[i] = bt({}, s) : Se(s) ? e[i] = s.slice() : e[i] = s;
  };
  for (let s = 0, n = arguments.length; s < n; s++)
    arguments[s] && Ve(arguments[s], t);
  return e;
}
const Yr = (r, e, t, { allOwnKeys: s } = {}) => (Ve(e, (n, i) => {
  t && F(n) ? r[i] = er(n, t) : r[i] = n;
}, { allOwnKeys: s }), r), es = (r) => (r.charCodeAt(0) === 65279 && (r = r.slice(1)), r), ts = (r, e, t, s) => {
  r.prototype = Object.create(e.prototype, s), r.prototype.constructor = r, Object.defineProperty(r, "super", {
    value: e.prototype
  }), t && Object.assign(r.prototype, t);
}, rs = (r, e, t, s) => {
  let n, i, a;
  const o = {};
  if (e = e || {}, r == null) return e;
  do {
    for (n = Object.getOwnPropertyNames(r), i = n.length; i-- > 0; )
      a = n[i], (!s || s(a, r, e)) && !o[a] && (e[a] = r[a], o[a] = !0);
    r = t !== !1 && Nt(r);
  } while (r && (!t || t(r, e)) && r !== Object.prototype);
  return e;
}, ss = (r, e, t) => {
  r = String(r), (t === void 0 || t > r.length) && (t = r.length), t -= e.length;
  const s = r.indexOf(e, t);
  return s !== -1 && s === t;
}, ns = (r) => {
  if (!r) return null;
  if (Se(r)) return r;
  let e = r.length;
  if (!rr(e)) return null;
  const t = new Array(e);
  for (; e-- > 0; )
    t[e] = r[e];
  return t;
}, is = /* @__PURE__ */ ((r) => (e) => r && e instanceof r)(typeof Uint8Array < "u" && Nt(Uint8Array)), as = (r, e) => {
  const s = (r && r[Symbol.iterator]).call(r);
  let n;
  for (; (n = s.next()) && !n.done; ) {
    const i = n.value;
    e.call(r, i[0], i[1]);
  }
}, os = (r, e) => {
  let t;
  const s = [];
  for (; (t = r.exec(e)) !== null; )
    s.push(t);
  return s;
}, cs = V("HTMLFormElement"), us = (r) => r.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(t, s, n) {
    return s.toUpperCase() + n;
  }
), Mt = (({ hasOwnProperty: r }) => (e, t) => r.call(e, t))(Object.prototype), ls = V("RegExp"), ir = (r, e) => {
  const t = Object.getOwnPropertyDescriptors(r), s = {};
  Ve(t, (n, i) => {
    let a;
    (a = e(n, i, r)) !== !1 && (s[i] = a || n);
  }), Object.defineProperties(r, s);
}, ds = (r) => {
  ir(r, (e, t) => {
    if (F(r) && ["arguments", "caller", "callee"].indexOf(t) !== -1)
      return !1;
    const s = r[t];
    if (F(s)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, fs = (r, e) => {
  const t = {}, s = (n) => {
    n.forEach((i) => {
      t[i] = !0;
    });
  };
  return Se(r) ? s(r) : s(String(r).split(e)), t;
}, hs = () => {
}, ps = (r, e) => r != null && Number.isFinite(r = +r) ? r : e;
function ms(r) {
  return !!(r && F(r.append) && r[Symbol.toStringTag] === "FormData" && r[Symbol.iterator]);
}
const gs = (r) => {
  const e = new Array(10), t = (s, n) => {
    if (dt(s)) {
      if (e.indexOf(s) >= 0)
        return;
      if (!("toJSON" in s)) {
        e[n] = s;
        const i = Se(s) ? [] : {};
        return Ve(s, (a, o) => {
          const u = t(a, n + 1);
          !Ie(u) && (i[o] = u);
        }), e[n] = void 0, i;
      }
    }
    return s;
  };
  return t(r, 0);
}, ys = V("AsyncFunction"), _s = (r) => r && (dt(r) || F(r)) && F(r.then) && F(r.catch), ar = ((r, e) => r ? setImmediate : e ? ((t, s) => (fe.addEventListener("message", ({ source: n, data: i }) => {
  n === fe && i === t && s.length && s.shift()();
}, !1), (n) => {
  s.push(n), fe.postMessage(t, "*");
}))(`axios@${Math.random()}`, []) : (t) => setTimeout(t))(
  typeof setImmediate == "function",
  F(fe.postMessage)
), vs = typeof queueMicrotask < "u" ? queueMicrotask.bind(fe) : typeof process < "u" && process.nextTick || ar, l = {
  isArray: Se,
  isArrayBuffer: tr,
  isBuffer: Mr,
  isFormData: Vr,
  isArrayBufferView: Ur,
  isString: Zr,
  isNumber: rr,
  isBoolean: Br,
  isObject: dt,
  isPlainObject: Ke,
  isReadableStream: Gr,
  isRequest: Wr,
  isResponse: Kr,
  isHeaders: Qr,
  isUndefined: Ie,
  isDate: Fr,
  isFile: $r,
  isBlob: zr,
  isRegExp: ls,
  isFunction: F,
  isStream: qr,
  isURLSearchParams: Hr,
  isTypedArray: is,
  isFileList: Jr,
  forEach: Ve,
  merge: bt,
  extend: Yr,
  trim: Xr,
  stripBOM: es,
  inherits: ts,
  toFlatObject: rs,
  kindOf: ut,
  kindOfTest: V,
  endsWith: ss,
  toArray: ns,
  forEachEntry: as,
  matchAll: os,
  isHTMLForm: cs,
  hasOwnProperty: Mt,
  hasOwnProp: Mt,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: ir,
  freezeMethods: ds,
  toObjectSet: fs,
  toCamelCase: us,
  noop: hs,
  toFiniteNumber: ps,
  findKey: sr,
  global: fe,
  isContextDefined: nr,
  isSpecCompliantForm: ms,
  toJSONObject: gs,
  isAsyncFn: ys,
  isThenable: _s,
  setImmediate: ar,
  asap: vs
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
const or = x.prototype, cr = {};
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
  cr[r] = { value: r };
});
Object.defineProperties(x, cr);
Object.defineProperty(or, "isAxiosError", { value: !0 });
x.from = (r, e, t, s, n, i) => {
  const a = Object.create(or);
  return l.toFlatObject(r, a, function(u) {
    return u !== Error.prototype;
  }, (o) => o !== "isAxiosError"), x.call(a, r.message, e, t, s, n), a.cause = r, a.name = r.name, i && Object.assign(a, i), a;
};
const bs = null;
function wt(r) {
  return l.isPlainObject(r) || l.isArray(r);
}
function ur(r) {
  return l.endsWith(r, "[]") ? r.slice(0, -2) : r;
}
function Ut(r, e, t) {
  return r ? r.concat(e).map(function(n, i) {
    return n = ur(n), !t && i ? "[" + n + "]" : n;
  }).join(t ? "." : "") : e;
}
function ws(r) {
  return l.isArray(r) && !r.some(wt);
}
const xs = l.toFlatObject(l, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function ft(r, e, t) {
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
  function c(y) {
    if (y === null) return "";
    if (l.isDate(y))
      return y.toISOString();
    if (!u && l.isBlob(y))
      throw new x("Blob is not supported. Use a Buffer instead.");
    return l.isArrayBuffer(y) || l.isTypedArray(y) ? u && typeof Blob == "function" ? new Blob([y]) : Buffer.from(y) : y;
  }
  function d(y, T, _) {
    let N = y;
    if (y && !_ && typeof y == "object") {
      if (l.endsWith(T, "{}"))
        T = s ? T : T.slice(0, -2), y = JSON.stringify(y);
      else if (l.isArray(y) && ws(y) || (l.isFileList(y) || l.endsWith(T, "[]")) && (N = l.toArray(y)))
        return T = ur(T), N.forEach(function(D, Q) {
          !(l.isUndefined(D) || D === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            a === !0 ? Ut([T], Q, i) : a === null ? T : T + "[]",
            c(D)
          );
        }), !1;
    }
    return wt(y) ? !0 : (e.append(Ut(_, T, i), c(y)), !1);
  }
  const p = [], R = Object.assign(xs, {
    defaultVisitor: d,
    convertValue: c,
    isVisitable: wt
  });
  function O(y, T) {
    if (!l.isUndefined(y)) {
      if (p.indexOf(y) !== -1)
        throw Error("Circular reference detected in " + T.join("."));
      p.push(y), l.forEach(y, function(N, P) {
        (!(l.isUndefined(N) || N === null) && n.call(
          e,
          N,
          l.isString(P) ? P.trim() : P,
          T,
          R
        )) === !0 && O(N, T ? T.concat(P) : [P]);
      }), p.pop();
    }
  }
  if (!l.isObject(r))
    throw new TypeError("data must be an object");
  return O(r), e;
}
function Zt(r) {
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
function It(r, e) {
  this._pairs = [], r && ft(r, this, e);
}
const lr = It.prototype;
lr.append = function(e, t) {
  this._pairs.push([e, t]);
};
lr.toString = function(e) {
  const t = e ? function(s) {
    return e.call(this, s, Zt);
  } : Zt;
  return this._pairs.map(function(n) {
    return t(n[0]) + "=" + t(n[1]);
  }, "").join("&");
};
function Es(r) {
  return encodeURIComponent(r).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function dr(r, e, t) {
  if (!e)
    return r;
  const s = t && t.encode || Es;
  l.isFunction(t) && (t = {
    serialize: t
  });
  const n = t && t.serialize;
  let i;
  if (n ? i = n(e, t) : i = l.isURLSearchParams(e) ? e.toString() : new It(e, t).toString(s), i) {
    const a = r.indexOf("#");
    a !== -1 && (r = r.slice(0, a)), r += (r.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return r;
}
class Bt {
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
const fr = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Ts = typeof URLSearchParams < "u" ? URLSearchParams : It, ks = typeof FormData < "u" ? FormData : null, Ss = typeof Blob < "u" ? Blob : null, Rs = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Ts,
    FormData: ks,
    Blob: Ss
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Pt = typeof window < "u" && typeof document < "u", xt = typeof navigator == "object" && navigator || void 0, As = Pt && (!xt || ["ReactNative", "NativeScript", "NS"].indexOf(xt.product) < 0), Os = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Cs = Pt && window.location.href || "http://localhost", Ns = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Pt,
  hasStandardBrowserEnv: As,
  hasStandardBrowserWebWorkerEnv: Os,
  navigator: xt,
  origin: Cs
}, Symbol.toStringTag, { value: "Module" })), L = {
  ...Ns,
  ...Rs
};
function Is(r, e) {
  return ft(r, new L.classes.URLSearchParams(), Object.assign({
    visitor: function(t, s, n, i) {
      return L.isNode && l.isBuffer(t) ? (this.append(s, t.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    }
  }, e));
}
function Ps(r) {
  return l.matchAll(/\w+|\[(\w*)]/g, r).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function js(r) {
  const e = {}, t = Object.keys(r);
  let s;
  const n = t.length;
  let i;
  for (s = 0; s < n; s++)
    i = t[s], e[i] = r[i];
  return e;
}
function hr(r) {
  function e(t, s, n, i) {
    let a = t[i++];
    if (a === "__proto__") return !0;
    const o = Number.isFinite(+a), u = i >= t.length;
    return a = !a && l.isArray(n) ? n.length : a, u ? (l.hasOwnProp(n, a) ? n[a] = [n[a], s] : n[a] = s, !o) : ((!n[a] || !l.isObject(n[a])) && (n[a] = []), e(t, s, n[a], i) && l.isArray(n[a]) && (n[a] = js(n[a])), !o);
  }
  if (l.isFormData(r) && l.isFunction(r.entries)) {
    const t = {};
    return l.forEachEntry(r, (s, n) => {
      e(Ps(s), n, t, 0);
    }), t;
  }
  return null;
}
function Ds(r, e, t) {
  if (l.isString(r))
    try {
      return (e || JSON.parse)(r), l.trim(r);
    } catch (s) {
      if (s.name !== "SyntaxError")
        throw s;
    }
  return (t || JSON.stringify)(r);
}
const He = {
  transitional: fr,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(e, t) {
    const s = t.getContentType() || "", n = s.indexOf("application/json") > -1, i = l.isObject(e);
    if (i && l.isHTMLForm(e) && (e = new FormData(e)), l.isFormData(e))
      return n ? JSON.stringify(hr(e)) : e;
    if (l.isArrayBuffer(e) || l.isBuffer(e) || l.isStream(e) || l.isFile(e) || l.isBlob(e) || l.isReadableStream(e))
      return e;
    if (l.isArrayBufferView(e))
      return e.buffer;
    if (l.isURLSearchParams(e))
      return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
    let o;
    if (i) {
      if (s.indexOf("application/x-www-form-urlencoded") > -1)
        return Is(e, this.formSerializer).toString();
      if ((o = l.isFileList(e)) || s.indexOf("multipart/form-data") > -1) {
        const u = this.env && this.env.FormData;
        return ft(
          o ? { "files[]": e } : e,
          u && new u(),
          this.formSerializer
        );
      }
    }
    return i || n ? (t.setContentType("application/json", !1), Ds(e)) : e;
  }],
  transformResponse: [function(e) {
    const t = this.transitional || He.transitional, s = t && t.forcedJSONParsing, n = this.responseType === "json";
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
    FormData: L.classes.FormData,
    Blob: L.classes.Blob
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
  He.headers[r] = {};
});
const Ls = l.toObjectSet([
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
]), Ms = (r) => {
  const e = {};
  let t, s, n;
  return r && r.split(`
`).forEach(function(a) {
    n = a.indexOf(":"), t = a.substring(0, n).trim().toLowerCase(), s = a.substring(n + 1).trim(), !(!t || e[t] && Ls[t]) && (t === "set-cookie" ? e[t] ? e[t].push(s) : e[t] = [s] : e[t] = e[t] ? e[t] + ", " + s : s);
  }), e;
}, Ft = Symbol("internals");
function Ae(r) {
  return r && String(r).trim().toLowerCase();
}
function Qe(r) {
  return r === !1 || r == null ? r : l.isArray(r) ? r.map(Qe) : String(r);
}
function Us(r) {
  const e = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; s = t.exec(r); )
    e[s[1]] = s[2];
  return e;
}
const Zs = (r) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(r.trim());
function gt(r, e, t, s, n) {
  if (l.isFunction(s))
    return s.call(this, e, t);
  if (n && (e = t), !!l.isString(e)) {
    if (l.isString(s))
      return e.indexOf(s) !== -1;
    if (l.isRegExp(s))
      return s.test(e);
  }
}
function Bs(r) {
  return r.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, s) => t.toUpperCase() + s);
}
function Fs(r, e) {
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
let B = class {
  constructor(e) {
    e && this.set(e);
  }
  set(e, t, s) {
    const n = this;
    function i(o, u, c) {
      const d = Ae(u);
      if (!d)
        throw new Error("header name must be a non-empty string");
      const p = l.findKey(n, d);
      (!p || n[p] === void 0 || c === !0 || c === void 0 && n[p] !== !1) && (n[p || u] = Qe(o));
    }
    const a = (o, u) => l.forEach(o, (c, d) => i(c, d, u));
    if (l.isPlainObject(e) || e instanceof this.constructor)
      a(e, t);
    else if (l.isString(e) && (e = e.trim()) && !Zs(e))
      a(Ms(e), t);
    else if (l.isHeaders(e))
      for (const [o, u] of e.entries())
        i(u, o, s);
    else
      e != null && i(t, e, s);
    return this;
  }
  get(e, t) {
    if (e = Ae(e), e) {
      const s = l.findKey(this, e);
      if (s) {
        const n = this[s];
        if (!t)
          return n;
        if (t === !0)
          return Us(n);
        if (l.isFunction(t))
          return t.call(this, n, s);
        if (l.isRegExp(t))
          return t.exec(n);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, t) {
    if (e = Ae(e), e) {
      const s = l.findKey(this, e);
      return !!(s && this[s] !== void 0 && (!t || gt(this, this[s], s, t)));
    }
    return !1;
  }
  delete(e, t) {
    const s = this;
    let n = !1;
    function i(a) {
      if (a = Ae(a), a) {
        const o = l.findKey(s, a);
        o && (!t || gt(s, s[o], o, t)) && (delete s[o], n = !0);
      }
    }
    return l.isArray(e) ? e.forEach(i) : i(e), n;
  }
  clear(e) {
    const t = Object.keys(this);
    let s = t.length, n = !1;
    for (; s--; ) {
      const i = t[s];
      (!e || gt(this, this[i], i, e, !0)) && (delete this[i], n = !0);
    }
    return n;
  }
  normalize(e) {
    const t = this, s = {};
    return l.forEach(this, (n, i) => {
      const a = l.findKey(s, i);
      if (a) {
        t[a] = Qe(n), delete t[i];
        return;
      }
      const o = e ? Bs(i) : String(i).trim();
      o !== i && delete t[i], t[o] = Qe(n), s[o] = !0;
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
    const s = (this[Ft] = this[Ft] = {
      accessors: {}
    }).accessors, n = this.prototype;
    function i(a) {
      const o = Ae(a);
      s[o] || (Fs(n, a), s[o] = !0);
    }
    return l.isArray(e) ? e.forEach(i) : i(e), this;
  }
};
B.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
l.reduceDescriptors(B.prototype, ({ value: r }, e) => {
  let t = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => r,
    set(s) {
      this[t] = s;
    }
  };
});
l.freezeMethods(B);
function yt(r, e) {
  const t = this || He, s = e || t, n = B.from(s.headers);
  let i = s.data;
  return l.forEach(r, function(o) {
    i = o.call(t, i, n.normalize(), e ? e.status : void 0);
  }), n.normalize(), i;
}
function pr(r) {
  return !!(r && r.__CANCEL__);
}
function Re(r, e, t) {
  x.call(this, r ?? "canceled", x.ERR_CANCELED, e, t), this.name = "CanceledError";
}
l.inherits(Re, x, {
  __CANCEL__: !0
});
function mr(r, e, t) {
  const s = t.config.validateStatus;
  !t.status || !s || s(t.status) ? r(t) : e(new x(
    "Request failed with status code " + t.status,
    [x.ERR_BAD_REQUEST, x.ERR_BAD_RESPONSE][Math.floor(t.status / 100) - 4],
    t.config,
    t.request,
    t
  ));
}
function $s(r) {
  const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(r);
  return e && e[1] || "";
}
function zs(r, e) {
  r = r || 10;
  const t = new Array(r), s = new Array(r);
  let n = 0, i = 0, a;
  return e = e !== void 0 ? e : 1e3, function(u) {
    const c = Date.now(), d = s[i];
    a || (a = c), t[n] = u, s[n] = c;
    let p = i, R = 0;
    for (; p !== n; )
      R += t[p++], p = p % r;
    if (n = (n + 1) % r, n === i && (i = (i + 1) % r), c - a < e)
      return;
    const O = d && c - d;
    return O ? Math.round(R * 1e3 / O) : void 0;
  };
}
function Js(r, e) {
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
const Ye = (r, e, t = 3) => {
  let s = 0;
  const n = zs(50, 250);
  return Js((i) => {
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
}, $t = (r, e) => {
  const t = r != null;
  return [(s) => e[0]({
    lengthComputable: t,
    total: r,
    loaded: s
  }), e[1]];
}, zt = (r) => (...e) => l.asap(() => r(...e)), qs = L.hasStandardBrowserEnv ? /* @__PURE__ */ ((r, e) => (t) => (t = new URL(t, L.origin), r.protocol === t.protocol && r.host === t.host && (e || r.port === t.port)))(
  new URL(L.origin),
  L.navigator && /(msie|trident)/i.test(L.navigator.userAgent)
) : () => !0, Vs = L.hasStandardBrowserEnv ? (
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
function Hs(r) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(r);
}
function Gs(r, e) {
  return e ? r.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : r;
}
function gr(r, e, t) {
  let s = !Hs(e);
  return r && s || t == !1 ? Gs(r, e) : e;
}
const Jt = (r) => r instanceof B ? { ...r } : r;
function me(r, e) {
  e = e || {};
  const t = {};
  function s(c, d, p, R) {
    return l.isPlainObject(c) && l.isPlainObject(d) ? l.merge.call({ caseless: R }, c, d) : l.isPlainObject(d) ? l.merge({}, d) : l.isArray(d) ? d.slice() : d;
  }
  function n(c, d, p, R) {
    if (l.isUndefined(d)) {
      if (!l.isUndefined(c))
        return s(void 0, c, p, R);
    } else return s(c, d, p, R);
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
    headers: (c, d, p) => n(Jt(c), Jt(d), p, !0)
  };
  return l.forEach(Object.keys(Object.assign({}, r, e)), function(d) {
    const p = u[d] || n, R = p(r[d], e[d], d);
    l.isUndefined(R) && p !== o || (t[d] = R);
  }), t;
}
const yr = (r) => {
  const e = me({}, r);
  let { data: t, withXSRFToken: s, xsrfHeaderName: n, xsrfCookieName: i, headers: a, auth: o } = e;
  e.headers = a = B.from(a), e.url = dr(gr(e.baseURL, e.url), r.params, r.paramsSerializer), o && a.set(
    "Authorization",
    "Basic " + btoa((o.username || "") + ":" + (o.password ? unescape(encodeURIComponent(o.password)) : ""))
  );
  let u;
  if (l.isFormData(t)) {
    if (L.hasStandardBrowserEnv || L.hasStandardBrowserWebWorkerEnv)
      a.setContentType(void 0);
    else if ((u = a.getContentType()) !== !1) {
      const [c, ...d] = u ? u.split(";").map((p) => p.trim()).filter(Boolean) : [];
      a.setContentType([c || "multipart/form-data", ...d].join("; "));
    }
  }
  if (L.hasStandardBrowserEnv && (s && l.isFunction(s) && (s = s(e)), s || s !== !1 && qs(e.url))) {
    const c = n && i && Vs.read(i);
    c && a.set(n, c);
  }
  return e;
}, Ws = typeof XMLHttpRequest < "u", Ks = Ws && function(r) {
  return new Promise(function(t, s) {
    const n = yr(r);
    let i = n.data;
    const a = B.from(n.headers).normalize();
    let { responseType: o, onUploadProgress: u, onDownloadProgress: c } = n, d, p, R, O, y;
    function T() {
      O && O(), y && y(), n.cancelToken && n.cancelToken.unsubscribe(d), n.signal && n.signal.removeEventListener("abort", d);
    }
    let _ = new XMLHttpRequest();
    _.open(n.method.toUpperCase(), n.url, !0), _.timeout = n.timeout;
    function N() {
      if (!_)
        return;
      const D = B.from(
        "getAllResponseHeaders" in _ && _.getAllResponseHeaders()
      ), Z = {
        data: !o || o === "text" || o === "json" ? _.responseText : _.response,
        status: _.status,
        statusText: _.statusText,
        headers: D,
        config: r,
        request: _
      };
      mr(function(ue) {
        t(ue), T();
      }, function(ue) {
        s(ue), T();
      }, Z), _ = null;
    }
    "onloadend" in _ ? _.onloadend = N : _.onreadystatechange = function() {
      !_ || _.readyState !== 4 || _.status === 0 && !(_.responseURL && _.responseURL.indexOf("file:") === 0) || setTimeout(N);
    }, _.onabort = function() {
      _ && (s(new x("Request aborted", x.ECONNABORTED, r, _)), _ = null);
    }, _.onerror = function() {
      s(new x("Network Error", x.ERR_NETWORK, r, _)), _ = null;
    }, _.ontimeout = function() {
      let Q = n.timeout ? "timeout of " + n.timeout + "ms exceeded" : "timeout exceeded";
      const Z = n.transitional || fr;
      n.timeoutErrorMessage && (Q = n.timeoutErrorMessage), s(new x(
        Q,
        Z.clarifyTimeoutError ? x.ETIMEDOUT : x.ECONNABORTED,
        r,
        _
      )), _ = null;
    }, i === void 0 && a.setContentType(null), "setRequestHeader" in _ && l.forEach(a.toJSON(), function(Q, Z) {
      _.setRequestHeader(Z, Q);
    }), l.isUndefined(n.withCredentials) || (_.withCredentials = !!n.withCredentials), o && o !== "json" && (_.responseType = n.responseType), c && ([R, y] = Ye(c, !0), _.addEventListener("progress", R)), u && _.upload && ([p, O] = Ye(u), _.upload.addEventListener("progress", p), _.upload.addEventListener("loadend", O)), (n.cancelToken || n.signal) && (d = (D) => {
      _ && (s(!D || D.type ? new Re(null, r, _) : D), _.abort(), _ = null);
    }, n.cancelToken && n.cancelToken.subscribe(d), n.signal && (n.signal.aborted ? d() : n.signal.addEventListener("abort", d)));
    const P = $s(n.url);
    if (P && L.protocols.indexOf(P) === -1) {
      s(new x("Unsupported protocol " + P + ":", x.ERR_BAD_REQUEST, r));
      return;
    }
    _.send(i || null);
  });
}, Qs = (r, e) => {
  const { length: t } = r = r ? r.filter(Boolean) : [];
  if (e || t) {
    let s = new AbortController(), n;
    const i = function(c) {
      if (!n) {
        n = !0, o();
        const d = c instanceof Error ? c : this.reason;
        s.abort(d instanceof x ? d : new Re(d instanceof Error ? d.message : d));
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
}, Xs = function* (r, e) {
  let t = r.byteLength;
  if (t < e) {
    yield r;
    return;
  }
  let s = 0, n;
  for (; s < t; )
    n = s + e, yield r.slice(s, n), s = n;
}, Ys = async function* (r, e) {
  for await (const t of en(r))
    yield* Xs(t, e);
}, en = async function* (r) {
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
}, qt = (r, e, t, s) => {
  const n = Ys(r, e);
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
          let R = i += p;
          t(R);
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
}, ht = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", _r = ht && typeof ReadableStream == "function", tn = ht && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((r) => (e) => r.encode(e))(new TextEncoder()) : async (r) => new Uint8Array(await new Response(r).arrayBuffer())), vr = (r, ...e) => {
  try {
    return !!r(...e);
  } catch {
    return !1;
  }
}, rn = _r && vr(() => {
  let r = !1;
  const e = new Request(L.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return r = !0, "half";
    }
  }).headers.has("Content-Type");
  return r && !e;
}), Vt = 64 * 1024, Et = _r && vr(() => l.isReadableStream(new Response("").body)), et = {
  stream: Et && ((r) => r.body)
};
ht && ((r) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
    !et[e] && (et[e] = l.isFunction(r[e]) ? (t) => t[e]() : (t, s) => {
      throw new x(`Response type '${e}' is not supported`, x.ERR_NOT_SUPPORT, s);
    });
  });
})(new Response());
const sn = async (r) => {
  if (r == null)
    return 0;
  if (l.isBlob(r))
    return r.size;
  if (l.isSpecCompliantForm(r))
    return (await new Request(L.origin, {
      method: "POST",
      body: r
    }).arrayBuffer()).byteLength;
  if (l.isArrayBufferView(r) || l.isArrayBuffer(r))
    return r.byteLength;
  if (l.isURLSearchParams(r) && (r = r + ""), l.isString(r))
    return (await tn(r)).byteLength;
}, nn = async (r, e) => {
  const t = l.toFiniteNumber(r.getContentLength());
  return t ?? sn(e);
}, an = ht && (async (r) => {
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
    fetchOptions: R
  } = yr(r);
  c = c ? (c + "").toLowerCase() : "text";
  let O = Qs([n, i && i.toAbortSignal()], a), y;
  const T = O && O.unsubscribe && (() => {
    O.unsubscribe();
  });
  let _;
  try {
    if (u && rn && t !== "get" && t !== "head" && (_ = await nn(d, s)) !== 0) {
      let Z = new Request(e, {
        method: "POST",
        body: s,
        duplex: "half"
      }), se;
      if (l.isFormData(s) && (se = Z.headers.get("content-type")) && d.setContentType(se), Z.body) {
        const [ue, We] = $t(
          _,
          Ye(zt(u))
        );
        s = qt(Z.body, Vt, ue, We);
      }
    }
    l.isString(p) || (p = p ? "include" : "omit");
    const N = "credentials" in Request.prototype;
    y = new Request(e, {
      ...R,
      signal: O,
      method: t.toUpperCase(),
      headers: d.normalize().toJSON(),
      body: s,
      duplex: "half",
      credentials: N ? p : void 0
    });
    let P = await fetch(y);
    const D = Et && (c === "stream" || c === "response");
    if (Et && (o || D && T)) {
      const Z = {};
      ["status", "statusText", "headers"].forEach((Lt) => {
        Z[Lt] = P[Lt];
      });
      const se = l.toFiniteNumber(P.headers.get("content-length")), [ue, We] = o && $t(
        se,
        Ye(zt(o), !0)
      ) || [];
      P = new Response(
        qt(P.body, Vt, ue, () => {
          We && We(), T && T();
        }),
        Z
      );
    }
    c = c || "text";
    let Q = await et[l.findKey(et, c) || "text"](P, r);
    return !D && T && T(), await new Promise((Z, se) => {
      mr(Z, se, {
        data: Q,
        headers: B.from(P.headers),
        status: P.status,
        statusText: P.statusText,
        config: r,
        request: y
      });
    });
  } catch (N) {
    throw T && T(), N && N.name === "TypeError" && /fetch/i.test(N.message) ? Object.assign(
      new x("Network Error", x.ERR_NETWORK, r, y),
      {
        cause: N.cause || N
      }
    ) : x.from(N, N && N.code, r, y);
  }
}), Tt = {
  http: bs,
  xhr: Ks,
  fetch: an
};
l.forEach(Tt, (r, e) => {
  if (r) {
    try {
      Object.defineProperty(r, "name", { value: e });
    } catch {
    }
    Object.defineProperty(r, "adapterName", { value: e });
  }
});
const Ht = (r) => `- ${r}`, on = (r) => l.isFunction(r) || r === null || r === !1, br = {
  getAdapter: (r) => {
    r = l.isArray(r) ? r : [r];
    const { length: e } = r;
    let t, s;
    const n = {};
    for (let i = 0; i < e; i++) {
      t = r[i];
      let a;
      if (s = t, !on(t) && (s = Tt[(a = String(t)).toLowerCase()], s === void 0))
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
` + i.map(Ht).join(`
`) : " " + Ht(i[0]) : "as no adapter specified";
      throw new x(
        "There is no suitable adapter to dispatch the request " + a,
        "ERR_NOT_SUPPORT"
      );
    }
    return s;
  },
  adapters: Tt
};
function _t(r) {
  if (r.cancelToken && r.cancelToken.throwIfRequested(), r.signal && r.signal.aborted)
    throw new Re(null, r);
}
function Gt(r) {
  return _t(r), r.headers = B.from(r.headers), r.data = yt.call(
    r,
    r.transformRequest
  ), ["post", "put", "patch"].indexOf(r.method) !== -1 && r.headers.setContentType("application/x-www-form-urlencoded", !1), br.getAdapter(r.adapter || He.adapter)(r).then(function(s) {
    return _t(r), s.data = yt.call(
      r,
      r.transformResponse,
      s
    ), s.headers = B.from(s.headers), s;
  }, function(s) {
    return pr(s) || (_t(r), s && s.response && (s.response.data = yt.call(
      r,
      r.transformResponse,
      s.response
    ), s.response.headers = B.from(s.response.headers))), Promise.reject(s);
  });
}
const wr = "1.8.2", pt = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((r, e) => {
  pt[r] = function(s) {
    return typeof s === r || "a" + (e < 1 ? "n " : " ") + r;
  };
});
const Wt = {};
pt.transitional = function(e, t, s) {
  function n(i, a) {
    return "[Axios v" + wr + "] Transitional option '" + i + "'" + a + (s ? ". " + s : "");
  }
  return (i, a, o) => {
    if (e === !1)
      throw new x(
        n(a, " has been removed" + (t ? " in " + t : "")),
        x.ERR_DEPRECATED
      );
    return t && !Wt[a] && (Wt[a] = !0, console.warn(
      n(
        a,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(i, a, o) : !0;
  };
};
pt.spelling = function(e) {
  return (t, s) => (console.warn(`${s} is likely a misspelling of ${e}`), !0);
};
function cn(r, e, t) {
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
const Xe = {
  assertOptions: cn,
  validators: pt
}, H = Xe.validators;
let he = class {
  constructor(e) {
    this.defaults = e, this.interceptors = {
      request: new Bt(),
      response: new Bt()
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
    typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {}, t = me(this.defaults, t);
    const { transitional: s, paramsSerializer: n, headers: i } = t;
    s !== void 0 && Xe.assertOptions(s, {
      silentJSONParsing: H.transitional(H.boolean),
      forcedJSONParsing: H.transitional(H.boolean),
      clarifyTimeoutError: H.transitional(H.boolean)
    }, !1), n != null && (l.isFunction(n) ? t.paramsSerializer = {
      serialize: n
    } : Xe.assertOptions(n, {
      encode: H.function,
      serialize: H.function
    }, !0)), t.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : t.allowAbsoluteUrls = !0), Xe.assertOptions(t, {
      baseUrl: H.spelling("baseURL"),
      withXsrfToken: H.spelling("withXSRFToken")
    }, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase();
    let a = i && l.merge(
      i.common,
      i[t.method]
    );
    i && l.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (y) => {
        delete i[y];
      }
    ), t.headers = B.concat(a, i);
    const o = [];
    let u = !0;
    this.interceptors.request.forEach(function(T) {
      typeof T.runWhen == "function" && T.runWhen(t) === !1 || (u = u && T.synchronous, o.unshift(T.fulfilled, T.rejected));
    });
    const c = [];
    this.interceptors.response.forEach(function(T) {
      c.push(T.fulfilled, T.rejected);
    });
    let d, p = 0, R;
    if (!u) {
      const y = [Gt.bind(this), void 0];
      for (y.unshift.apply(y, o), y.push.apply(y, c), R = y.length, d = Promise.resolve(t); p < R; )
        d = d.then(y[p++], y[p++]);
      return d;
    }
    R = o.length;
    let O = t;
    for (p = 0; p < R; ) {
      const y = o[p++], T = o[p++];
      try {
        O = y(O);
      } catch (_) {
        T.call(this, _);
        break;
      }
    }
    try {
      d = Gt.call(this, O);
    } catch (y) {
      return Promise.reject(y);
    }
    for (p = 0, R = c.length; p < R; )
      d = d.then(c[p++], c[p++]);
    return d;
  }
  getUri(e) {
    e = me(this.defaults, e);
    const t = gr(e.baseURL, e.url, e.allowAbsoluteUrls);
    return dr(t, e.params, e.paramsSerializer);
  }
};
l.forEach(["delete", "get", "head", "options"], function(e) {
  he.prototype[e] = function(t, s) {
    return this.request(me(s || {}, {
      method: e,
      url: t,
      data: (s || {}).data
    }));
  };
});
l.forEach(["post", "put", "patch"], function(e) {
  function t(s) {
    return function(i, a, o) {
      return this.request(me(o || {}, {
        method: e,
        headers: s ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: a
      }));
    };
  }
  he.prototype[e] = t(), he.prototype[e + "Form"] = t(!0);
});
let un = class xr {
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
      s.reason || (s.reason = new Re(i, a, o), t(s.reason));
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
      token: new xr(function(n) {
        e = n;
      }),
      cancel: e
    };
  }
};
function ln(r) {
  return function(t) {
    return r.apply(null, t);
  };
}
function dn(r) {
  return l.isObject(r) && r.isAxiosError === !0;
}
const kt = {
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
Object.entries(kt).forEach(([r, e]) => {
  kt[e] = r;
});
function Er(r) {
  const e = new he(r), t = er(he.prototype.request, e);
  return l.extend(t, he.prototype, e, { allOwnKeys: !0 }), l.extend(t, e, null, { allOwnKeys: !0 }), t.create = function(n) {
    return Er(me(r, n));
  }, t;
}
const A = Er(He);
A.Axios = he;
A.CanceledError = Re;
A.CancelToken = un;
A.isCancel = pr;
A.VERSION = wr;
A.toFormData = ft;
A.AxiosError = x;
A.Cancel = A.CanceledError;
A.all = function(e) {
  return Promise.all(e);
};
A.spread = ln;
A.isAxiosError = dn;
A.mergeConfig = me;
A.AxiosHeaders = B;
A.formToJSON = (r) => hr(l.isHTMLForm(r) ? new FormData(r) : r);
A.getAdapter = br.getAdapter;
A.HttpStatusCode = kt;
A.default = A;
const {
  Axios: Ci,
  AxiosError: Ni,
  CanceledError: Ii,
  isCancel: Pi,
  CancelToken: ji,
  VERSION: Di,
  all: Li,
  Cancel: Mi,
  isAxiosError: Ui,
  spread: Zi,
  toFormData: Bi,
  AxiosHeaders: Fi,
  HttpStatusCode: $i,
  formToJSON: zi,
  getAdapter: Ji,
  mergeConfig: qi
} = A;
class jt {
  constructor() {
    w(this, "config");
    w(this, "axiosInstance");
    w(this, "cancelTokenSource");
    this.config = te.getInstance(), this.cancelTokenSource = A.CancelToken.source(), this.axiosInstance = A.create({
      baseURL: this.config.baseUrl,
      timeout: 3e4,
      // 30 seconds timeout
      headers: {
        "Content-Type": "application/json"
      }
    }), this.axiosInstance.interceptors.response.use(
      (e) => e,
      (e) => {
        if (A.isCancel(e))
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
    this.cancelTokenSource.cancel("Request canceled by user"), this.cancelTokenSource = A.CancelToken.source();
  }
}
var j = /* @__PURE__ */ ((r) => (r.CREATED = "CREATED", r.QUEUED = "QUEUED", r.PROCESSING = "PROCESSING", r.COMPLETED = "COMPLETED", r.FAILED = "FAILED", r))(j || {}), I = /* @__PURE__ */ ((r) => (r.INITIALIZING = "INITIALIZING", r.PREPARING = "PREPARING", r.SENDING = "SENDING", r.TRACKING = "TRACKING", r.PROCESSING_RESULT = "PROCESSING_RESULT", r.COMPLETED = "COMPLETED", r.FAILED = "FAILED", r))(I || {});
class fn {
  /**
   * Check if the response can be parsed by this parser
   */
  canParse(e) {
    return e ? !!(e.id || e.jobId || e.id && (e.status || e.state) || e.id && e.status && e.urls) : !1;
  }
  /**
   * Parse response into standardized job format
   */
  parse(e) {
    return {
      id: e.id || e.jobId || "",
      status: this.parseStatus(e),
      progress: this.parseProgress(e),
      result: e.result || e.output || null,
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
}
class hn {
  /**
   * Process a response that might contain media data
   */
  processResponse(e) {
    if (!e) return null;
    if (typeof e == "string" && e.startsWith("data:image"))
      return this.processImage(e);
    if (e instanceof ArrayBuffer || e instanceof Blob)
      return this.processBinaryData(e);
    if (typeof e == "object" && e !== null) {
      if (e.image_base64 || e.imageBase64)
        return this.processImage(e.image_base64 || e.imageBase64);
      if (e.image_url || e.imageUrl)
        return {
          url: e.image_url || e.imageUrl,
          ...e
        };
    }
    return e;
  }
  /**
   * Process image data from the API
   */
  processImage(e) {
    if (typeof document < "u") {
      const t = new Image();
      return t.src = e, {
        data: e,
        element: t,
        appendTo: (s) => (s.appendChild(t), t)
      };
    }
    return { data: e };
  }
  /**
   * Process binary data from the API
   */
  processBinaryData(e) {
    return typeof Blob < "u" && e instanceof Blob ? {
      data: e,
      toURL: () => URL.createObjectURL(e),
      toBase64: async () => new Promise((t) => {
        const s = new FileReader();
        s.onloadend = () => t(s.result), s.readAsDataURL(e);
      })
    } : { data: e };
  }
}
const le = class le {
  /**
   * Private constructor to enforce singleton pattern
   * @param requestHandler - RequestHandler for API communication
   */
  constructor(e) {
    w(this, "requestHandler");
    w(this, "config");
    w(this, "jobs");
    w(this, "responseParser");
    w(this, "mediaHandler");
    this.requestHandler = e, this.config = te.getInstance(), this.jobs = /* @__PURE__ */ new Map(), this.responseParser = new fn(), this.mediaHandler = new hn();
  }
  /**
   * Get the singleton instance of JobManager
   * @param requestHandler - Optional RequestHandler to use when creating the instance
   * @returns The JobManager instance
   */
  static getInstance(e) {
    return le.instance || (e || (e = new jt()), le.instance = new le(e)), le.instance;
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
      const a = this.responseParser.parse(i);
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
        const s = await this.requestHandler.sendRequest("status", "POST", { job_id: e.id }), n = this.responseParser.parse(s);
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
w(le, "instance");
let tt = le;
const Ne = typeof process < "u" && process.stdout && process.stdout.clearLine;
let we;
if (Ne)
  try {
    we = require("cli-progress");
  } catch {
    console.warn("cli-progress package not found. Using basic console output for progress.");
  }
const de = class de {
  constructor() {
    w(this, "multiBar");
    w(this, "bars", /* @__PURE__ */ new Map());
    w(this, "isInitialized", !1);
    Ne && we && (this.multiBar = new we.MultiBar({
      clearOnComplete: !1,
      hideCursor: !0,
      format: "{bar} {percentage}% | {jobId} | {phase} | {message}"
    }), this.isInitialized = !0);
  }
  static getInstance() {
    return de.instance || (de.instance = new de()), de.instance;
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
w(de, "instance");
let St = de;
class pn {
  constructor(e, t, s, n = !0) {
    w(this, "apiJob");
    w(this, "endpoint");
    w(this, "processingState");
    w(this, "jobManager");
    w(this, "result", null);
    w(this, "error", null);
    w(this, "completed", !1);
    w(this, "pollingInterval", null);
    w(this, "resolvePromise");
    w(this, "rejectPromise");
    w(this, "promise");
    w(this, "eventListeners", /* @__PURE__ */ new Map());
    w(this, "verbose");
    w(this, "progressBar", null);
    w(this, "progressBarManager");
    // Keep track of the last logged message to avoid duplicates
    w(this, "_lastLoggedMessage", null);
    this.apiJob = e, this.jobManager = t, this.endpoint = s, this.verbose = n, this.processingState = {
      phase: I.INITIALIZING,
      progress: 0
    }, this.progressBarManager = St.getInstance(), this.promise = new Promise((i, a) => {
      this.resolvePromise = i, this.rejectPromise = a;
    }), setTimeout(() => this.startTracking(), 0), this.verbose && this.initProgressDisplay();
  }
  /**
   * Initialize the progress display
   */
  initProgressDisplay() {
    this.verbose && (Ne && we ? (this.progressBar = this.progressBarManager.createBar(
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
    Ne && we && this.progressBar ? this.progressBarManager.updateBar(this.apiJob.id, t, {
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
    Ne && we && this.progressBar && (this.progressBarManager.removeBar(this.apiJob.id), this.progressBar = null);
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
        const e = await this.jobManager.requestHandler.sendRequest("status", "POST", { job_id: this.apiJob.id });
        if (!e) {
          setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
          return;
        }
        const t = this.jobManager.responseParser.parse(e);
        if (this.apiJob = t, this.emitJobUpdate(), this.verbose && this.updateProgressDisplay(), t.status === j.COMPLETED) {
          this.updateProcessingState(I.PROCESSING_RESULT, 0.9, "Processing result");
          try {
            this.result = t.result, this.complete();
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
class mn {
  constructor(e) {
    w(this, "requestHandler");
    w(this, "config");
    w(this, "endpoints");
    w(this, "jobManager");
    // Name of the API client. Has influence on path variable in the requests which will be formatted like /api/v1/{name}/{endpoint}
    w(this, "name");
    this.name = this.sanitize_path(e), this.config = te.getInstance(), this.requestHandler = new jt(), this.endpoints = /* @__PURE__ */ new Map(), this.jobManager = tt.getInstance(this.requestHandler), this.registerEndpoints();
  }
  sanitize_path(e) {
    return e = e.trim(), e = e.replace(/\\/, "/"), e = e.replace(/^\/+|\/+$/g, ""), e;
  }
  /**
   * Register available endpoints for this API client
   * This method should be overridden by subclasses
   */
  registerEndpoints() {
  }
  /**
   * Register a new endpoint with the client
   */
  registerEndpoint(e) {
    const t = this.sanitize_path(e.path);
    e.path = this.name + "/" + t, this.endpoints.set(t, e);
  }
  /**
   * Get an endpoint by name
   */
  getEndpoint(e) {
    e = this.sanitize_path(e);
    const t = this.endpoints.get(e);
    if (!t)
      throw new Error(`Unknown endpoint: ${e}`);
    return t;
  }
  /**
   * Update the client configuration
   */
  updateConfig(e) {
    if (typeof e == "object")
      for (const [t, s] of Object.entries(e))
        this.config[t] = s;
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
    return new pn(a, this.jobManager, e, i);
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
var Rt;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Rt || (Rt = {}));
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
]), ee = (r) => {
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
]), gn = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class $ extends Error {
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
    if (!(e instanceof $))
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
$.create = (r) => new $(r);
const Ee = (r, e) => {
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
let Tr = Ee;
function yn(r) {
  Tr = r;
}
function rt() {
  return Tr;
}
const st = (r) => {
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
}, _n = [];
function h(r, e) {
  const t = rt(), s = st({
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
      t === Ee ? void 0 : Ee
      // then global default map
    ].filter((n) => !!n)
  });
  r.common.issues.push(s);
}
class M {
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
        return b;
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
    return M.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const n of t) {
      const { key: i, value: a } = n;
      if (i.status === "aborted" || a.status === "aborted")
        return b;
      i.status === "dirty" && e.dirty(), a.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof a.value < "u" || n.alwaysSet) && (s[i.value] = a.value);
    }
    return { status: e.value, value: s };
  }
}
const b = Object.freeze({
  status: "aborted"
}), be = (r) => ({ status: "dirty", value: r }), U = (r) => ({ status: "valid", value: r }), At = (r) => r.status === "aborted", Ot = (r) => r.status === "dirty", ge = (r) => r.status === "valid", Pe = (r) => typeof Promise < "u" && r instanceof Promise;
function nt(r, e, t, s) {
  if (typeof e == "function" ? r !== e || !0 : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function kr(r, e, t, s, n) {
  if (typeof e == "function" ? r !== e || !0 : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var g;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(g || (g = {}));
var Oe, Ce;
class W {
  constructor(e, t, s, n) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Kt = (r, e) => {
  if (ge(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new $(r.common.issues);
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
    return ee(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: ee(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new M(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: ee(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Pe(t))
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
      parsedType: ee(e)
    }, i = this._parseSync({ data: e, path: n.path, parent: n });
    return Kt(n, i);
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
      parsedType: ee(e)
    };
    if (!this["~standard"].async)
      try {
        const i = this._parseSync({ data: e, path: [], parent: n });
        return ge(i) ? {
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
    return this._parseAsync({ data: e, path: [], parent: n }).then((i) => ge(i) ? {
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
      parsedType: ee(e)
    }, n = this._parse({ data: e, path: s.path, parent: s }), i = await (Pe(n) ? n : Promise.resolve(n));
    return Kt(s, i);
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
    return new q({
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
    return G.create(this, this._def);
  }
  nullable() {
    return ce.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return J.create(this);
  }
  promise() {
    return ke.create(this, this._def);
  }
  or(e) {
    return Me.create([this, e], this._def);
  }
  and(e) {
    return Ue.create(this, e, this._def);
  }
  transform(e) {
    return new q({
      ...E(this._def),
      schema: this,
      typeName: v.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ze({
      ...E(this._def),
      innerType: this,
      defaultValue: t,
      typeName: v.ZodDefault
    });
  }
  brand() {
    return new Dt({
      typeName: v.ZodBranded,
      type: this,
      ...E(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Je({
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
    return Ge.create(this, e);
  }
  readonly() {
    return qe.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const vn = /^c[^\s-]{8,}$/i, bn = /^[0-9a-z]+$/, wn = /^[0-9A-HJKMNP-TV-Z]{26}$/i, xn = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, En = /^[a-z0-9_-]{21}$/i, Tn = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, kn = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Sn = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Rn = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let vt;
const An = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, On = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Cn = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Nn = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, In = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Pn = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Sr = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", jn = new RegExp(`^${Sr}$`);
function Rr(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function Dn(r) {
  return new RegExp(`^${Rr(r)}$`);
}
function Ar(r) {
  let e = `${Sr}T${Rr(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Ln(r, e) {
  return !!((e === "v4" || !e) && An.test(r) || (e === "v6" || !e) && Cn.test(r));
}
function Mn(r, e) {
  if (!Tn.test(r))
    return !1;
  try {
    const [t] = r.split("."), s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n = JSON.parse(atob(s));
    return !(typeof n != "object" || n === null || !n.typ || !n.alg || e && n.alg !== e);
  } catch {
    return !1;
  }
}
function Un(r, e) {
  return !!((e === "v4" || !e) && On.test(r) || (e === "v6" || !e) && Nn.test(r));
}
class z extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== m.string) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: m.string,
        received: i.parsedType
      }), b;
    }
    const s = new M();
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
        Sn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "email",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "emoji")
        vt || (vt = new RegExp(Rn, "u")), vt.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "emoji",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "uuid")
        xn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "uuid",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "nanoid")
        En.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "nanoid",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "cuid")
        vn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "cuid",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "cuid2")
        bn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "cuid2",
          code: f.invalid_string,
          message: i.message
        }), s.dirty());
      else if (i.kind === "ulid")
        wn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
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
      }), s.dirty()) : i.kind === "datetime" ? Ar(i).test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: "datetime",
        message: i.message
      }), s.dirty()) : i.kind === "date" ? jn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: "date",
        message: i.message
      }), s.dirty()) : i.kind === "time" ? Dn(i).test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: f.invalid_string,
        validation: "time",
        message: i.message
      }), s.dirty()) : i.kind === "duration" ? kn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "duration",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "ip" ? Ln(e.data, i.version) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "ip",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "jwt" ? Mn(e.data, i.alg) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "jwt",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "cidr" ? Un(e.data, i.version) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "cidr",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "base64" ? In.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "base64",
        code: f.invalid_string,
        message: i.message
      }), s.dirty()) : i.kind === "base64url" ? Pn.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
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
      ...g.errToObj(s)
    });
  }
  _addCheck(e) {
    return new z({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...g.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...g.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...g.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...g.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...g.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...g.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...g.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...g.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...g.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...g.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...g.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...g.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...g.errToObj(e) });
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
      ...g.errToObj(e == null ? void 0 : e.message)
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
      ...g.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...g.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...g.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...g.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...g.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...g.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...g.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...g.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...g.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, g.errToObj(e));
  }
  trim() {
    return new z({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new z({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new z({
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
z.create = (r) => {
  var e;
  return new z({
    checks: [],
    typeName: v.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...E(r)
  });
};
function Zn(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, n = t > s ? t : s, i = parseInt(r.toFixed(n).replace(".", "")), a = parseInt(e.toFixed(n).replace(".", ""));
  return i % a / Math.pow(10, n);
}
class ie extends k {
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
      }), b;
    }
    let s;
    const n = new M();
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
      }), n.dirty()) : i.kind === "multipleOf" ? Zn(e.data, i.value) !== 0 && (s = this._getOrReturnCtx(e, s), h(s, {
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
    return this.setLimit("min", e, !0, g.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, g.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, g.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, g.toString(t));
  }
  setLimit(e, t, s, n) {
    return new ie({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: g.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ie({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: g.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: g.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: g.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: g.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: g.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: g.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: g.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: g.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: g.toString(e)
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
ie.create = (r) => new ie({
  checks: [],
  typeName: v.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...E(r)
});
class ae extends k {
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
    const n = new M();
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
    }), b;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, g.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, g.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, g.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, g.toString(t));
  }
  setLimit(e, t, s, n) {
    return new ae({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: g.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ae({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: g.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: g.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: g.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: g.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: g.toString(t)
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
ae.create = (r) => {
  var e;
  return new ae({
    checks: [],
    typeName: v.ZodBigInt,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...E(r)
  });
};
class je extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== m.boolean) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.boolean,
        received: s.parsedType
      }), b;
    }
    return U(e.data);
  }
}
je.create = (r) => new je({
  typeName: v.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...E(r)
});
class ye extends k {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== m.date) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: m.date,
        received: i.parsedType
      }), b;
    }
    if (isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_date
      }), b;
    }
    const s = new M();
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
    return new ye({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: g.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: g.toString(t)
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
ye.create = (r) => new ye({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: v.ZodDate,
  ...E(r)
});
class it extends k {
  _parse(e) {
    if (this._getType(e) !== m.symbol) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.symbol,
        received: s.parsedType
      }), b;
    }
    return U(e.data);
  }
}
it.create = (r) => new it({
  typeName: v.ZodSymbol,
  ...E(r)
});
class De extends k {
  _parse(e) {
    if (this._getType(e) !== m.undefined) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.undefined,
        received: s.parsedType
      }), b;
    }
    return U(e.data);
  }
}
De.create = (r) => new De({
  typeName: v.ZodUndefined,
  ...E(r)
});
class Le extends k {
  _parse(e) {
    if (this._getType(e) !== m.null) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.null,
        received: s.parsedType
      }), b;
    }
    return U(e.data);
  }
}
Le.create = (r) => new Le({
  typeName: v.ZodNull,
  ...E(r)
});
class Te extends k {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return U(e.data);
  }
}
Te.create = (r) => new Te({
  typeName: v.ZodAny,
  ...E(r)
});
class pe extends k {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return U(e.data);
  }
}
pe.create = (r) => new pe({
  typeName: v.ZodUnknown,
  ...E(r)
});
class re extends k {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return h(t, {
      code: f.invalid_type,
      expected: m.never,
      received: t.parsedType
    }), b;
  }
}
re.create = (r) => new re({
  typeName: v.ZodNever,
  ...E(r)
});
class at extends k {
  _parse(e) {
    if (this._getType(e) !== m.undefined) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.void,
        received: s.parsedType
      }), b;
    }
    return U(e.data);
  }
}
at.create = (r) => new at({
  typeName: v.ZodVoid,
  ...E(r)
});
class J extends k {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== m.array)
      return h(t, {
        code: f.invalid_type,
        expected: m.array,
        received: t.parsedType
      }), b;
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
      return Promise.all([...t.data].map((a, o) => n.type._parseAsync(new W(t, a, t.path, o)))).then((a) => M.mergeArray(s, a));
    const i = [...t.data].map((a, o) => n.type._parseSync(new W(t, a, t.path, o)));
    return M.mergeArray(s, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new J({
      ...this._def,
      minLength: { value: e, message: g.toString(t) }
    });
  }
  max(e, t) {
    return new J({
      ...this._def,
      maxLength: { value: e, message: g.toString(t) }
    });
  }
  length(e, t) {
    return new J({
      ...this._def,
      exactLength: { value: e, message: g.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
J.create = (r, e) => new J({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: v.ZodArray,
  ...E(e)
});
function ve(r) {
  if (r instanceof C) {
    const e = {};
    for (const t in r.shape) {
      const s = r.shape[t];
      e[t] = G.create(ve(s));
    }
    return new C({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof J ? new J({
    ...r._def,
    type: ve(r.element)
  }) : r instanceof G ? G.create(ve(r.unwrap())) : r instanceof ce ? ce.create(ve(r.unwrap())) : r instanceof K ? K.create(r.items.map((e) => ve(e))) : r;
}
class C extends k {
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
      }), b;
    }
    const { status: s, ctx: n } = this._processInputParams(e), { shape: i, keys: a } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof re && this._def.unknownKeys === "strip"))
      for (const c in n.data)
        a.includes(c) || o.push(c);
    const u = [];
    for (const c of a) {
      const d = i[c], p = n.data[c];
      u.push({
        key: { status: "valid", value: c },
        value: d._parse(new W(n, p, n.path, c)),
        alwaysSet: c in n.data
      });
    }
    if (this._def.catchall instanceof re) {
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
            new W(n, p, n.path, d)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: d in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
      const c = [];
      for (const d of u) {
        const p = await d.key, R = await d.value;
        c.push({
          key: p,
          value: R,
          alwaysSet: d.alwaysSet
        });
      }
      return c;
    }).then((c) => M.mergeObjectSync(s, c)) : M.mergeObjectSync(s, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return g.errToObj, new C({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var n, i, a, o;
          const u = (a = (i = (n = this._def).errorMap) === null || i === void 0 ? void 0 : i.call(n, t, s).message) !== null && a !== void 0 ? a : s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (o = g.errToObj(e).message) !== null && o !== void 0 ? o : u
          } : {
            message: u
          };
        }
      } : {}
    });
  }
  strip() {
    return new C({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new C({
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
    return new C({
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
    return new C({
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
    return new C({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return S.objectKeys(e).forEach((s) => {
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    }), new C({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return S.objectKeys(this.shape).forEach((s) => {
      e[s] || (t[s] = this.shape[s]);
    }), new C({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return ve(this);
  }
  partial(e) {
    const t = {};
    return S.objectKeys(this.shape).forEach((s) => {
      const n = this.shape[s];
      e && !e[s] ? t[s] = n : t[s] = n.optional();
    }), new C({
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
        for (; i instanceof G; )
          i = i._def.innerType;
        t[s] = i;
      }
    }), new C({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Or(S.objectKeys(this.shape));
  }
}
C.create = (r, e) => new C({
  shape: () => r,
  unknownKeys: "strip",
  catchall: re.create(),
  typeName: v.ZodObject,
  ...E(e)
});
C.strictCreate = (r, e) => new C({
  shape: () => r,
  unknownKeys: "strict",
  catchall: re.create(),
  typeName: v.ZodObject,
  ...E(e)
});
C.lazycreate = (r, e) => new C({
  shape: r,
  unknownKeys: "strip",
  catchall: re.create(),
  typeName: v.ZodObject,
  ...E(e)
});
class Me extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function n(i) {
      for (const o of i)
        if (o.result.status === "valid")
          return o.result;
      for (const o of i)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const a = i.map((o) => new $(o.ctx.common.issues));
      return h(t, {
        code: f.invalid_union,
        unionErrors: a
      }), b;
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
      const o = a.map((u) => new $(u));
      return h(t, {
        code: f.invalid_union,
        unionErrors: o
      }), b;
    }
  }
  get options() {
    return this._def.options;
  }
}
Me.create = (r, e) => new Me({
  options: r,
  typeName: v.ZodUnion,
  ...E(e)
});
const Y = (r) => r instanceof Be ? Y(r.schema) : r instanceof q ? Y(r.innerType()) : r instanceof Fe ? [r.value] : r instanceof oe ? r.options : r instanceof $e ? S.objectValues(r.enum) : r instanceof ze ? Y(r._def.innerType) : r instanceof De ? [void 0] : r instanceof Le ? [null] : r instanceof G ? [void 0, ...Y(r.unwrap())] : r instanceof ce ? [null, ...Y(r.unwrap())] : r instanceof Dt || r instanceof qe ? Y(r.unwrap()) : r instanceof Je ? Y(r._def.innerType) : [];
class mt extends k {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== m.object)
      return h(t, {
        code: f.invalid_type,
        expected: m.object,
        received: t.parsedType
      }), b;
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
    }), b);
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
      const a = Y(i.shape[e]);
      if (!a.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of a) {
        if (n.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        n.set(o, i);
      }
    }
    return new mt({
      typeName: v.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: n,
      ...E(s)
    });
  }
}
function Ct(r, e) {
  const t = ee(r), s = ee(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === m.object && s === m.object) {
    const n = S.objectKeys(e), i = S.objectKeys(r).filter((o) => n.indexOf(o) !== -1), a = { ...r, ...e };
    for (const o of i) {
      const u = Ct(r[o], e[o]);
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
      const a = r[i], o = e[i], u = Ct(a, o);
      if (!u.valid)
        return { valid: !1 };
      n.push(u.data);
    }
    return { valid: !0, data: n };
  } else return t === m.date && s === m.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class Ue extends k {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = (i, a) => {
      if (At(i) || At(a))
        return b;
      const o = Ct(i.value, a.value);
      return o.valid ? ((Ot(i) || Ot(a)) && t.dirty(), { status: t.value, value: o.data }) : (h(s, {
        code: f.invalid_intersection_types
      }), b);
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
Ue.create = (r, e, t) => new Ue({
  left: r,
  right: e,
  typeName: v.ZodIntersection,
  ...E(t)
});
class K extends k {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== m.array)
      return h(s, {
        code: f.invalid_type,
        expected: m.array,
        received: s.parsedType
      }), b;
    if (s.data.length < this._def.items.length)
      return h(s, {
        code: f.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), b;
    !this._def.rest && s.data.length > this._def.items.length && (h(s, {
      code: f.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const i = [...s.data].map((a, o) => {
      const u = this._def.items[o] || this._def.rest;
      return u ? u._parse(new W(s, a, s.path, o)) : null;
    }).filter((a) => !!a);
    return s.common.async ? Promise.all(i).then((a) => M.mergeArray(t, a)) : M.mergeArray(t, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new K({
      ...this._def,
      rest: e
    });
  }
}
K.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new K({
    items: r,
    typeName: v.ZodTuple,
    rest: null,
    ...E(e)
  });
};
class Ze extends k {
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
      }), b;
    const n = [], i = this._def.keyType, a = this._def.valueType;
    for (const o in s.data)
      n.push({
        key: i._parse(new W(s, o, s.path, o)),
        value: a._parse(new W(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? M.mergeObjectAsync(t, n) : M.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof k ? new Ze({
      keyType: e,
      valueType: t,
      typeName: v.ZodRecord,
      ...E(s)
    }) : new Ze({
      keyType: z.create(),
      valueType: e,
      typeName: v.ZodRecord,
      ...E(t)
    });
  }
}
class ot extends k {
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
      }), b;
    const n = this._def.keyType, i = this._def.valueType, a = [...s.data.entries()].map(([o, u], c) => ({
      key: n._parse(new W(s, o, s.path, [c, "key"])),
      value: i._parse(new W(s, u, s.path, [c, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of a) {
          const c = await u.key, d = await u.value;
          if (c.status === "aborted" || d.status === "aborted")
            return b;
          (c.status === "dirty" || d.status === "dirty") && t.dirty(), o.set(c.value, d.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const u of a) {
        const c = u.key, d = u.value;
        if (c.status === "aborted" || d.status === "aborted")
          return b;
        (c.status === "dirty" || d.status === "dirty") && t.dirty(), o.set(c.value, d.value);
      }
      return { status: t.value, value: o };
    }
  }
}
ot.create = (r, e, t) => new ot({
  valueType: e,
  keyType: r,
  typeName: v.ZodMap,
  ...E(t)
});
class _e extends k {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== m.set)
      return h(s, {
        code: f.invalid_type,
        expected: m.set,
        received: s.parsedType
      }), b;
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
          return b;
        d.status === "dirty" && t.dirty(), c.add(d.value);
      }
      return { status: t.value, value: c };
    }
    const o = [...s.data.values()].map((u, c) => i._parse(new W(s, u, s.path, c)));
    return s.common.async ? Promise.all(o).then((u) => a(u)) : a(o);
  }
  min(e, t) {
    return new _e({
      ...this._def,
      minSize: { value: e, message: g.toString(t) }
    });
  }
  max(e, t) {
    return new _e({
      ...this._def,
      maxSize: { value: e, message: g.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
_e.create = (r, e) => new _e({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: v.ZodSet,
  ...E(e)
});
class xe extends k {
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
      }), b;
    function s(o, u) {
      return st({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          rt(),
          Ee
        ].filter((c) => !!c),
        issueData: {
          code: f.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function n(o, u) {
      return st({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          rt(),
          Ee
        ].filter((c) => !!c),
        issueData: {
          code: f.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const i = { errorMap: t.common.contextualErrorMap }, a = t.data;
    if (this._def.returns instanceof ke) {
      const o = this;
      return U(async function(...u) {
        const c = new $([]), d = await o._def.args.parseAsync(u, i).catch((O) => {
          throw c.addIssue(s(u, O)), c;
        }), p = await Reflect.apply(a, this, d);
        return await o._def.returns._def.type.parseAsync(p, i).catch((O) => {
          throw c.addIssue(n(p, O)), c;
        });
      });
    } else {
      const o = this;
      return U(function(...u) {
        const c = o._def.args.safeParse(u, i);
        if (!c.success)
          throw new $([s(u, c.error)]);
        const d = Reflect.apply(a, this, c.data), p = o._def.returns.safeParse(d, i);
        if (!p.success)
          throw new $([n(d, p.error)]);
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
    return new xe({
      ...this._def,
      args: K.create(e).rest(pe.create())
    });
  }
  returns(e) {
    return new xe({
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
    return new xe({
      args: e || K.create([]).rest(pe.create()),
      returns: t || pe.create(),
      typeName: v.ZodFunction,
      ...E(s)
    });
  }
}
class Be extends k {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Be.create = (r, e) => new Be({
  getter: r,
  typeName: v.ZodLazy,
  ...E(e)
});
class Fe extends k {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return h(t, {
        received: t.data,
        code: f.invalid_literal,
        expected: this._def.value
      }), b;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Fe.create = (r, e) => new Fe({
  value: r,
  typeName: v.ZodLiteral,
  ...E(e)
});
function Or(r, e) {
  return new oe({
    values: r,
    typeName: v.ZodEnum,
    ...E(e)
  });
}
class oe extends k {
  constructor() {
    super(...arguments), Oe.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return h(t, {
        expected: S.joinValues(s),
        received: t.parsedType,
        code: f.invalid_type
      }), b;
    }
    if (nt(this, Oe) || kr(this, Oe, new Set(this._def.values)), !nt(this, Oe).has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return h(t, {
        received: t.data,
        code: f.invalid_enum_value,
        options: s
      }), b;
    }
    return U(e.data);
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
    return oe.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return oe.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
Oe = /* @__PURE__ */ new WeakMap();
oe.create = Or;
class $e extends k {
  constructor() {
    super(...arguments), Ce.set(this, void 0);
  }
  _parse(e) {
    const t = S.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== m.string && s.parsedType !== m.number) {
      const n = S.objectValues(t);
      return h(s, {
        expected: S.joinValues(n),
        received: s.parsedType,
        code: f.invalid_type
      }), b;
    }
    if (nt(this, Ce) || kr(this, Ce, new Set(S.getValidEnumValues(this._def.values))), !nt(this, Ce).has(e.data)) {
      const n = S.objectValues(t);
      return h(s, {
        received: s.data,
        code: f.invalid_enum_value,
        options: n
      }), b;
    }
    return U(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ce = /* @__PURE__ */ new WeakMap();
$e.create = (r, e) => new $e({
  values: r,
  typeName: v.ZodNativeEnum,
  ...E(e)
});
class ke extends k {
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
      }), b;
    const s = t.parsedType === m.promise ? t.data : Promise.resolve(t.data);
    return U(s.then((n) => this._def.type.parseAsync(n, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
ke.create = (r, e) => new ke({
  type: r,
  typeName: v.ZodPromise,
  ...E(e)
});
class q extends k {
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
            return b;
          const u = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return u.status === "aborted" ? b : u.status === "dirty" || t.value === "dirty" ? be(u.value) : u;
        });
      {
        if (t.value === "aborted")
          return b;
        const o = this._def.schema._parseSync({
          data: a,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? b : o.status === "dirty" || t.value === "dirty" ? be(o.value) : o;
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
        return o.status === "aborted" ? b : (o.status === "dirty" && t.dirty(), a(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? b : (o.status === "dirty" && t.dirty(), a(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (n.type === "transform")
      if (s.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!ge(a))
          return a;
        const o = n.transform(a.value, i);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((a) => ge(a) ? Promise.resolve(n.transform(a.value, i)).then((o) => ({ status: t.value, value: o })) : a);
    S.assertNever(n);
  }
}
q.create = (r, e, t) => new q({
  schema: r,
  typeName: v.ZodEffects,
  effect: e,
  ...E(t)
});
q.createWithPreprocess = (r, e, t) => new q({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: v.ZodEffects,
  ...E(t)
});
class G extends k {
  _parse(e) {
    return this._getType(e) === m.undefined ? U(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
G.create = (r, e) => new G({
  innerType: r,
  typeName: v.ZodOptional,
  ...E(e)
});
class ce extends k {
  _parse(e) {
    return this._getType(e) === m.null ? U(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ce.create = (r, e) => new ce({
  innerType: r,
  typeName: v.ZodNullable,
  ...E(e)
});
class ze extends k {
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
ze.create = (r, e) => new ze({
  innerType: r,
  typeName: v.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...E(e)
});
class Je extends k {
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
    return Pe(n) ? n.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new $(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new $(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Je.create = (r, e) => new Je({
  innerType: r,
  typeName: v.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...E(e)
});
class ct extends k {
  _parse(e) {
    if (this._getType(e) !== m.nan) {
      const s = this._getOrReturnCtx(e);
      return h(s, {
        code: f.invalid_type,
        expected: m.nan,
        received: s.parsedType
      }), b;
    }
    return { status: "valid", value: e.data };
  }
}
ct.create = (r) => new ct({
  typeName: v.ZodNaN,
  ...E(r)
});
const Bn = Symbol("zod_brand");
class Dt extends k {
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
class Ge extends k {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return i.status === "aborted" ? b : i.status === "dirty" ? (t.dirty(), be(i.value)) : this._def.out._parseAsync({
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
      return n.status === "aborted" ? b : n.status === "dirty" ? (t.dirty(), {
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
    return new Ge({
      in: e,
      out: t,
      typeName: v.ZodPipeline
    });
  }
}
class qe extends k {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (n) => (ge(n) && (n.value = Object.freeze(n.value)), n);
    return Pe(t) ? t.then((n) => s(n)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
qe.create = (r, e) => new qe({
  innerType: r,
  typeName: v.ZodReadonly,
  ...E(e)
});
function Qt(r, e) {
  const t = typeof r == "function" ? r(e) : typeof r == "string" ? { message: r } : r;
  return typeof t == "string" ? { message: t } : t;
}
function Cr(r, e = {}, t) {
  return r ? Te.create().superRefine((s, n) => {
    var i, a;
    const o = r(s);
    if (o instanceof Promise)
      return o.then((u) => {
        var c, d;
        if (!u) {
          const p = Qt(e, s), R = (d = (c = p.fatal) !== null && c !== void 0 ? c : t) !== null && d !== void 0 ? d : !0;
          n.addIssue({ code: "custom", ...p, fatal: R });
        }
      });
    if (!o) {
      const u = Qt(e, s), c = (a = (i = u.fatal) !== null && i !== void 0 ? i : t) !== null && a !== void 0 ? a : !0;
      n.addIssue({ code: "custom", ...u, fatal: c });
    }
  }) : Te.create();
}
const Fn = {
  object: C.lazycreate
};
var v;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(v || (v = {}));
const $n = (r, e = {
  message: `Input not instance of ${r.name}`
}) => Cr((t) => t instanceof r, e), Nr = z.create, Ir = ie.create, zn = ct.create, Jn = ae.create, Pr = je.create, qn = ye.create, Vn = it.create, Hn = De.create, Gn = Le.create, Wn = Te.create, Kn = pe.create, Qn = re.create, Xn = at.create, Yn = J.create, ei = C.create, ti = C.strictCreate, ri = Me.create, si = mt.create, ni = Ue.create, ii = K.create, ai = Ze.create, oi = ot.create, ci = _e.create, ui = xe.create, li = Be.create, di = Fe.create, fi = oe.create, hi = $e.create, pi = ke.create, Xt = q.create, mi = G.create, gi = ce.create, yi = q.createWithPreprocess, _i = Ge.create, vi = () => Nr().optional(), bi = () => Ir().optional(), wi = () => Pr().optional(), xi = {
  string: (r) => z.create({ ...r, coerce: !0 }),
  number: (r) => ie.create({ ...r, coerce: !0 }),
  boolean: (r) => je.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => ae.create({ ...r, coerce: !0 }),
  date: (r) => ye.create({ ...r, coerce: !0 })
}, Ei = b;
var X = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: Ee,
  setErrorMap: yn,
  getErrorMap: rt,
  makeIssue: st,
  EMPTY_PATH: _n,
  addIssueToContext: h,
  ParseStatus: M,
  INVALID: b,
  DIRTY: be,
  OK: U,
  isAborted: At,
  isDirty: Ot,
  isValid: ge,
  isAsync: Pe,
  get util() {
    return S;
  },
  get objectUtil() {
    return Rt;
  },
  ZodParsedType: m,
  getParsedType: ee,
  ZodType: k,
  datetimeRegex: Ar,
  ZodString: z,
  ZodNumber: ie,
  ZodBigInt: ae,
  ZodBoolean: je,
  ZodDate: ye,
  ZodSymbol: it,
  ZodUndefined: De,
  ZodNull: Le,
  ZodAny: Te,
  ZodUnknown: pe,
  ZodNever: re,
  ZodVoid: at,
  ZodArray: J,
  ZodObject: C,
  ZodUnion: Me,
  ZodDiscriminatedUnion: mt,
  ZodIntersection: Ue,
  ZodTuple: K,
  ZodRecord: Ze,
  ZodMap: ot,
  ZodSet: _e,
  ZodFunction: xe,
  ZodLazy: Be,
  ZodLiteral: Fe,
  ZodEnum: oe,
  ZodNativeEnum: $e,
  ZodPromise: ke,
  ZodEffects: q,
  ZodTransformer: q,
  ZodOptional: G,
  ZodNullable: ce,
  ZodDefault: ze,
  ZodCatch: Je,
  ZodNaN: ct,
  BRAND: Bn,
  ZodBranded: Dt,
  ZodPipeline: Ge,
  ZodReadonly: qe,
  custom: Cr,
  Schema: k,
  ZodSchema: k,
  late: Fn,
  get ZodFirstPartyTypeKind() {
    return v;
  },
  coerce: xi,
  any: Wn,
  array: Yn,
  bigint: Jn,
  boolean: Pr,
  date: qn,
  discriminatedUnion: si,
  effect: Xt,
  enum: fi,
  function: ui,
  instanceof: $n,
  intersection: ni,
  lazy: li,
  literal: di,
  map: oi,
  nan: zn,
  nativeEnum: hi,
  never: Qn,
  null: Gn,
  nullable: gi,
  number: Ir,
  object: ei,
  oboolean: wi,
  onumber: bi,
  optional: mi,
  ostring: vi,
  pipeline: _i,
  preprocess: yi,
  promise: pi,
  record: ai,
  set: ci,
  strictObject: ti,
  string: Nr,
  symbol: Vn,
  transformer: Xt,
  tuple: ii,
  undefined: Hn,
  union: ri,
  unknown: Kn,
  void: Xn,
  NEVER: Ei,
  ZodIssueCode: f,
  quotelessJson: gn,
  ZodError: $
});
const Yt = X.object({
  prompt: X.string().default(""),
  aspect_ratio: X.string().default("1:1"),
  num_outputs: X.number().int().default(1),
  num_inference_steps: X.number().int().gt(0).lt(5).default(4),
  seed: X.number().int().optional().default(() => Math.floor(Math.random() * 1e6)),
  output_format: X.string().default("jpg"),
  disable_safety_checker: X.boolean().default(!1),
  go_fast: X.boolean().default(!1)
});
class Ti extends mn {
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
      queryParams: Yt.parse({}),
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
    const s = this.getEndpoint("text2img"), n = Yt.parse({
      ...t,
      prompt: e
      // Always use the text parameter as the prompt
    });
    return this.submitTrackedJob(s, n, this.config.apiKey);
  }
}
class ki {
  constructor(e = {}) {
    w(this, "models");
    w(this, "config");
    this.config = te.getInstance(), te.update(e), this.models = {
      fluxschnell: new Ti()
      // Future models can be added here
    };
  }
  /** Get model from registry. Method is case insensitive */
  getModel(e) {
    e = e.toLowerCase().replace(/[^a-z0-9]/g, "");
    const t = Object.keys(this.models).find((s) => s.toLowerCase().replace(/[^a-z0-9]/g, "") === e);
    if (!t)
      throw new Error(`Model "${e}" not found. Available models: ${Object.keys(this.models).join(", ")}`);
    return this.models[t];
  }
  /**
   * Generate an image from text using a specified model.
   * Defaults to "fluxSchnell" if no model is provided.
   */
  text2img(e, t = "flux-schnell", s) {
    return this.getModel(t).text2img(e, s);
  }
}
class Si extends ki {
  constructor(t = {}) {
    super(t);
    w(this, "requestHandler");
    w(this, "jobManager");
    this.requestHandler = new jt(), this.jobManager = tt.getInstance(this.requestHandler);
  }
  /**
   * Set the API key globally
   */
  setApiKey(t) {
    te.update({ apiKey: t });
  }
  /**
   * Set the base URL globally
   */
  setBaseUrl(t) {
    te.update({ baseUrl: t });
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
const Vi = new Si();
export {
  Si as SocaitySDK,
  Vi as socaity
};
//# sourceMappingURL=socaity.es.js.map
