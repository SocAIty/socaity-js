var Ft = Object.defineProperty;
var $t = (n, e, t) => e in n ? Ft(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var g = (n, e, t) => $t(n, typeof e != "symbol" ? e + "" : e, t);
class tt extends Error {
  constructor(e = "Invalid API key format. API keys should start with 'sk_' and be 67 characters long.") {
    super(e), this.name = "ApiKeyError", Error.captureStackTrace && Error.captureStackTrace(this, tt);
  }
}
const H = class H {
  constructor(e = {}) {
    g(this, "apiKey");
    g(this, "baseUrl");
    g(this, "pollInterval");
    g(this, "maxRetries");
    this.apiKey = e.apiKey, this.baseUrl = "http://localhost:8000/v0", this.pollInterval = e.pollInterval || 5e3, this.maxRetries = e.maxRetries || 3;
  }
  /**
   * Get the global configuration instance
   */
  static getInstance() {
    return H.instance || (H.instance = new H()), H.instance;
  }
  /**
   * Updates global configuration with new values
   */
  static update(e) {
    if (e.apiKey !== void 0 && (!e.apiKey.startsWith("sk_") || e.apiKey.length != 67))
      throw new tt("API key is wrong. Get your API key from the Socaity https://www.socaity.ai dashboard.");
    const t = H.getInstance();
    Object.assign(t, e);
  }
};
g(H, "instance");
let Y = H;
var x = /* @__PURE__ */ ((n) => (n.CREATED = "CREATED", n.QUEUED = "QUEUED", n.PROCESSING = "PROCESSING", n.COMPLETED = "COMPLETED", n.FAILED = "FAILED", n.UNKNOWN = "UNKNOWN", n))(x || {}), T = /* @__PURE__ */ ((n) => (n.INITIALIZING = "INITIALIZING", n.PREPARING = "PREPARING", n.SENDING = "SENDING", n.TRACKING = "TRACKING", n.PROCESSING_RESULT = "PROCESSING_RESULT", n.COMPLETED = "COMPLETED", n.FAILED = "FAILED", n))(T || {});
class Bt {
  /**
   * Parse response into standardized job format
   * @param response - API response object or string
   * @returns Standardized SocaityJob object
   */
  async parse(e) {
    if (e == null)
      return this.createErrorJob("No response received");
    if (typeof e == "string")
      try {
        const t = JSON.parse(e);
        return this.parseObject(t);
      } catch {
        return {
          id: "",
          status: x.COMPLETED,
          progress: { progress: 1, message: null },
          result: e,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
      }
    return this.parseObject(e);
  }
  /**
   * Parse object responses into SocaityJob
   * @param response - Object to parse
   */
  async parseObject(e) {
    if (typeof e != "object" || e === null)
      return this.createErrorJob("Invalid response format");
    const t = e, r = typeof t.id == "string" ? t.id : "", s = this.parseStatus(t.status), a = this.parseProgress(t, s), i = typeof t.error == "string" ? t.error : null, o = this.parseDate(t.createdAt), c = this.parseDate(t.updatedAt);
    return {
      id: r,
      status: s,
      progress: a,
      result: t.result,
      error: i,
      createdAt: o,
      updatedAt: c
    };
  }
  /**
   * Creates a standard error job response
   * @param errorMessage - Error message to include
   */
  createErrorJob(e) {
    const t = /* @__PURE__ */ new Date();
    return {
      id: "",
      status: x.FAILED,
      progress: { progress: 0, message: e },
      result: null,
      error: e,
      createdAt: t,
      updatedAt: t
    };
  }
  /**
   * Parse date from various formats
   * @param dateValue - Date value to parse
   */
  parseDate(e) {
    if (e instanceof Date)
      return e;
    if (typeof e == "string" || typeof e == "number") {
      const t = new Date(e);
      if (!isNaN(t.getTime()))
        return t;
    }
    return /* @__PURE__ */ new Date();
  }
  /**
   * Parse status from different API formats
   * @param status - Status string to parse
   */
  parseStatus(e) {
    if (typeof e != "string" || !e)
      return x.UNKNOWN;
    const t = e.toUpperCase();
    return {
      COMPLETED: x.COMPLETED,
      SUCCEEDED: x.COMPLETED,
      FINISHED: x.COMPLETED,
      CREATED: x.CREATED,
      FAILED: x.FAILED,
      ERROR: x.FAILED,
      IN_PROGRESS: x.PROCESSING,
      PROCESSING: x.PROCESSING,
      RUNNING: x.PROCESSING,
      BOOTING: x.PROCESSING,
      QUEUED: x.QUEUED,
      PENDING: x.QUEUED,
      IN_QUEUE: x.QUEUED,
      STARTING: x.QUEUED
    }[t] || x.UNKNOWN;
  }
  /**
   * Parse progress from different API formats
   * @param response - Response object containing progress information
   * @param status - Parsed job status
   */
  parseProgress(e, t) {
    let r = 0, s = null;
    const a = e.progress;
    if (typeof a == "number")
      r = a;
    else if (typeof a == "string")
      try {
        r = parseFloat(a);
      } catch {
        r = 0;
      }
    else if (a && typeof a == "object") {
      const i = a;
      if (typeof i.progress == "number")
        r = i.progress;
      else if (typeof i.progress == "string")
        try {
          r = parseFloat(i.progress);
        } catch {
          r = 0;
        }
      s = typeof i.message == "string" ? i.message : null;
    }
    return isNaN(r) && (r = 0), r = Math.max(0, Math.min(1, r)), t === x.COMPLETED && (r = 1), !s && typeof e.message == "string" && (s = e.message), {
      progress: r,
      message: s
    };
  }
}
var zt = Object.defineProperty, Jt = (n, e, t) => e in n ? zt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, ue = (n, e, t) => Jt(n, typeof e != "symbol" ? e + "" : e, t);
function rt(n) {
  return n && typeof n == "object" && "file_name" in n && "content_type" in n && "content" in n;
}
const Z = typeof window > "u";
function Et(n) {
  try {
    const e = new URL(n);
    return e.protocol === "http:" || e.protocol === "https:";
  } catch {
    return !1;
  }
}
function Vt(n) {
  return n.startsWith("data:") || qt(n);
}
function qt(n) {
  return /^[A-Za-z0-9+/=]+$/.test(n) && n.length % 4 === 0;
}
async function xt(n) {
  if (!Z)
    return !1;
  try {
    return (await (await import("fs/promises")).stat(n)).isFile();
  } catch {
    return !1;
  }
}
async function kt(n) {
  if (n == null)
    return null;
  if (Array.isArray(n)) {
    const e = n.map((t) => kt(t));
    return Promise.all(e);
  }
  if (rt(n))
    try {
      return await new E().fromDict(n);
    } catch {
      return n;
    }
  return n;
}
class Q {
  /**
   * Create a MediaFile or specialized subclass from any supported data type.
   * Automatically detects data type and instantiates the appropriate class.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @returns Promise resolving to a MediaFile instance or specialized subclass
   */
  static async create(e) {
    if (e == null)
      throw new Error("Cannot create MediaFile from null or undefined data");
    const t = await Q._detectContentType(e);
    let r = G.default;
    return t && t.startsWith("image/") ? r = G.image : t && t.startsWith("audio/") ? r = G.audio : t && t.startsWith("video/") && (r = G.video), new r().fromAny(e);
  }
  /**
   * Detects content type from various data sources.
   * 
   * @param data - Data to detect content type from
   * @returns Promise resolving to the detected content type or null
   * @private
   */
  static async _detectContentType(e) {
    var t;
    if (e instanceof E)
      return e.getContentType();
    if (rt(e))
      return e.content_type;
    if (typeof e == "string" && Et(e)) {
      const r = (t = new URL(e).pathname.split(".").pop()) == null ? void 0 : t.toLowerCase();
      if (r) {
        const s = Q._getMimeTypeFromExtension(r);
        if (s) return s;
      }
      try {
        const s = await fetch(e, {
          method: "HEAD",
          headers: { "User-Agent": "MediaFile/1.0.0" }
        });
        if (s.ok) {
          const a = s.headers.get("content-type");
          if (a) return a;
        }
      } catch {
      }
    }
    if (typeof e == "string" && e.startsWith("data:")) {
      const r = e.match(/^data:([^;,]+)/);
      if (r && r[1])
        return r[1];
    }
    if (typeof e == "string" && typeof window > "u")
      try {
        const r = await import("fs/promises"), s = await import("path");
        await r.access(e);
        const a = s.extname(e).slice(1).toLowerCase();
        if (a) {
          const i = Q._getMimeTypeFromExtension(a);
          if (i) return i;
        }
      } catch {
      }
    return typeof Blob < "u" && e instanceof Blob ? e.type : null;
  }
  /**
   * Maps file extensions to MIME types.
   * 
   * @param extension - File extension without the dot
   * @returns The corresponding MIME type or null
   * @private
   */
  static _getMimeTypeFromExtension(e) {
    const t = {
      // Audio
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      aac: "audio/aac",
      flac: "audio/flac",
      m4a: "audio/mp4",
      // Image
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      bmp: "image/bmp",
      ico: "image/x-icon",
      // Video
      mp4: "video/mp4",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      mkv: "video/x-matroska",
      wmv: "video/x-ms-wmv",
      webm: "video/webm",
      "3gp": "video/3gpp",
      flv: "video/x-flv",
      // Other common types
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
    return e in t ? t[e] : null;
  }
}
class E {
  /**
   * Creates a new MediaFile instance.
   * 
   * @param file_name - Default filename to use
   * @param content_type - Default content type to use
   */
  constructor(e = "file", t = "application/octet-stream") {
    ue(this, "content_type"), ue(this, "file_name"), ue(this, "_content", null), this.content_type = t, this.file_name = e;
  }
  /**
   * Factory method to create a MediaFile from any supported data type.
   * This is kept for backward compatibility. New code should use MediaFileFactory.create().
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @returns Promise resolving to a MediaFile instance or specialized subclass
   * @deprecated Use MediaFileFactory.create() instead
   */
  static async create(e) {
    return Q.create(e);
  }
  /**
   * Load a file from any supported data type.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @param websafe - Prevents loading from file paths and malformatted base64 strings.
   * @returns Promise resolving to a MediaFile instance or null
   */
  async fromAny(e) {
    if (e == null)
      throw new Error("Cannot create MediaFile from null or undefined data");
    if (e instanceof E)
      return e;
    if (Z && this._isBuffer(e))
      return this.fromBytes(e);
    if (typeof Blob < "u" && e instanceof Blob) {
      const t = await e.arrayBuffer();
      return this.fromBytes(t);
    }
    if (e instanceof ArrayBuffer || e instanceof Uint8Array)
      return this.fromBytes(e);
    if (typeof e == "string") {
      if (Et(e))
        return await this.fromUrl(e);
      if (Vt(e))
        return this.fromBase64(e);
      if (await xt(e))
        return await this.fromFile(e);
      throw typeof e == "string" ? new Error("Invalid data type for MediaFile " + e) : new Error("Invalid data type for MediaFile");
    }
    return rt(e) ? await this.fromDict(e) : this;
  }
  /**
   * Load file from a file path (Node.js only).
   * 
   * @param filePath - Path to the file
   * @returns Promise resolving to the MediaFile instance
   */
  async fromFile(e) {
    if (!Z)
      throw new Error("Loading from file path is only supported in Node.js environment");
    try {
      const t = await (await import("fs/promises")).readFile(e), r = await import("path");
      return this.file_name = r.basename(e), this._content = this._bufferToArrayBuffer(t), this._setContentTypeFromFileName(), this;
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
    const r = async (s, a) => await fetch(s, {
      headers: a || {
        "User-Agent": "MediaFile/1.0.0"
      }
    });
    try {
      let s = await r(e, t);
      if (!s.ok) {
        if (s.status === 401 || s.status === 403) {
          const i = new URL(e);
          i.search = "", s = await r(i.toString(), t);
        }
        if (!s.ok)
          throw new Error(`HTTP error! Status: ${s.status}`);
      }
      this.content_type = s.headers.get("content-type") || "application/octet-stream";
      const a = s.headers.get("content-disposition");
      if (a) {
        const i = a.match(/filename=(?:['"]?)([^'";\n]+)/i);
        i && i[1] && (this.file_name = i[1]);
      }
      if (!this.file_name || this.file_name === "file") {
        const i = new URL(e).pathname.split("/"), o = i[i.length - 1];
        o && o.trim() !== "" ? this.file_name = decodeURIComponent(o) : this.file_name = "downloaded_file";
      }
      return this._content = await s.arrayBuffer(), this;
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
    const { data: t, mediaType: r } = this._parseBase64Uri(e);
    r && (this.content_type = r);
    try {
      return this._content = Z ? this._decodeBase64NodeJs(t) : this._decodeBase64Browser(t), this;
    } catch (s) {
      throw new Error(`Failed to decode base64 data: ${s.message}`);
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
      const t = new Uint8Array(e), r = new ArrayBuffer(t.byteLength);
      return new Uint8Array(r).set(t), this._content = r, this;
    }
    if (e instanceof Uint8Array)
      if (e.buffer instanceof SharedArrayBuffer) {
        const t = new Uint8Array(e);
        this._content = t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength);
      } else
        this._content = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
    else if (Z && Buffer.isBuffer(e))
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
    if (!e.content)
      throw new Error("Invalid FileResult object: missing content");
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
    if (this._ensureContent(), !Z)
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
    if (Z)
      t = Buffer.from(this._content).toString("base64");
    else {
      const r = new Uint8Array(this._content);
      let s = "";
      const a = 10240;
      for (let i = 0; i < r.length; i += a) {
        const o = r.subarray(i, Math.min(i + a, r.length));
        s += String.fromCharCode.apply(null, Array.from(o));
      }
      t = btoa(s);
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
    if (Z)
      try {
        const r = await import("fs/promises").then((i) => i.default || i), s = await import("path").then((i) => i.default || i);
        if (!s || typeof s.dirname != "function")
          throw new Error("Failed to load 'path' module.");
        const a = s.dirname(t);
        a !== "." && await r.mkdir(a, { recursive: !0 }).catch(() => {
        }), await r.writeFile(t, Buffer.from(this._content));
      } catch (r) {
        throw new Error(`Failed to save file: ${r.message}`);
      }
    else {
      const r = this.toBlob(), s = URL.createObjectURL(r), a = document.createElement("a");
      a.href = s, a.download = t, document.body.appendChild(a), a.click(), setTimeout(() => {
        document.body.removeChild(a), URL.revokeObjectURL(s);
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
        "application/json": "json",
        npz: "npz"
      };
      if (this.content_type in t)
        return t[this.content_type];
      if (Z)
        try {
          const r = require("mime-types").extension(this.content_type);
          if (r) return r;
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
    var e;
    if (!this.file_name) return;
    const t = (e = this.file_name.split(".").pop()) == null ? void 0 : e.toLowerCase();
    if (!t) return;
    if (Z)
      try {
        const s = require("mime-types").lookup(this.file_name);
        if (s) {
          this.content_type = s;
          return;
        }
      } catch {
      }
    const r = {
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
    t in r && (this.content_type = r[t]);
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
      const [t, r] = e.split(",", 2), s = t.match(/^data:([^;,]+)/), a = s ? s[1] : null;
      return { data: r, mediaType: a };
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
   * Check if an object is a Buffer.
   * 
   * @param obj - Object to check
   * @returns Whether the object is a Buffer
   * @private
   */
  _isBuffer(e) {
    return Z && Buffer.isBuffer(e);
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
    const t = atob(e), r = new Uint8Array(t.length);
    for (let s = 0; s < t.length; s++)
      r[s] = t.charCodeAt(s);
    return r.buffer;
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
}
const Tt = class N extends E {
  /**
   * Creates a new ImageFile instance.
   * 
   * @param file_name - Default filename to use
   * @param content_type - Default content type to use (defaults to image/png)
   */
  constructor(e = "image", t = "image/png") {
    super(e, t);
  }
  /**
   * Factory method to create an ImageFile from any supported data type.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @returns Promise resolving to an ImageFile instance
   */
  static async create(e) {
    if (e == null)
      throw new Error("Cannot create ImageFile from null or undefined data");
    return new N().fromAny(e);
  }
  /**
   * Override fromAny to ensure the content type is an image type.
   * 
   * @param data - Data to load
   * @returns Promise resolving to an ImageFile instance
   */
  async fromAny(e) {
    if (e instanceof N)
      return e;
    if (e instanceof E && !(e instanceof N)) {
      if (e.isEmpty())
        throw new Error("Cannot create ImageFile from empty MediaFile");
      return this.file_name = e.getFileName() || "image", this.content_type = e.getContentType(), this._content = e.read(), this._validateImageContentType(), this;
    }
    const t = await super.fromAny(e);
    return t.file_name = t.file_name || "image", t._validateImageContentType(), t;
  }
  /**
   * Creates an HTML image element from the image data.
   * 
   * @param options - Optional image element attributes (width, height, alt, className)
   * @returns HTML string containing an image element
   */
  toImageElement(e = {}) {
    if (typeof window > "u")
      throw new Error("Image elements are only available in browser environments");
    this._ensureContent();
    const t = this.toBase64(), { width: r, height: s, alt: a = "", className: i = "" } = e, o = r ? ` width="${r}"` : "", c = s ? ` height="${s}"` : "", d = i ? ` class="${i}"` : "";
    return `<img src="${t}" alt="${a}"${o}${c}${d}>`;
  }
  /**
   * Create an actual DOM Image element (browser only).
   * 
   * @param options - Optional image element attributes
   * @returns HTMLImageElement that can be added to the DOM
   */
  toDOMImageElement(e = {}) {
    if (typeof window > "u")
      throw new Error("DOM Image elements are only available in browser environments");
    this._ensureContent();
    const t = this.toBlob(), r = URL.createObjectURL(t), s = new Image();
    return e.width && (s.width = e.width), e.height && (s.height = e.height), e.alt && (s.alt = e.alt), e.className && (s.className = e.className), s.src = r, s.addEventListener("load", () => {
      setTimeout(() => URL.revokeObjectURL(r), 1e3);
    }), s;
  }
  /**
   * Get image dimensions (browser only).
   * 
   * @returns Promise resolving to an object with width and height
   */
  async getDimensions() {
    if (typeof window > "u")
      throw new Error("Getting image dimensions is only available in browser environments");
    return new Promise((e, t) => {
      const r = new Image();
      r.onload = () => {
        e({ width: r.naturalWidth, height: r.naturalHeight });
      }, r.onerror = () => {
        t(new Error("Failed to load image for dimension calculation"));
      };
      const s = this.toBlob(), a = URL.createObjectURL(s);
      r.src = a, r.addEventListener("load", () => {
        URL.revokeObjectURL(a);
      }, { once: !0 });
    });
  }
  /**
   * Validate that the content type is an image type.
   * If not, attempt to correct it based on file extension.
   * 
   * @private
   */
  _validateImageContentType() {
    var e;
    if (this.content_type.startsWith("image/"))
      return;
    const t = (e = this.extension) == null ? void 0 : e.toLowerCase();
    if (t && t in N.IMAGE_MIME_TYPES) {
      this.content_type = N.IMAGE_MIME_TYPES[t];
      return;
    }
    this._content && this._detectImageFormat();
  }
  /**
   * Attempt to detect image format from file header.
   * Updates content_type if a format is detected.
   * 
   * @private
   */
  _detectImageFormat() {
    const e = new Uint8Array(this._content).slice(0, 12);
    if (e[0] === 255 && e[1] === 216 && e[2] === 255) {
      this.content_type = N.IMAGE_MIME_TYPES.jpeg;
      return;
    }
    if (e[0] === 137 && e[1] === 80 && e[2] === 78 && e[3] === 71 && e[4] === 13 && e[5] === 10 && e[6] === 26 && e[7] === 10) {
      this.content_type = N.IMAGE_MIME_TYPES.png;
      return;
    }
    if (e[0] === 71 && e[1] === 73 && e[2] === 70 && e[3] === 56 && (e[4] === 55 || e[4] === 57) && e[5] === 97) {
      this.content_type = N.IMAGE_MIME_TYPES.gif;
      return;
    }
    if (e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70 && e[8] === 87 && e[9] === 69 && e[10] === 66 && e[11] === 80) {
      this.content_type = N.IMAGE_MIME_TYPES.webp;
      return;
    }
    if (this._content.byteLength > 100 && new TextDecoder().decode(new Uint8Array(this._content.slice(0, 100))).indexOf("<svg") !== -1) {
      this.content_type = N.IMAGE_MIME_TYPES.svg;
      return;
    }
    this.content_type = N.IMAGE_MIME_TYPES.png;
  }
};
ue(Tt, "IMAGE_MIME_TYPES", {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  ico: "image/x-icon",
  tiff: "image/tiff",
  tif: "image/tiff",
  avif: "image/avif"
});
let W = Tt;
const At = class L extends E {
  /**
   * Creates a new AudioFile instance.
   * 
   * @param file_name - Default filename to use
   * @param content_type - Default content type to use (defaults to audio/mpeg)
   */
  constructor(e = "audio", t = "audio/wav") {
    super(e, t);
  }
  /**
   * Factory method to create an AudioFile from any supported data type.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @returns Promise resolving to an AudioFile instance
   */
  static async create(e) {
    if (e == null)
      throw new Error("Cannot create AudioFile from null or undefined data");
    return new L().fromAny(e);
  }
  /**
   * Override fromAny to ensure the content type is an audio type.
   * 
   * @param data - Data to load
   * @returns Promise resolving to an AudioFile instance
   */
  async fromAny(e) {
    if (e instanceof L)
      return e;
    if (e instanceof E && !(e instanceof L)) {
      if (e.isEmpty())
        throw new Error("Cannot create AudioFile from empty MediaFile");
      return this.file_name = e.getFileName() || "audio", this.content_type = e.getContentType(), this._content = e.read(), this._validateAudioContentType(), this;
    }
    const t = await super.fromAny(e);
    return t.file_name = t.file_name || "audio", t._validateAudioContentType(), t;
  }
  /**
   * Creates an HTML audio element from the audio data.
   * 
   * @returns HTMLAudioElement that can be used for playback
   */
  toAudioElement() {
    if (typeof window > "u")
      throw new Error("Audio elements are only available in browser environments");
    this._ensureContent();
    const e = this.toBlob(), t = URL.createObjectURL(e), r = new Audio(t);
    return r.addEventListener("canplaythrough", () => {
      setTimeout(() => URL.revokeObjectURL(t), 1e3);
    }), r;
  }
  /**
   * Play the audio (browser only).
   * 
   * @returns Promise that resolves when audio playback starts
   */
  async play() {
    if (typeof window > "u")
      throw new Error("Audio playback is only available in browser environments");
    const e = this.toAudioElement();
    return new Promise((t, r) => {
      e.addEventListener("play", () => t()), e.addEventListener("error", (s) => r(new Error(`Audio playback error: ${s}`))), e.play().catch(r);
    });
  }
  /**
   * Get duration of the audio file in seconds (browser only).
   * 
   * @returns Promise resolving to the duration in seconds
   */
  async getDuration() {
    if (typeof window > "u")
      throw new Error("Getting audio duration is only available in browser environments");
    const e = this.toAudioElement();
    return new Promise((t) => {
      if (e.duration && !isNaN(e.duration)) {
        t(e.duration);
        return;
      }
      e.addEventListener("loadedmetadata", () => {
        t(e.duration);
      });
    });
  }
  /**
   * Create an embedded HTML audio player.
   * 
   * @param options - Options for the audio player (controls, autoplay, loop)
   * @returns HTML string containing an audio element
   */
  toHtmlPlayer(e = {}) {
    const t = this.toBase64(), { controls: r = !0, autoplay: s = !1, loop: a = !1 } = e;
    return `<audio 
      src="${t}" 
      ${r ? "controls" : ""} 
      ${s ? "autoplay" : ""} 
      ${a ? "loop" : ""}>
      Your browser does not support the audio element.
    </audio>`;
  }
  /**
   * Validate that the content type is an audio type.
   * If not, attempt to correct it based on file extension.
   * 
   * @private
   */
  _validateAudioContentType() {
    var e;
    if (this.content_type.startsWith("audio/"))
      return;
    const t = (e = this.extension) == null ? void 0 : e.toLowerCase();
    if (t && t in L.AUDIO_MIME_TYPES) {
      this.content_type = L.AUDIO_MIME_TYPES[t];
      return;
    }
    this._content && this._detectAudioFormat();
  }
  /**
   * Attempt to detect audio format from file header.
   * Updates content_type if a format is detected.
   * 
   * @private
   */
  _detectAudioFormat() {
    const e = new Uint8Array(this._content).slice(0, 12);
    if (e[0] === 73 && e[1] === 68 && e[2] === 51) {
      this.content_type = L.AUDIO_MIME_TYPES.mp3;
      return;
    }
    if (e[0] === 255 && (e[1] & 224) === 224) {
      this.content_type = L.AUDIO_MIME_TYPES.mp3;
      return;
    }
    if (e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70 && e[8] === 87 && e[9] === 65 && e[10] === 86 && e[11] === 69) {
      this.content_type = L.AUDIO_MIME_TYPES.wav;
      return;
    }
    if (e[0] === 79 && e[1] === 103 && e[2] === 103 && e[3] === 83) {
      this.content_type = L.AUDIO_MIME_TYPES.ogg;
      return;
    }
    if (e[0] === 102 && e[1] === 76 && e[2] === 97 && e[3] === 67) {
      this.content_type = L.AUDIO_MIME_TYPES.flac;
      return;
    }
    this.content_type = L.AUDIO_MIME_TYPES.mp3;
  }
};
ue(At, "AUDIO_MIME_TYPES", {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  aac: "audio/aac",
  flac: "audio/flac",
  m4a: "audio/mp4",
  webm: "audio/webm"
});
let $ = At;
const It = class j extends E {
  /**
   * Creates a new VideoFile instance.
   * 
   * @param file_name - Default filename to use
   * @param content_type - Default content type to use (defaults to video/mp4)
   */
  constructor(e = "video", t = "video/mp4") {
    super(e, t);
  }
  /**
   * Factory method to create a VideoFile from any supported data type.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @returns Promise resolving to a VideoFile instance
   */
  static async create(e) {
    if (e == null)
      throw new Error("Cannot create VideoFile from null or undefined data");
    return new j().fromAny(e);
  }
  /**
   * Override fromAny to ensure the content type is a video type.
   * 
   * @param data - Data to load
   * @returns Promise resolving to a VideoFile instance
   */
  async fromAny(e) {
    if (e instanceof j)
      return e;
    if (e instanceof E && !(e instanceof j)) {
      if (e.isEmpty())
        throw new Error("Cannot create VideoFile from empty MediaFile");
      return this.file_name = e.getFileName() || "video", this.content_type = e.getContentType(), this._content = e.read(), this._validateVideoContentType(), this;
    }
    const t = await super.fromAny(e);
    return t.file_name = t.file_name || "video", t._validateVideoContentType(), t;
  }
  /**
   * Creates an HTML video element from the video data.
   * 
   * @returns HTMLVideoElement that can be used for playback
   */
  toVideoElement() {
    if (typeof window > "u")
      throw new Error("Video elements are only available in browser environments");
    this._ensureContent();
    const e = this.toBlob(), t = URL.createObjectURL(e), r = document.createElement("video");
    return r.src = t, r.addEventListener("loadedmetadata", () => {
      setTimeout(() => URL.revokeObjectURL(t), 1e3);
    }), r;
  }
  /**
   * Play the video (browser only).
   * 
   * @returns Promise that resolves when video playback starts
   */
  async play() {
    if (typeof window > "u")
      throw new Error("Video playback is only available in browser environments");
    const e = this.toVideoElement();
    return new Promise((t, r) => {
      e.addEventListener("play", () => t()), e.addEventListener("error", (s) => r(new Error(`Video playback error: ${s}`))), e.play().catch(r);
    });
  }
  /**
   * Get duration of the video file in seconds (browser only).
   * 
   * @returns Promise resolving to the duration in seconds
   */
  async getDuration() {
    if (typeof window > "u")
      throw new Error("Getting video duration is only available in browser environments");
    const e = this.toVideoElement();
    return new Promise((t) => {
      if (e.duration && !isNaN(e.duration)) {
        t(e.duration);
        return;
      }
      e.addEventListener("loadedmetadata", () => {
        t(e.duration);
      });
    });
  }
  /**
   * Get dimensions of the video (width and height).
   * 
   * @returns Promise resolving to an object with width and height properties
   */
  async getDimensions() {
    if (typeof window > "u")
      throw new Error("Getting video dimensions is only available in browser environments");
    const e = this.toVideoElement();
    return new Promise((t) => {
      if (e.videoWidth && e.videoHeight) {
        t({ width: e.videoWidth, height: e.videoHeight });
        return;
      }
      e.addEventListener("loadedmetadata", () => {
        t({ width: e.videoWidth, height: e.videoHeight });
      });
    });
  }
  /**
   * Create a thumbnail from the video at a specific time point.
   * 
   * @param timeSeconds - Time in seconds for the thumbnail (defaults to 0)
   * @returns Promise resolving to a Blob containing the thumbnail image
   */
  async createThumbnail(e = 0) {
    if (typeof window > "u")
      throw new Error("Creating thumbnails is only available in browser environments");
    const t = this.toVideoElement();
    return new Promise((r, s) => {
      t.addEventListener("loadedmetadata", async () => {
        try {
          t.currentTime = e, await new Promise((o) => {
            const c = () => {
              t.removeEventListener("seeked", c), o();
            };
            t.addEventListener("seeked", c);
          });
          const a = document.createElement("canvas");
          a.width = t.videoWidth, a.height = t.videoHeight;
          const i = a.getContext("2d");
          if (!i)
            throw new Error("Failed to get canvas context");
          i.drawImage(t, 0, 0, a.width, a.height), a.toBlob((o) => {
            o ? r(o) : s(new Error("Failed to create thumbnail blob"));
          }, "image/jpeg", 0.95);
        } catch (a) {
          s(a);
        }
      }), t.addEventListener("error", (a) => {
        s(new Error(`Video loading error: ${a}`));
      });
    });
  }
  /**
   * Create an embedded HTML video player.
   * 
   * @param options - Options for the video player
   * @returns HTML string containing a video element
   */
  toHtmlPlayer(e = {}) {
    const t = this.toBase64(), {
      controls: r = !0,
      autoplay: s = !1,
      loop: a = !1,
      muted: i = !1,
      width: o,
      height: c,
      poster: d
    } = e;
    return `<video 
      src="${t}" 
      ${r ? "controls" : ""} 
      ${s ? "autoplay" : ""} 
      ${a ? "loop" : ""} 
      ${i ? "muted" : ""}
      ${o ? `width="${o}"` : ""} 
      ${c ? `height="${c}"` : ""}
      ${d ? `poster="${d}"` : ""}>
      Your browser does not support the video element.
    </video>`;
  }
  /**
   * Validate that the content type is a video type.
   * If not, attempt to correct it based on file extension.
   * 
   * @private
   */
  _validateVideoContentType() {
    var e;
    if (this.content_type.startsWith("video/"))
      return;
    const t = (e = this.extension) == null ? void 0 : e.toLowerCase();
    if (t && t in j.VIDEO_MIME_TYPES) {
      this.content_type = j.VIDEO_MIME_TYPES[t];
      return;
    }
    this._content && this._detectVideoFormat();
  }
  /**
   * Attempt to detect video format from file header.
   * Updates content_type if a format is detected.
   * 
   * @private
   */
  _detectVideoFormat() {
    const e = new Uint8Array(this._content).slice(0, 16);
    if (e[4] === 102 && e[5] === 116 && e[6] === 121 && e[7] === 112) {
      this.content_type = j.VIDEO_MIME_TYPES.mp4;
      return;
    }
    if (e[4] === 119 && e[5] === 105 && e[6] === 100 && e[7] === 101 || e[4] === 109 && e[5] === 100 && e[6] === 97 && e[7] === 116 || e[4] === 102 && e[5] === 114 && e[6] === 101 && e[7] === 101 || e[4] === 112 && e[5] === 110 && e[6] === 111 && e[7] === 116 || e[4] === 115 && e[5] === 107 && e[6] === 105 && e[7] === 112 || e[4] === 109 && e[5] === 111 && e[6] === 111 && e[7] === 118) {
      this.content_type = j.VIDEO_MIME_TYPES.mov;
      return;
    }
    if (e[0] === 26 && e[1] === 69 && e[2] === 223 && e[3] === 163) {
      this.content_type = j.VIDEO_MIME_TYPES.webm;
      return;
    }
    if (e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70 && e[8] === 65 && e[9] === 86 && e[10] === 73 && e[11] === 32) {
      this.content_type = j.VIDEO_MIME_TYPES.avi;
      return;
    }
    if (e[0] === 70 && e[1] === 76 && e[2] === 86) {
      this.content_type = j.VIDEO_MIME_TYPES.flv;
      return;
    }
    if (e[4] === 102 && e[5] === 116 && e[6] === 121 && e[7] === 112 && e[8] === 51 && e[9] === 103 && e[10] === 112) {
      this.content_type = j.VIDEO_MIME_TYPES["3gp"];
      return;
    }
    this.content_type = j.VIDEO_MIME_TYPES.mp4;
  }
};
ue(It, "VIDEO_MIME_TYPES", {
  mp4: "video/mp4",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  wmv: "video/x-ms-wmv",
  webm: "video/webm",
  "3gp": "video/3gpp",
  flv: "video/x-flv"
});
let Je = It;
const G = {};
G.default = E;
G.image = W;
G.audio = $;
G.video = Je;
G.media = E;
typeof window < "u" && (window.MediaFile = E, window.ImageFile = W, window.AudioFile = $, window.AudioFile = Je);
typeof module < "u" && typeof module.exports < "u" && (module.exports = { MediaFile: E, ImageFile: W, AudioFile: $, VideoFile: Je, MediaFileFactory: Q });
class Gt {
  // 60 seconds timeout for uploads
  /**
   * Create a new FastCloud instance
   * @param config FastCloud configuration
   */
  constructor(e) {
    g(this, "uploadEndpoint");
    g(this, "apiKey");
    g(this, "defaultTimeout", 6e4);
    this.uploadEndpoint = e.uploadEndpoint || "https://api.socaity.ai/v0/files", this.apiKey = e.apiKey;
  }
  setApiKey(e) {
    this.apiKey = e;
  }
  /**
   * Get authentication headers for requests
   * @returns Headers object with authentication
   */
  getAuthHeaders() {
    return { Authorization: `Bearer ${this.apiKey}` };
  }
  /**
   * Process the upload response to extract file URLs
   * @param response Response from the upload endpoint
   * @returns Array of temporary upload URLs
   */
  async processUploadResponse(e) {
    if (e.status === 401)
      throw new Error("Unauthorized: Invalid API key");
    if (!e.ok)
      throw new Error(`Failed to get temporary upload URL: ${e.status} ${e.statusText}`);
    try {
      const t = await e.text(), r = JSON.parse(t);
      return Array.isArray(r) ? r : [r];
    } catch (t) {
      throw console.error("Error parsing response:", t), new Error("Failed to parse response body as JSON");
    }
  }
  /**
   * Upload a file to a temporary URL
   * @param sasUrl Temporary URL for uploading
   * @param file File to upload
   */
  async uploadToTemporaryUrl(e, t) {
    const r = {
      "x-ms-blob-type": "BlockBlob",
      "x-ms-if-none-match": "*"
    }, s = t instanceof E ? await t.toArrayBuffer() : t, a = await fetch(e, {
      method: "PUT",
      headers: r,
      body: s
    });
    if (a.status !== 201)
      throw new Error(`Failed to upload to temporary URL ${e}. Response: ${a.statusText}`);
  }
  /**
   * Upload a single file
   * @param file File to upload
   * @returns the URLs of the uploaded files. (If one file is uploaded, the return value is an array with one URL)
   */
  async upload(e) {
    const t = Array.isArray(e) ? e : [e], r = t.map((c) => c.extension).filter((c) => c !== null), s = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders()
    }, a = await fetch(this.uploadEndpoint, {
      method: "POST",
      headers: s,
      body: JSON.stringify({
        n_files: t.length,
        file_extensions: r.length > 0 ? r : void 0
      }),
      signal: AbortSignal.timeout(this.defaultTimeout)
    }), i = await this.processUploadResponse(a), o = i.map(
      (c, d) => this.uploadToTemporaryUrl(c, t[d])
    );
    return await Promise.all(o), i;
  }
  /**
   * Download a file from a URL
   * @param url URL to download from
   * @param savePath Optional path to save the file to
   * @returns MediaFile object or save path if specified
   */
  async download(e, t) {
    const r = await new E(e).fromUrl(e, this.getAuthHeaders());
    return t ? (await r.save(t), t) : r;
  }
}
class Ct {
  constructor() {
    g(this, "config");
    g(this, "uploadFileThresholdMB", 1);
    g(this, "maxFileUploadLimitMB", 1e3);
    g(this, "fastCloud");
    g(this, "abortController");
    g(this, "responseParser");
    this.config = Y.getInstance(), this.abortController = new AbortController(), this.responseParser = new Bt(), this.fastCloud = new Gt({
      uploadEndpoint: `${this.config.baseUrl}/files`,
      apiKey: this.config.apiKey ? this.config.apiKey : ""
    });
  }
  /**
   * Match request parameters against defined parameters
   * @param definingParams Expected parameters
   * @param params Actual parameters
   */
  matchParams(e, t) {
    const r = {};
    for (const [s, a] of Object.entries(e))
      s in t ? r[s] = t[s] : a !== void 0 && (r[s] = a);
    return r;
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
   * Parse file parameters for the request
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   * @returns Processed file parameters
   */
  async parseFileParams(e, t) {
    if (!e.fileParams)
      return {};
    const r = this.matchParams(e.fileParams, t), s = {};
    try {
      let a = 0;
      const i = {};
      for (const [o, c] of Object.entries(r))
        if (typeof c == "string" && c.startsWith("http"))
          s[o] = c;
        else {
          let d = c;
          try {
            d = c instanceof E ? c : await Q.create(c);
          } catch (p) {
            console.log(`Failed to convert ${o} to MediaFile`, p);
          }
          if (!(d instanceof E))
            continue;
          i[o] = d, a += d.fileSize("mb");
        }
      if (a > this.maxFileUploadLimitMB)
        throw new Error(`Total file size exceeds maximum limit of ${this.maxFileUploadLimitMB}MB`);
      if (a > this.uploadFileThresholdMB) {
        const o = Object.values(i), c = await this.fastCloud.upload(o);
        Object.keys(i).forEach((d, p) => {
          s[d] = c[p];
        });
      } else
        for (const [o, c] of Object.entries(i))
          s[o] = c.toBlob();
      return s;
    } catch (a) {
      throw new Error(`File parameter processing failed: ${a instanceof Error ? a.message : String(a)}`);
    }
  }
  /**
   * Validates that an API key is available
   * @private
   */
  validateAPIKey(e) {
    const t = e || this.config.apiKey;
    if (!t)
      throw new Error("API key not provided");
    return this.fastCloud.setApiKey(t), t;
  }
  /**
   * Build query string from parameters
   * @private
   */
  buildQueryString(e) {
    if (!e || Object.keys(e).length === 0) return "";
    const t = new URLSearchParams();
    for (const [s, a] of Object.entries(e))
      a != null && (typeof a == "object" ? t.append(s, JSON.stringify(a)) : t.append(s, String(a)));
    const r = t.toString();
    return r ? `?${r}` : "";
  }
  /**
   * Format error response from fetch
   * @private
   */
  async formatErrorResponse(e) {
    const t = e.status;
    let r;
    try {
      const s = e.headers.get("content-type");
      if (s && s.includes("application/json")) {
        const a = await e.json();
        r = JSON.stringify(a);
      } else
        r = await e.text();
    } catch {
      r = "Could not parse error response";
    }
    return new Error(`API error (${t}): ${r}`);
  }
  /**
   * Send a request to the API
   * @param path API endpoint path
   * @param method HTTP method
   * @param queryParams URL query parameters
   * @param bodyParams Request body parameters
   * @param apiKey API key for authentication
   * @param fileParams Optional files to upload
   */
  async sendRequest(e, t = "POST", r = {}, s = {}, a = {}, i) {
    const o = this.validateAPIKey(i);
    this.abortController = new AbortController();
    const { signal: c } = this.abortController, d = {
      Authorization: `Bearer ${o}`
    };
    let p = `${this.config.baseUrl}/${e}`, A = null;
    if (t === "GET") {
      const S = { ...r, ...s, ...a };
      p += this.buildQueryString(S);
    } else if (Object.keys(a).length > 0) {
      p += this.buildQueryString({ ...r, ...s });
      const R = new FormData();
      Object.entries(a).forEach(([Ne, Ge]) => {
        Ge != null && R.append(Ne, Ge);
      }), A = R;
    } else
      p += this.buildQueryString(r), d["Content-Type"] = "application/json", A = Object.keys(s).length > 0 ? JSON.stringify(s) : null;
    try {
      const S = setTimeout(() => {
        this.abort();
      }, 3e4), R = await fetch(p, {
        method: t,
        headers: d,
        body: A,
        signal: c
      });
      if (clearTimeout(S), !R.ok)
        throw await this.formatErrorResponse(R);
      const Ne = R.headers.get("content-type");
      return Ne && Ne.includes("application/json") ? await R.json() : await R.text();
    } catch (S) {
      throw S instanceof DOMException && S.name === "AbortError" ? new Error("Request canceled") : S instanceof Error ? S : new Error(`Network error: ${String(S)}`);
    }
  }
  /**
   * Make a request to a specific endpoint
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   * @param apiKey API key
   */
  async request_endpoint(e, t, r) {
    const s = this.parseQueryParams(e, t), a = this.parseBodyParams(e, t), i = await this.parseFileParams(e, t), o = await this.sendRequest(
      e.path,
      e.method,
      s,
      a,
      i,
      r
    );
    return this.responseParser.parse(o);
  }
  async refresh_status(e) {
    const t = await this.sendRequest("status", "POST", { job_id: e });
    return this.responseParser.parse(t);
  }
  /**
   * Abort any ongoing requests
   */
  abort() {
    this.abortController.abort(), this.abortController = new AbortController();
  }
}
const se = class se {
  /**
   * Private constructor to enforce singleton pattern
   * @param requestHandler - RequestHandler for API communication
   */
  constructor(e) {
    g(this, "requestHandler");
    g(this, "config");
    g(this, "jobs");
    g(this, "mediaHandler");
    this.requestHandler = e, this.config = Y.getInstance(), this.jobs = /* @__PURE__ */ new Map(), this.mediaHandler = new E();
  }
  /**
   * Get the singleton instance of JobManager
   * @param requestHandler - Optional RequestHandler to use when creating the instance
   * @returns The JobManager instance
   */
  static getInstance(e) {
    return se.instance || (e || (e = new Ct()), se.instance = new se(e)), se.instance;
  }
  /**
   * Submit a new job to the API
   * @param endpoint - API endpoint to call
   * @param params - Parameters for the job
   * @param apiKey - Optional API key to use for this request
   * @param file - Optional file to include
   * @returns Promise resolving to the created job
   */
  async submitJob(e, t, r) {
    try {
      const s = await this.requestHandler.request_endpoint(e, t, r);
      return this.jobs.set(s.id, s), s;
    } catch (s) {
      throw s instanceof Error ? s : new Error(`Failed to submit job: ${String(s)}`);
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
        const r = await this.requestHandler.refresh_status(e.id);
        if (this.jobs.set(e.id, r), r.status === x.COMPLETED)
          return r.result;
        if (r.status === x.FAILED)
          throw new Error(`Job failed: ${r.error}`);
        await new Promise((s) => setTimeout(s, this.config.pollInterval));
      } catch (r) {
        if (t++, t >= this.config.maxRetries)
          throw r;
        await new Promise((s) => setTimeout(s, this.config.pollInterval * t));
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
      (t.status === x.COMPLETED || t.status === x.FAILED) && this.jobs.delete(e);
  }
};
g(se, "instance");
let Le = se;
const _e = typeof process < "u" && process.stdout && process.stdout.clearLine;
let fe;
if (_e)
  try {
    fe = require("cli-progress");
  } catch {
    console.warn("cli-progress package not found. Using basic console output for progress.");
  }
const ne = class ne {
  constructor() {
    g(this, "multiBar");
    g(this, "bars", /* @__PURE__ */ new Map());
    g(this, "isInitialized", !1);
    _e && fe && (this.multiBar = new fe.MultiBar({
      clearOnComplete: !1,
      hideCursor: !0,
      format: "{bar} {percentage}% | {jobId} | {phase} | {message}"
    }), this.isInitialized = !0);
  }
  static getInstance() {
    return ne.instance || (ne.instance = new ne()), ne.instance;
  }
  createBar(e, t) {
    if (!this.isInitialized) return null;
    const r = this.multiBar.create(100, 0, {
      jobId: e,
      phase: t,
      message: "Starting..."
    });
    return this.bars.set(e, r), r;
  }
  updateBar(e, t, r) {
    const s = this.bars.get(e);
    s && s.update(t, r);
  }
  removeBar(e) {
    const t = this.bars.get(e);
    t && (t.stop(), this.multiBar.remove(t), this.bars.delete(e));
  }
  stopAll() {
    this.isInitialized && (this.multiBar.stop(), this.bars.clear());
  }
};
g(ne, "instance");
let Ye = ne;
class Wt {
  constructor(e, t, r, s, a = !0) {
    g(this, "apiJob");
    g(this, "endpoint");
    g(this, "processingState");
    g(this, "jobManager");
    g(this, "result", null);
    g(this, "error", null);
    g(this, "completed", !1);
    g(this, "resolvePromise");
    g(this, "rejectPromise");
    g(this, "promise");
    g(this, "eventListeners", /* @__PURE__ */ new Map());
    g(this, "verbose");
    g(this, "progressBar", null);
    g(this, "progressBarManager");
    g(this, "parseResultCallbacks", []);
    // Keep track of the last logged message to avoid duplicates
    g(this, "_lastLoggedMessage", null);
    this.apiJob = e, this.jobManager = t, this.endpoint = r, this.verbose = a, this.processingState = {
      phase: T.INITIALIZING,
      progress: 0
    }, this.progressBarManager = Ye.getInstance(), this.promise = new Promise((i, o) => {
      this.resolvePromise = i, this.rejectPromise = o;
    }), s && this.onParseResult(s), setTimeout(() => this.startTracking(), 0), this.verbose && this.initProgressDisplay();
  }
  /**
   * Initialize the progress display
   */
  initProgressDisplay() {
    this.verbose && (_e && fe ? (this.progressBar = this.progressBarManager.createBar(
      this.apiJob.id || "initializing",
      this.processingState.phase
    ), this.updateProgressDisplay()) : this.logProgress());
  }
  /**
   * Update the progress display based on current state
   */
  updateProgressDisplay() {
    if (!this.verbose) return;
    const e = this.processingState.phase, t = this.calculateProgressPercent(), r = this.formatProgressMessage();
    _e && fe && this.progressBar ? this.progressBarManager.updateBar(this.apiJob.id, t, {
      phase: e,
      message: r.replace(/^.*\| /, "")
      // Remove the progress percentage part
    }) : this.logProgress();
  }
  /**
   * Calculate progress percentage based on current state
   */
  calculateProgressPercent() {
    var t;
    const e = this.processingState.phase;
    if (e === T.TRACKING && ((t = this.apiJob.progress) != null && t.progress))
      return Math.round(this.apiJob.progress.progress * 100);
    switch (e) {
      case T.INITIALIZING:
        return 0;
      case T.PREPARING:
        return 5;
      case T.SENDING:
        return 10;
      case T.TRACKING:
        return 15;
      case T.PROCESSING_RESULT:
        return 90;
      case T.COMPLETED:
        return 100;
      case T.FAILED:
        return 100;
      default:
        return 0;
    }
  }
  /**
   * Format a human-readable progress message
   */
  formatProgressMessage() {
    var r;
    const e = this.processingState.phase, t = this.apiJob.id || "initializing";
    if (e === T.INITIALIZING || e === T.PREPARING || e === T.SENDING)
      return `${e} job | API: ${this.endpoint.path}`;
    if (e === T.TRACKING) {
      const s = this.apiJob.progress ? `${Math.round(this.apiJob.progress.progress * 100)}%` : "unknown";
      let a = `Job ${t} | Progress: ${s} | API: ${this.endpoint.path}`;
      return (r = this.apiJob.progress) != null && r.message && (a += ` | ${this.apiJob.progress.message}`), a;
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
    _e && fe && this.progressBar && (this.progressBarManager.removeBar(this.apiJob.id), this.progressBar = null);
    const e = this.processingState.phase;
    e === T.COMPLETED ? console.log(`✓ Job ${this.apiJob.id} completed successfully (${this.endpoint.path})`) : e === T.FAILED && console.log(`✗ Job ${this.apiJob.id} failed: ${this.processingState.message} (${this.endpoint.path})`);
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
    const r = this.eventListeners.get(e);
    r && r.forEach((s) => s(...t));
  }
  /**
   * Poll for job status updates
   */
  async pollJobStatus() {
    if (!(this.completed || !this.apiJob.id))
      try {
        const e = await this.jobManager.requestHandler.refresh_status(this.apiJob.id);
        if (!e) {
          setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
          return;
        }
        if (this.apiJob = e, this.emitJobUpdate(), this.verbose && this.updateProgressDisplay(), e.status === x.COMPLETED) {
          this.updateProcessingState(T.PROCESSING_RESULT, 0.9, "Processing result");
          try {
            this.result = await kt(e.result), this.result = await this.runParseResultCallbacks(this.result), this.complete();
          } catch (t) {
            this.fail(t instanceof Error ? t : new Error(String(t)));
          }
        } else e.status === x.FAILED ? (this.updateProcessingState(T.FAILED, 1, e.error || "Job failed"), this.fail(new Error(e.error || "Job failed with no error message"))) : setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
      } catch (e) {
        console.error("Error polling job status:", e), setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
      }
  }
  /**
   * Start tracking the job
   */
  startTracking() {
    this.updateProcessingState(T.TRACKING, 0, "Tracking job status"), this.pollJobStatus();
  }
  /**
   * Mark the job as completed
   */
  complete() {
    this.updateProcessingState(T.COMPLETED, 1, "Job completed"), this.cleanup(), this.completed = !0, this.emit("completed", this.result), this.resolvePromise(this.result);
  }
  /**
   * Mark the job as failed
   */
  fail(e) {
    this.updateProcessingState(T.FAILED, 1, e.message), this.cleanup(), this.completed = !0, this.error = e, this.emit("failed", e), this.rejectPromise(e);
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
  updateProcessingState(e, t, r) {
    this.processingState = {
      phase: e,
      progress: t,
      message: r
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
   * Register a callback for custom post-processing of the job result
   */
  onParseResult(e) {
    return this.parseResultCallbacks.push(e), this;
  }
  /**
   * Run all registered parse result callbacks
   */
  async runParseResultCallbacks(e) {
    let t = e;
    for (const r of this.parseResultCallbacks) {
      const s = await r(t);
      s !== void 0 && (t = s);
    }
    return t;
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
const O = class O {
  constructor() {
    g(this, "registeredClients", /* @__PURE__ */ new Map());
    g(this, "clientConstructors", /* @__PURE__ */ new Map());
  }
  static getInstance() {
    return O.instance || (O.instance = new O()), O.instance;
  }
  static registerClientType(e, t) {
    const r = O.getInstance(), s = O.normalizeClientName(e);
    r.clientConstructors.set(s, t);
  }
  static registerClient(e) {
    const t = O.getInstance(), r = O.normalizeClientName(e.name);
    t.registeredClients.set(r, e);
  }
  static getClient(e) {
    const t = O.getInstance(), r = O.normalizeClientName(e);
    let s = t.registeredClients.get(r);
    if (!s) {
      const a = t.clientConstructors.get(r);
      if (!a)
        throw new Error(
          `Client "${e}" not found. Available clients: ${Array.from(t.clientConstructors.keys()).join(", ")}`
        );
      s = new a(), t.registeredClients.set(r, s);
    }
    return s;
  }
  static getAvailableClients() {
    const e = O.getInstance();
    return Array.from(e.clientConstructors.keys());
  }
  static normalizeClientName(e) {
    return e.toLowerCase().replace(/[^a-z0-9-]/g, "");
  }
};
g(O, "instance");
let I = O;
class Ve {
  constructor(e) {
    g(this, "requestHandler");
    g(this, "config");
    g(this, "endpoints");
    g(this, "jobManager");
    // Name of the API client. Has influence on path variable in the requests which will be formatted like /api/v1/{name}/{endpoint}
    g(this, "name");
    this.name = this.sanitizePath(e), this.config = Y.getInstance(), this.requestHandler = new Ct(), this.endpoints = /* @__PURE__ */ new Map(), this.jobManager = Le.getInstance(this.requestHandler), this.registerEndpoints(), I.registerClient(this);
  }
  sanitizePath(e) {
    return !e || typeof e != "string" ? "" : e.toLowerCase().trim().replace(/\s+/g, " ").replace(/\//g, "-").replace(/[\s_]/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/\-+/g, "-").replace(/^\-+|\-+$/g, "").trim();
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
    Y.update(e);
  }
  /**
   * Submit a job to the API and return a TrackedJob for monitoring
   * @param endpoint - API endpoint path
   * @param params - Request parameters
   * @param apiKey - Optional API key to override the default
   * @param file - Optional file to upload
   * @returns A TrackedJob for monitoring the job
   */
  async submitTrackedJob(e, t, r, s, a = !0) {
    const i = await this.jobManager.submitJob(e, t, s);
    return new Wt(i, this.jobManager, e, r, a);
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
var w;
(function(n) {
  n.assertEqual = (s) => s;
  function e(s) {
  }
  n.assertIs = e;
  function t(s) {
    throw new Error();
  }
  n.assertNever = t, n.arrayToEnum = (s) => {
    const a = {};
    for (const i of s)
      a[i] = i;
    return a;
  }, n.getValidEnumValues = (s) => {
    const a = n.objectKeys(s).filter((o) => typeof s[s[o]] != "number"), i = {};
    for (const o of a)
      i[o] = s[o];
    return n.objectValues(i);
  }, n.objectValues = (s) => n.objectKeys(s).map(function(a) {
    return s[a];
  }), n.objectKeys = typeof Object.keys == "function" ? (s) => Object.keys(s) : (s) => {
    const a = [];
    for (const i in s)
      Object.prototype.hasOwnProperty.call(s, i) && a.push(i);
    return a;
  }, n.find = (s, a) => {
    for (const i of s)
      if (a(i))
        return i;
  }, n.isInteger = typeof Number.isInteger == "function" ? (s) => Number.isInteger(s) : (s) => typeof s == "number" && isFinite(s) && Math.floor(s) === s;
  function r(s, a = " | ") {
    return s.map((i) => typeof i == "string" ? `'${i}'` : i).join(a);
  }
  n.joinValues = r, n.jsonStringifyReplacer = (s, a) => typeof a == "bigint" ? a.toString() : a;
})(w || (w = {}));
var Ke;
(function(n) {
  n.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Ke || (Ke = {}));
const h = w.arrayToEnum([
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
]), q = (n) => {
  switch (typeof n) {
    case "undefined":
      return h.undefined;
    case "string":
      return h.string;
    case "number":
      return isNaN(n) ? h.nan : h.number;
    case "boolean":
      return h.boolean;
    case "function":
      return h.function;
    case "bigint":
      return h.bigint;
    case "symbol":
      return h.symbol;
    case "object":
      return Array.isArray(n) ? h.array : n === null ? h.null : n.then && typeof n.then == "function" && n.catch && typeof n.catch == "function" ? h.promise : typeof Map < "u" && n instanceof Map ? h.map : typeof Set < "u" && n instanceof Set ? h.set : typeof Date < "u" && n instanceof Date ? h.date : h.object;
    default:
      return h.unknown;
  }
}, l = w.arrayToEnum([
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
]), Yt = (n) => JSON.stringify(n, null, 2).replace(/"([^"]+)":/g, "$1:");
class M extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (r) => {
      this.issues = [...this.issues, r];
    }, this.addIssues = (r = []) => {
      this.issues = [...this.issues, ...r];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, r = { _errors: [] }, s = (a) => {
      for (const i of a.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(s);
        else if (i.code === "invalid_return_type")
          s(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          s(i.argumentsError);
        else if (i.path.length === 0)
          r._errors.push(t(i));
        else {
          let o = r, c = 0;
          for (; c < i.path.length; ) {
            const d = i.path[c];
            c === i.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(i))) : o[d] = o[d] || { _errors: [] }, o = o[d], c++;
          }
        }
    };
    return s(this), r;
  }
  static assert(e) {
    if (!(e instanceof M))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, w.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, r = [];
    for (const s of this.issues)
      s.path.length > 0 ? (t[s.path[0]] = t[s.path[0]] || [], t[s.path[0]].push(e(s))) : r.push(e(s));
    return { formErrors: r, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
M.create = (n) => new M(n);
const pe = (n, e) => {
  let t;
  switch (n.code) {
    case l.invalid_type:
      n.received === h.undefined ? t = "Required" : t = `Expected ${n.expected}, received ${n.received}`;
      break;
    case l.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(n.expected, w.jsonStringifyReplacer)}`;
      break;
    case l.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${w.joinValues(n.keys, ", ")}`;
      break;
    case l.invalid_union:
      t = "Invalid input";
      break;
    case l.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${w.joinValues(n.options)}`;
      break;
    case l.invalid_enum_value:
      t = `Invalid enum value. Expected ${w.joinValues(n.options)}, received '${n.received}'`;
      break;
    case l.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case l.invalid_return_type:
      t = "Invalid function return type";
      break;
    case l.invalid_date:
      t = "Invalid date";
      break;
    case l.invalid_string:
      typeof n.validation == "object" ? "includes" in n.validation ? (t = `Invalid input: must include "${n.validation.includes}"`, typeof n.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${n.validation.position}`)) : "startsWith" in n.validation ? t = `Invalid input: must start with "${n.validation.startsWith}"` : "endsWith" in n.validation ? t = `Invalid input: must end with "${n.validation.endsWith}"` : w.assertNever(n.validation) : n.validation !== "regex" ? t = `Invalid ${n.validation}` : t = "Invalid";
      break;
    case l.too_small:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "more than"} ${n.minimum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "over"} ${n.minimum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${n.minimum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(n.minimum))}` : t = "Invalid input";
      break;
    case l.too_big:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "less than"} ${n.maximum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "under"} ${n.maximum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "bigint" ? t = `BigInt must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly" : n.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(n.maximum))}` : t = "Invalid input";
      break;
    case l.custom:
      t = "Invalid input";
      break;
    case l.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case l.not_multiple_of:
      t = `Number must be a multiple of ${n.multipleOf}`;
      break;
    case l.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, w.assertNever(n);
  }
  return { message: t };
};
let St = pe;
function Kt(n) {
  St = n;
}
function Ze() {
  return St;
}
const De = (n) => {
  const { data: e, path: t, errorMaps: r, issueData: s } = n, a = [...t, ...s.path || []], i = {
    ...s,
    path: a
  };
  if (s.message !== void 0)
    return {
      ...s,
      path: a,
      message: s.message
    };
  let o = "";
  const c = r.filter((d) => !!d).slice().reverse();
  for (const d of c)
    o = d(i, { data: e, defaultError: o }).message;
  return {
    ...s,
    path: a,
    message: o
  };
}, Ht = [];
function f(n, e) {
  const t = Ze(), r = De({
    issueData: e,
    data: n.data,
    path: n.path,
    errorMaps: [
      n.common.contextualErrorMap,
      // contextual error map is first priority
      n.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === pe ? void 0 : pe
      // then global default map
    ].filter((s) => !!s)
  });
  n.common.issues.push(r);
}
class C {
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
    const r = [];
    for (const s of t) {
      if (s.status === "aborted")
        return v;
      s.status === "dirty" && e.dirty(), r.push(s.value);
    }
    return { status: e.value, value: r };
  }
  static async mergeObjectAsync(e, t) {
    const r = [];
    for (const s of t) {
      const a = await s.key, i = await s.value;
      r.push({
        key: a,
        value: i
      });
    }
    return C.mergeObjectSync(e, r);
  }
  static mergeObjectSync(e, t) {
    const r = {};
    for (const s of t) {
      const { key: a, value: i } = s;
      if (a.status === "aborted" || i.status === "aborted")
        return v;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof i.value < "u" || s.alwaysSet) && (r[a.value] = i.value);
    }
    return { status: e.value, value: r };
  }
}
const v = Object.freeze({
  status: "aborted"
}), le = (n) => ({ status: "dirty", value: n }), P = (n) => ({ status: "valid", value: n }), He = (n) => n.status === "aborted", Qe = (n) => n.status === "dirty", ie = (n) => n.status === "valid", we = (n) => typeof Promise < "u" && n instanceof Promise;
function Ue(n, e, t, r) {
  if (typeof e == "function" ? n !== e || !0 : !e.has(n)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(n);
}
function Pt(n, e, t, r, s) {
  if (typeof e == "function" ? n !== e || !0 : !e.has(n)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(n, t), t;
}
var m;
(function(n) {
  n.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, n.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(m || (m = {}));
var ye, ve;
class z {
  constructor(e, t, r, s) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = r, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const at = (n, e) => {
  if (ie(e))
    return { success: !0, data: e.value };
  if (!n.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new M(n.common.issues);
      return this._error = t, this._error;
    }
  };
};
function _(n) {
  if (!n)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: r, description: s } = n;
  if (e && (t || r))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (i, o) => {
    var c, d;
    const { message: p } = n;
    return i.code === "invalid_enum_value" ? { message: p ?? o.defaultError } : typeof o.data > "u" ? { message: (c = p ?? r) !== null && c !== void 0 ? c : o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: (d = p ?? t) !== null && d !== void 0 ? d : o.defaultError };
  }, description: s };
}
class b {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return q(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: q(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new C(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: q(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (we(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const r = this.safeParse(e, t);
    if (r.success)
      return r.data;
    throw r.error;
  }
  safeParse(e, t) {
    var r;
    const s = {
      common: {
        issues: [],
        async: (r = t == null ? void 0 : t.async) !== null && r !== void 0 ? r : !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: q(e)
    }, a = this._parseSync({ data: e, path: s.path, parent: s });
    return at(s, a);
  }
  "~validate"(e) {
    var t, r;
    const s = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: q(e)
    };
    if (!this["~standard"].async)
      try {
        const a = this._parseSync({ data: e, path: [], parent: s });
        return ie(a) ? {
          value: a.value
        } : {
          issues: s.common.issues
        };
      } catch (a) {
        !((r = (t = a == null ? void 0 : a.message) === null || t === void 0 ? void 0 : t.toLowerCase()) === null || r === void 0) && r.includes("encountered") && (this["~standard"].async = !0), s.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: s }).then((a) => ie(a) ? {
      value: a.value
    } : {
      issues: s.common.issues
    });
  }
  async parseAsync(e, t) {
    const r = await this.safeParseAsync(e, t);
    if (r.success)
      return r.data;
    throw r.error;
  }
  async safeParseAsync(e, t) {
    const r = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: q(e)
    }, s = this._parse({ data: e, path: r.path, parent: r }), a = await (we(s) ? s : Promise.resolve(s));
    return at(r, a);
  }
  refine(e, t) {
    const r = (s) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(s) : t;
    return this._refinement((s, a) => {
      const i = e(s), o = () => a.addIssue({
        code: l.custom,
        ...r(s)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((r, s) => e(r) ? !0 : (s.addIssue(typeof t == "function" ? t(r, s) : t), !1));
  }
  _refinement(e) {
    return new F({
      schema: this,
      typeName: y.ZodEffects,
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
    return B.create(this, this._def);
  }
  nullable() {
    return re.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return U.create(this);
  }
  promise() {
    return ge.create(this, this._def);
  }
  or(e) {
    return Te.create([this, e], this._def);
  }
  and(e) {
    return Ae.create(this, e, this._def);
  }
  transform(e) {
    return new F({
      ..._(this._def),
      schema: this,
      typeName: y.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Oe({
      ..._(this._def),
      innerType: this,
      defaultValue: t,
      typeName: y.ZodDefault
    });
  }
  brand() {
    return new st({
      typeName: y.ZodBranded,
      type: this,
      ..._(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new je({
      ..._(this._def),
      innerType: this,
      catchValue: t,
      typeName: y.ZodCatch
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
    return Re.create(this, e);
  }
  readonly() {
    return Me.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Qt = /^c[^\s-]{8,}$/i, Xt = /^[0-9a-z]+$/, er = /^[0-9A-HJKMNP-TV-Z]{26}$/i, tr = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, rr = /^[a-z0-9_-]{21}$/i, sr = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, nr = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, ar = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ir = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let We;
const or = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, cr = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, dr = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, lr = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, ur = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, fr = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ot = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", hr = new RegExp(`^${Ot}$`);
function jt(n) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return n.precision ? e = `${e}\\.\\d{${n.precision}}` : n.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function pr(n) {
  return new RegExp(`^${jt(n)}$`);
}
function Mt(n) {
  let e = `${Ot}T${jt(n)}`;
  const t = [];
  return t.push(n.local ? "Z?" : "Z"), n.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function mr(n, e) {
  return !!((e === "v4" || !e) && or.test(n) || (e === "v6" || !e) && dr.test(n));
}
function gr(n, e) {
  if (!sr.test(n))
    return !1;
  try {
    const [t] = n.split("."), r = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), s = JSON.parse(atob(r));
    return !(typeof s != "object" || s === null || !s.typ || !s.alg || e && s.alg !== e);
  } catch {
    return !1;
  }
}
function yr(n, e) {
  return !!((e === "v4" || !e) && cr.test(n) || (e === "v6" || !e) && lr.test(n));
}
class D extends b {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== h.string) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: l.invalid_type,
        expected: h.string,
        received: a.parsedType
      }), v;
    }
    const r = new C();
    let s;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (s = this._getOrReturnCtx(e, s), f(s, {
          code: l.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), r.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (s = this._getOrReturnCtx(e, s), f(s, {
          code: l.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), r.dirty());
      else if (a.kind === "length") {
        const i = e.data.length > a.value, o = e.data.length < a.value;
        (i || o) && (s = this._getOrReturnCtx(e, s), i ? f(s, {
          code: l.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : o && f(s, {
          code: l.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), r.dirty());
      } else if (a.kind === "email")
        ar.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "email",
          code: l.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "emoji")
        We || (We = new RegExp(ir, "u")), We.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "emoji",
          code: l.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "uuid")
        tr.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "uuid",
          code: l.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "nanoid")
        rr.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "nanoid",
          code: l.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "cuid")
        Qt.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "cuid",
          code: l.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "cuid2")
        Xt.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "cuid2",
          code: l.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "ulid")
        er.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
          validation: "ulid",
          code: l.invalid_string,
          message: a.message
        }), r.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          s = this._getOrReturnCtx(e, s), f(s, {
            validation: "url",
            code: l.invalid_string,
            message: a.message
          }), r.dirty();
        }
      else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        validation: "regex",
        code: l.invalid_string,
        message: a.message
      }), r.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (s = this._getOrReturnCtx(e, s), f(s, {
        code: l.invalid_string,
        validation: { includes: a.value, position: a.position },
        message: a.message
      }), r.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (s = this._getOrReturnCtx(e, s), f(s, {
        code: l.invalid_string,
        validation: { startsWith: a.value },
        message: a.message
      }), r.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (s = this._getOrReturnCtx(e, s), f(s, {
        code: l.invalid_string,
        validation: { endsWith: a.value },
        message: a.message
      }), r.dirty()) : a.kind === "datetime" ? Mt(a).test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        code: l.invalid_string,
        validation: "datetime",
        message: a.message
      }), r.dirty()) : a.kind === "date" ? hr.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        code: l.invalid_string,
        validation: "date",
        message: a.message
      }), r.dirty()) : a.kind === "time" ? pr(a).test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        code: l.invalid_string,
        validation: "time",
        message: a.message
      }), r.dirty()) : a.kind === "duration" ? nr.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        validation: "duration",
        code: l.invalid_string,
        message: a.message
      }), r.dirty()) : a.kind === "ip" ? mr(e.data, a.version) || (s = this._getOrReturnCtx(e, s), f(s, {
        validation: "ip",
        code: l.invalid_string,
        message: a.message
      }), r.dirty()) : a.kind === "jwt" ? gr(e.data, a.alg) || (s = this._getOrReturnCtx(e, s), f(s, {
        validation: "jwt",
        code: l.invalid_string,
        message: a.message
      }), r.dirty()) : a.kind === "cidr" ? yr(e.data, a.version) || (s = this._getOrReturnCtx(e, s), f(s, {
        validation: "cidr",
        code: l.invalid_string,
        message: a.message
      }), r.dirty()) : a.kind === "base64" ? ur.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        validation: "base64",
        code: l.invalid_string,
        message: a.message
      }), r.dirty()) : a.kind === "base64url" ? fr.test(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        validation: "base64url",
        code: l.invalid_string,
        message: a.message
      }), r.dirty()) : w.assertNever(a);
    return { status: r.value, value: e.data };
  }
  _regex(e, t, r) {
    return this.refinement((s) => e.test(s), {
      validation: t,
      code: l.invalid_string,
      ...m.errToObj(r)
    });
  }
  _addCheck(e) {
    return new D({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...m.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...m.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...m.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...m.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...m.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...m.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...m.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...m.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...m.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...m.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...m.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...m.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...m.errToObj(e) });
  }
  datetime(e) {
    var t, r;
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
      local: (r = e == null ? void 0 : e.local) !== null && r !== void 0 ? r : !1,
      ...m.errToObj(e == null ? void 0 : e.message)
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
      ...m.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...m.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...m.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...m.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...m.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...m.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...m.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...m.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...m.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, m.errToObj(e));
  }
  trim() {
    return new D({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new D({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new D({
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
D.create = (n) => {
  var e;
  return new D({
    checks: [],
    typeName: y.ZodString,
    coerce: (e = n == null ? void 0 : n.coerce) !== null && e !== void 0 ? e : !1,
    ..._(n)
  });
};
function vr(n, e) {
  const t = (n.toString().split(".")[1] || "").length, r = (e.toString().split(".")[1] || "").length, s = t > r ? t : r, a = parseInt(n.toFixed(s).replace(".", "")), i = parseInt(e.toFixed(s).replace(".", ""));
  return a % i / Math.pow(10, s);
}
class X extends b {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== h.number) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: l.invalid_type,
        expected: h.number,
        received: a.parsedType
      }), v;
    }
    let r;
    const s = new C();
    for (const a of this._def.checks)
      a.kind === "int" ? w.isInteger(e.data) || (r = this._getOrReturnCtx(e, r), f(r, {
        code: l.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), s.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: l.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: l.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), s.dirty()) : a.kind === "multipleOf" ? vr(e.data, a.value) !== 0 && (r = this._getOrReturnCtx(e, r), f(r, {
        code: l.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), s.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (r = this._getOrReturnCtx(e, r), f(r, {
        code: l.not_finite,
        message: a.message
      }), s.dirty()) : w.assertNever(a);
    return { status: s.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, m.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, m.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, m.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, m.toString(t));
  }
  setLimit(e, t, r, s) {
    return new X({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: r,
          message: m.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new X({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: m.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: m.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: m.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: m.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: m.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: m.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: m.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: m.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: m.toString(e)
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && w.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const r of this._def.checks) {
      if (r.kind === "finite" || r.kind === "int" || r.kind === "multipleOf")
        return !0;
      r.kind === "min" ? (t === null || r.value > t) && (t = r.value) : r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
X.create = (n) => new X({
  checks: [],
  typeName: y.ZodNumber,
  coerce: (n == null ? void 0 : n.coerce) || !1,
  ..._(n)
});
class ee extends b {
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
    if (this._getType(e) !== h.bigint)
      return this._getInvalidInput(e);
    let r;
    const s = new C();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: l.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: l.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), s.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (r = this._getOrReturnCtx(e, r), f(r, {
        code: l.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), s.dirty()) : w.assertNever(a);
    return { status: s.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return f(t, {
      code: l.invalid_type,
      expected: h.bigint,
      received: t.parsedType
    }), v;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, m.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, m.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, m.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, m.toString(t));
  }
  setLimit(e, t, r, s) {
    return new ee({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: r,
          message: m.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new ee({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: m.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: m.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: m.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: m.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: m.toString(t)
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
ee.create = (n) => {
  var e;
  return new ee({
    checks: [],
    typeName: y.ZodBigInt,
    coerce: (e = n == null ? void 0 : n.coerce) !== null && e !== void 0 ? e : !1,
    ..._(n)
  });
};
class Ee extends b {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== h.boolean) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: l.invalid_type,
        expected: h.boolean,
        received: r.parsedType
      }), v;
    }
    return P(e.data);
  }
}
Ee.create = (n) => new Ee({
  typeName: y.ZodBoolean,
  coerce: (n == null ? void 0 : n.coerce) || !1,
  ..._(n)
});
class oe extends b {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== h.date) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: l.invalid_type,
        expected: h.date,
        received: a.parsedType
      }), v;
    }
    if (isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: l.invalid_date
      }), v;
    }
    const r = new C();
    let s;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (s = this._getOrReturnCtx(e, s), f(s, {
        code: l.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), r.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (s = this._getOrReturnCtx(e, s), f(s, {
        code: l.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), r.dirty()) : w.assertNever(a);
    return {
      status: r.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new oe({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: m.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: m.toString(t)
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
oe.create = (n) => new oe({
  checks: [],
  coerce: (n == null ? void 0 : n.coerce) || !1,
  typeName: y.ZodDate,
  ..._(n)
});
class Fe extends b {
  _parse(e) {
    if (this._getType(e) !== h.symbol) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: l.invalid_type,
        expected: h.symbol,
        received: r.parsedType
      }), v;
    }
    return P(e.data);
  }
}
Fe.create = (n) => new Fe({
  typeName: y.ZodSymbol,
  ..._(n)
});
class xe extends b {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: l.invalid_type,
        expected: h.undefined,
        received: r.parsedType
      }), v;
    }
    return P(e.data);
  }
}
xe.create = (n) => new xe({
  typeName: y.ZodUndefined,
  ..._(n)
});
class ke extends b {
  _parse(e) {
    if (this._getType(e) !== h.null) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: l.invalid_type,
        expected: h.null,
        received: r.parsedType
      }), v;
    }
    return P(e.data);
  }
}
ke.create = (n) => new ke({
  typeName: y.ZodNull,
  ..._(n)
});
class me extends b {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return P(e.data);
  }
}
me.create = (n) => new me({
  typeName: y.ZodAny,
  ..._(n)
});
class ae extends b {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return P(e.data);
  }
}
ae.create = (n) => new ae({
  typeName: y.ZodUnknown,
  ..._(n)
});
class K extends b {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return f(t, {
      code: l.invalid_type,
      expected: h.never,
      received: t.parsedType
    }), v;
  }
}
K.create = (n) => new K({
  typeName: y.ZodNever,
  ..._(n)
});
class $e extends b {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: l.invalid_type,
        expected: h.void,
        received: r.parsedType
      }), v;
    }
    return P(e.data);
  }
}
$e.create = (n) => new $e({
  typeName: y.ZodVoid,
  ..._(n)
});
class U extends b {
  _parse(e) {
    const { ctx: t, status: r } = this._processInputParams(e), s = this._def;
    if (t.parsedType !== h.array)
      return f(t, {
        code: l.invalid_type,
        expected: h.array,
        received: t.parsedType
      }), v;
    if (s.exactLength !== null) {
      const i = t.data.length > s.exactLength.value, o = t.data.length < s.exactLength.value;
      (i || o) && (f(t, {
        code: i ? l.too_big : l.too_small,
        minimum: o ? s.exactLength.value : void 0,
        maximum: i ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), r.dirty());
    }
    if (s.minLength !== null && t.data.length < s.minLength.value && (f(t, {
      code: l.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), r.dirty()), s.maxLength !== null && t.data.length > s.maxLength.value && (f(t, {
      code: l.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), r.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => s.type._parseAsync(new z(t, i, t.path, o)))).then((i) => C.mergeArray(r, i));
    const a = [...t.data].map((i, o) => s.type._parseSync(new z(t, i, t.path, o)));
    return C.mergeArray(r, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new U({
      ...this._def,
      minLength: { value: e, message: m.toString(t) }
    });
  }
  max(e, t) {
    return new U({
      ...this._def,
      maxLength: { value: e, message: m.toString(t) }
    });
  }
  length(e, t) {
    return new U({
      ...this._def,
      exactLength: { value: e, message: m.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
U.create = (n, e) => new U({
  type: n,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: y.ZodArray,
  ..._(e)
});
function de(n) {
  if (n instanceof k) {
    const e = {};
    for (const t in n.shape) {
      const r = n.shape[t];
      e[t] = B.create(de(r));
    }
    return new k({
      ...n._def,
      shape: () => e
    });
  } else return n instanceof U ? new U({
    ...n._def,
    type: de(n.element)
  }) : n instanceof B ? B.create(de(n.unwrap())) : n instanceof re ? re.create(de(n.unwrap())) : n instanceof J ? J.create(n.items.map((e) => de(e))) : n;
}
class k extends b {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = w.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== h.object) {
      const d = this._getOrReturnCtx(e);
      return f(d, {
        code: l.invalid_type,
        expected: h.object,
        received: d.parsedType
      }), v;
    }
    const { status: r, ctx: s } = this._processInputParams(e), { shape: a, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof K && this._def.unknownKeys === "strip"))
      for (const d in s.data)
        i.includes(d) || o.push(d);
    const c = [];
    for (const d of i) {
      const p = a[d], A = s.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: p._parse(new z(s, A, s.path, d)),
        alwaysSet: d in s.data
      });
    }
    if (this._def.catchall instanceof K) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const p of o)
          c.push({
            key: { status: "valid", value: p },
            value: { status: "valid", value: s.data[p] }
          });
      else if (d === "strict")
        o.length > 0 && (f(s, {
          code: l.unrecognized_keys,
          keys: o
        }), r.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const p of o) {
        const A = s.data[p];
        c.push({
          key: { status: "valid", value: p },
          value: d._parse(
            new z(s, A, s.path, p)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: p in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const p of c) {
        const A = await p.key, S = await p.value;
        d.push({
          key: A,
          value: S,
          alwaysSet: p.alwaysSet
        });
      }
      return d;
    }).then((d) => C.mergeObjectSync(r, d)) : C.mergeObjectSync(r, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return m.errToObj, new k({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, r) => {
          var s, a, i, o;
          const c = (i = (a = (s = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(s, t, r).message) !== null && i !== void 0 ? i : r.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (o = m.errToObj(e).message) !== null && o !== void 0 ? o : c
          } : {
            message: c
          };
        }
      } : {}
    });
  }
  strip() {
    return new k({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new k({
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
    return new k({
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
    return new k({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: y.ZodObject
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
    return new k({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return w.objectKeys(e).forEach((r) => {
      e[r] && this.shape[r] && (t[r] = this.shape[r]);
    }), new k({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return w.objectKeys(this.shape).forEach((r) => {
      e[r] || (t[r] = this.shape[r]);
    }), new k({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return de(this);
  }
  partial(e) {
    const t = {};
    return w.objectKeys(this.shape).forEach((r) => {
      const s = this.shape[r];
      e && !e[r] ? t[r] = s : t[r] = s.optional();
    }), new k({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return w.objectKeys(this.shape).forEach((r) => {
      if (e && !e[r])
        t[r] = this.shape[r];
      else {
        let a = this.shape[r];
        for (; a instanceof B; )
          a = a._def.innerType;
        t[r] = a;
      }
    }), new k({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Rt(w.objectKeys(this.shape));
  }
}
k.create = (n, e) => new k({
  shape: () => n,
  unknownKeys: "strip",
  catchall: K.create(),
  typeName: y.ZodObject,
  ..._(e)
});
k.strictCreate = (n, e) => new k({
  shape: () => n,
  unknownKeys: "strict",
  catchall: K.create(),
  typeName: y.ZodObject,
  ..._(e)
});
k.lazycreate = (n, e) => new k({
  shape: n,
  unknownKeys: "strip",
  catchall: K.create(),
  typeName: y.ZodObject,
  ..._(e)
});
class Te extends b {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = this._def.options;
    function s(a) {
      for (const o of a)
        if (o.result.status === "valid")
          return o.result;
      for (const o of a)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = a.map((o) => new M(o.ctx.common.issues));
      return f(t, {
        code: l.invalid_union,
        unionErrors: i
      }), v;
    }
    if (t.common.async)
      return Promise.all(r.map(async (a) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await a._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(s);
    {
      let a;
      const i = [];
      for (const c of r) {
        const d = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, p = c._parseSync({
          data: t.data,
          path: t.path,
          parent: d
        });
        if (p.status === "valid")
          return p;
        p.status === "dirty" && !a && (a = { result: p, ctx: d }), d.common.issues.length && i.push(d.common.issues);
      }
      if (a)
        return t.common.issues.push(...a.ctx.common.issues), a.result;
      const o = i.map((c) => new M(c));
      return f(t, {
        code: l.invalid_union,
        unionErrors: o
      }), v;
    }
  }
  get options() {
    return this._def.options;
  }
}
Te.create = (n, e) => new Te({
  options: n,
  typeName: y.ZodUnion,
  ..._(e)
});
const V = (n) => n instanceof Ce ? V(n.schema) : n instanceof F ? V(n.innerType()) : n instanceof Se ? [n.value] : n instanceof te ? n.options : n instanceof Pe ? w.objectValues(n.enum) : n instanceof Oe ? V(n._def.innerType) : n instanceof xe ? [void 0] : n instanceof ke ? [null] : n instanceof B ? [void 0, ...V(n.unwrap())] : n instanceof re ? [null, ...V(n.unwrap())] : n instanceof st || n instanceof Me ? V(n.unwrap()) : n instanceof je ? V(n._def.innerType) : [];
class qe extends b {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.object)
      return f(t, {
        code: l.invalid_type,
        expected: h.object,
        received: t.parsedType
      }), v;
    const r = this.discriminator, s = t.data[r], a = this.optionsMap.get(s);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (f(t, {
      code: l.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [r]
    }), v);
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
  static create(e, t, r) {
    const s = /* @__PURE__ */ new Map();
    for (const a of t) {
      const i = V(a.shape[e]);
      if (!i.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of i) {
        if (s.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        s.set(o, a);
      }
    }
    return new qe({
      typeName: y.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: s,
      ..._(r)
    });
  }
}
function Xe(n, e) {
  const t = q(n), r = q(e);
  if (n === e)
    return { valid: !0, data: n };
  if (t === h.object && r === h.object) {
    const s = w.objectKeys(e), a = w.objectKeys(n).filter((o) => s.indexOf(o) !== -1), i = { ...n, ...e };
    for (const o of a) {
      const c = Xe(n[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (t === h.array && r === h.array) {
    if (n.length !== e.length)
      return { valid: !1 };
    const s = [];
    for (let a = 0; a < n.length; a++) {
      const i = n[a], o = e[a], c = Xe(i, o);
      if (!c.valid)
        return { valid: !1 };
      s.push(c.data);
    }
    return { valid: !0, data: s };
  } else return t === h.date && r === h.date && +n == +e ? { valid: !0, data: n } : { valid: !1 };
}
class Ae extends b {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), s = (a, i) => {
      if (He(a) || He(i))
        return v;
      const o = Xe(a.value, i.value);
      return o.valid ? ((Qe(a) || Qe(i)) && t.dirty(), { status: t.value, value: o.data }) : (f(r, {
        code: l.invalid_intersection_types
      }), v);
    };
    return r.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      }),
      this._def.right._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      })
    ]).then(([a, i]) => s(a, i)) : s(this._def.left._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }), this._def.right._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }));
  }
}
Ae.create = (n, e, t) => new Ae({
  left: n,
  right: e,
  typeName: y.ZodIntersection,
  ..._(t)
});
class J extends b {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== h.array)
      return f(r, {
        code: l.invalid_type,
        expected: h.array,
        received: r.parsedType
      }), v;
    if (r.data.length < this._def.items.length)
      return f(r, {
        code: l.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), v;
    !this._def.rest && r.data.length > this._def.items.length && (f(r, {
      code: l.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...r.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new z(r, i, r.path, o)) : null;
    }).filter((i) => !!i);
    return r.common.async ? Promise.all(a).then((i) => C.mergeArray(t, i)) : C.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new J({
      ...this._def,
      rest: e
    });
  }
}
J.create = (n, e) => {
  if (!Array.isArray(n))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new J({
    items: n,
    typeName: y.ZodTuple,
    rest: null,
    ..._(e)
  });
};
class Ie extends b {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== h.object)
      return f(r, {
        code: l.invalid_type,
        expected: h.object,
        received: r.parsedType
      }), v;
    const s = [], a = this._def.keyType, i = this._def.valueType;
    for (const o in r.data)
      s.push({
        key: a._parse(new z(r, o, r.path, o)),
        value: i._parse(new z(r, r.data[o], r.path, o)),
        alwaysSet: o in r.data
      });
    return r.common.async ? C.mergeObjectAsync(t, s) : C.mergeObjectSync(t, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, r) {
    return t instanceof b ? new Ie({
      keyType: e,
      valueType: t,
      typeName: y.ZodRecord,
      ..._(r)
    }) : new Ie({
      keyType: D.create(),
      valueType: e,
      typeName: y.ZodRecord,
      ..._(t)
    });
  }
}
class Be extends b {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== h.map)
      return f(r, {
        code: l.invalid_type,
        expected: h.map,
        received: r.parsedType
      }), v;
    const s = this._def.keyType, a = this._def.valueType, i = [...r.data.entries()].map(([o, c], d) => ({
      key: s._parse(new z(r, o, r.path, [d, "key"])),
      value: a._parse(new z(r, c, r.path, [d, "value"]))
    }));
    if (r.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of i) {
          const d = await c.key, p = await c.value;
          if (d.status === "aborted" || p.status === "aborted")
            return v;
          (d.status === "dirty" || p.status === "dirty") && t.dirty(), o.set(d.value, p.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const d = c.key, p = c.value;
        if (d.status === "aborted" || p.status === "aborted")
          return v;
        (d.status === "dirty" || p.status === "dirty") && t.dirty(), o.set(d.value, p.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Be.create = (n, e, t) => new Be({
  valueType: e,
  keyType: n,
  typeName: y.ZodMap,
  ..._(t)
});
class ce extends b {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== h.set)
      return f(r, {
        code: l.invalid_type,
        expected: h.set,
        received: r.parsedType
      }), v;
    const s = this._def;
    s.minSize !== null && r.data.size < s.minSize.value && (f(r, {
      code: l.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), t.dirty()), s.maxSize !== null && r.data.size > s.maxSize.value && (f(r, {
      code: l.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function i(c) {
      const d = /* @__PURE__ */ new Set();
      for (const p of c) {
        if (p.status === "aborted")
          return v;
        p.status === "dirty" && t.dirty(), d.add(p.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...r.data.values()].map((c, d) => a._parse(new z(r, c, r.path, d)));
    return r.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, t) {
    return new ce({
      ...this._def,
      minSize: { value: e, message: m.toString(t) }
    });
  }
  max(e, t) {
    return new ce({
      ...this._def,
      maxSize: { value: e, message: m.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ce.create = (n, e) => new ce({
  valueType: n,
  minSize: null,
  maxSize: null,
  typeName: y.ZodSet,
  ..._(e)
});
class he extends b {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.function)
      return f(t, {
        code: l.invalid_type,
        expected: h.function,
        received: t.parsedType
      }), v;
    function r(o, c) {
      return De({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Ze(),
          pe
        ].filter((d) => !!d),
        issueData: {
          code: l.invalid_arguments,
          argumentsError: c
        }
      });
    }
    function s(o, c) {
      return De({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Ze(),
          pe
        ].filter((d) => !!d),
        issueData: {
          code: l.invalid_return_type,
          returnTypeError: c
        }
      });
    }
    const a = { errorMap: t.common.contextualErrorMap }, i = t.data;
    if (this._def.returns instanceof ge) {
      const o = this;
      return P(async function(...c) {
        const d = new M([]), p = await o._def.args.parseAsync(c, a).catch((R) => {
          throw d.addIssue(r(c, R)), d;
        }), A = await Reflect.apply(i, this, p);
        return await o._def.returns._def.type.parseAsync(A, a).catch((R) => {
          throw d.addIssue(s(A, R)), d;
        });
      });
    } else {
      const o = this;
      return P(function(...c) {
        const d = o._def.args.safeParse(c, a);
        if (!d.success)
          throw new M([r(c, d.error)]);
        const p = Reflect.apply(i, this, d.data), A = o._def.returns.safeParse(p, a);
        if (!A.success)
          throw new M([s(p, A.error)]);
        return A.data;
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
    return new he({
      ...this._def,
      args: J.create(e).rest(ae.create())
    });
  }
  returns(e) {
    return new he({
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
  static create(e, t, r) {
    return new he({
      args: e || J.create([]).rest(ae.create()),
      returns: t || ae.create(),
      typeName: y.ZodFunction,
      ..._(r)
    });
  }
}
class Ce extends b {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Ce.create = (n, e) => new Ce({
  getter: n,
  typeName: y.ZodLazy,
  ..._(e)
});
class Se extends b {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return f(t, {
        received: t.data,
        code: l.invalid_literal,
        expected: this._def.value
      }), v;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Se.create = (n, e) => new Se({
  value: n,
  typeName: y.ZodLiteral,
  ..._(e)
});
function Rt(n, e) {
  return new te({
    values: n,
    typeName: y.ZodEnum,
    ..._(e)
  });
}
class te extends b {
  constructor() {
    super(...arguments), ye.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return f(t, {
        expected: w.joinValues(r),
        received: t.parsedType,
        code: l.invalid_type
      }), v;
    }
    if (Ue(this, ye) || Pt(this, ye, new Set(this._def.values)), !Ue(this, ye).has(e.data)) {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return f(t, {
        received: t.data,
        code: l.invalid_enum_value,
        options: r
      }), v;
    }
    return P(e.data);
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
    return te.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return te.create(this.options.filter((r) => !e.includes(r)), {
      ...this._def,
      ...t
    });
  }
}
ye = /* @__PURE__ */ new WeakMap();
te.create = Rt;
class Pe extends b {
  constructor() {
    super(...arguments), ve.set(this, void 0);
  }
  _parse(e) {
    const t = w.getValidEnumValues(this._def.values), r = this._getOrReturnCtx(e);
    if (r.parsedType !== h.string && r.parsedType !== h.number) {
      const s = w.objectValues(t);
      return f(r, {
        expected: w.joinValues(s),
        received: r.parsedType,
        code: l.invalid_type
      }), v;
    }
    if (Ue(this, ve) || Pt(this, ve, new Set(w.getValidEnumValues(this._def.values))), !Ue(this, ve).has(e.data)) {
      const s = w.objectValues(t);
      return f(r, {
        received: r.data,
        code: l.invalid_enum_value,
        options: s
      }), v;
    }
    return P(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
ve = /* @__PURE__ */ new WeakMap();
Pe.create = (n, e) => new Pe({
  values: n,
  typeName: y.ZodNativeEnum,
  ..._(e)
});
class ge extends b {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.promise && t.common.async === !1)
      return f(t, {
        code: l.invalid_type,
        expected: h.promise,
        received: t.parsedType
      }), v;
    const r = t.parsedType === h.promise ? t.data : Promise.resolve(t.data);
    return P(r.then((s) => this._def.type.parseAsync(s, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
ge.create = (n, e) => new ge({
  type: n,
  typeName: y.ZodPromise,
  ..._(e)
});
class F extends b {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === y.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), s = this._def.effect || null, a = {
      addIssue: (i) => {
        f(r, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return r.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), s.type === "preprocess") {
      const i = s.transform(r.data, a);
      if (r.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return v;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: r.path,
            parent: r
          });
          return c.status === "aborted" ? v : c.status === "dirty" || t.value === "dirty" ? le(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return v;
        const o = this._def.schema._parseSync({
          data: i,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? v : o.status === "dirty" || t.value === "dirty" ? le(o.value) : o;
      }
    }
    if (s.type === "refinement") {
      const i = (o) => {
        const c = s.refinement(o, a);
        if (r.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (r.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? v : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((o) => o.status === "aborted" ? v : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (s.type === "transform")
      if (r.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        if (!ie(i))
          return i;
        const o = s.transform(i.value, a);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((i) => ie(i) ? Promise.resolve(s.transform(i.value, a)).then((o) => ({ status: t.value, value: o })) : i);
    w.assertNever(s);
  }
}
F.create = (n, e, t) => new F({
  schema: n,
  typeName: y.ZodEffects,
  effect: e,
  ..._(t)
});
F.createWithPreprocess = (n, e, t) => new F({
  schema: e,
  effect: { type: "preprocess", transform: n },
  typeName: y.ZodEffects,
  ..._(t)
});
class B extends b {
  _parse(e) {
    return this._getType(e) === h.undefined ? P(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
B.create = (n, e) => new B({
  innerType: n,
  typeName: y.ZodOptional,
  ..._(e)
});
class re extends b {
  _parse(e) {
    return this._getType(e) === h.null ? P(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
re.create = (n, e) => new re({
  innerType: n,
  typeName: y.ZodNullable,
  ..._(e)
});
class Oe extends b {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let r = t.data;
    return t.parsedType === h.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Oe.create = (n, e) => new Oe({
  innerType: n,
  typeName: y.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ..._(e)
});
class je extends b {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, s = this._def.innerType._parse({
      data: r.data,
      path: r.path,
      parent: {
        ...r
      }
    });
    return we(s) ? s.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new M(r.common.issues);
        },
        input: r.data
      })
    })) : {
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new M(r.common.issues);
        },
        input: r.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
je.create = (n, e) => new je({
  innerType: n,
  typeName: y.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ..._(e)
});
class ze extends b {
  _parse(e) {
    if (this._getType(e) !== h.nan) {
      const r = this._getOrReturnCtx(e);
      return f(r, {
        code: l.invalid_type,
        expected: h.nan,
        received: r.parsedType
      }), v;
    }
    return { status: "valid", value: e.data };
  }
}
ze.create = (n) => new ze({
  typeName: y.ZodNaN,
  ..._(n)
});
const _r = Symbol("zod_brand");
class st extends b {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = t.data;
    return this._def.type._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Re extends b {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return a.status === "aborted" ? v : a.status === "dirty" ? (t.dirty(), le(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: r.path,
          parent: r
        });
      })();
    {
      const s = this._def.in._parseSync({
        data: r.data,
        path: r.path,
        parent: r
      });
      return s.status === "aborted" ? v : s.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: s.value
      }) : this._def.out._parseSync({
        data: s.value,
        path: r.path,
        parent: r
      });
    }
  }
  static create(e, t) {
    return new Re({
      in: e,
      out: t,
      typeName: y.ZodPipeline
    });
  }
}
class Me extends b {
  _parse(e) {
    const t = this._def.innerType._parse(e), r = (s) => (ie(s) && (s.value = Object.freeze(s.value)), s);
    return we(t) ? t.then((s) => r(s)) : r(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Me.create = (n, e) => new Me({
  innerType: n,
  typeName: y.ZodReadonly,
  ..._(e)
});
function it(n, e) {
  const t = typeof n == "function" ? n(e) : typeof n == "string" ? { message: n } : n;
  return typeof t == "string" ? { message: t } : t;
}
function Nt(n, e = {}, t) {
  return n ? me.create().superRefine((r, s) => {
    var a, i;
    const o = n(r);
    if (o instanceof Promise)
      return o.then((c) => {
        var d, p;
        if (!c) {
          const A = it(e, r), S = (p = (d = A.fatal) !== null && d !== void 0 ? d : t) !== null && p !== void 0 ? p : !0;
          s.addIssue({ code: "custom", ...A, fatal: S });
        }
      });
    if (!o) {
      const c = it(e, r), d = (i = (a = c.fatal) !== null && a !== void 0 ? a : t) !== null && i !== void 0 ? i : !0;
      s.addIssue({ code: "custom", ...c, fatal: d });
    }
  }) : me.create();
}
const br = {
  object: k.lazycreate
};
var y;
(function(n) {
  n.ZodString = "ZodString", n.ZodNumber = "ZodNumber", n.ZodNaN = "ZodNaN", n.ZodBigInt = "ZodBigInt", n.ZodBoolean = "ZodBoolean", n.ZodDate = "ZodDate", n.ZodSymbol = "ZodSymbol", n.ZodUndefined = "ZodUndefined", n.ZodNull = "ZodNull", n.ZodAny = "ZodAny", n.ZodUnknown = "ZodUnknown", n.ZodNever = "ZodNever", n.ZodVoid = "ZodVoid", n.ZodArray = "ZodArray", n.ZodObject = "ZodObject", n.ZodUnion = "ZodUnion", n.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", n.ZodIntersection = "ZodIntersection", n.ZodTuple = "ZodTuple", n.ZodRecord = "ZodRecord", n.ZodMap = "ZodMap", n.ZodSet = "ZodSet", n.ZodFunction = "ZodFunction", n.ZodLazy = "ZodLazy", n.ZodLiteral = "ZodLiteral", n.ZodEnum = "ZodEnum", n.ZodEffects = "ZodEffects", n.ZodNativeEnum = "ZodNativeEnum", n.ZodOptional = "ZodOptional", n.ZodNullable = "ZodNullable", n.ZodDefault = "ZodDefault", n.ZodCatch = "ZodCatch", n.ZodPromise = "ZodPromise", n.ZodBranded = "ZodBranded", n.ZodPipeline = "ZodPipeline", n.ZodReadonly = "ZodReadonly";
})(y || (y = {}));
const wr = (n, e = {
  message: `Input not instance of ${n.name}`
}) => Nt((t) => t instanceof n, e), Lt = D.create, Zt = X.create, Er = ze.create, xr = ee.create, Dt = Ee.create, kr = oe.create, Tr = Fe.create, Ar = xe.create, Ir = ke.create, Cr = me.create, Sr = ae.create, Pr = K.create, Or = $e.create, jr = U.create, Mr = k.create, Rr = k.strictCreate, Nr = Te.create, Lr = qe.create, Zr = Ae.create, Dr = J.create, Ur = Ie.create, Fr = Be.create, $r = ce.create, Br = he.create, zr = Ce.create, Jr = Se.create, Vr = te.create, qr = Pe.create, Gr = ge.create, ot = F.create, Wr = B.create, Yr = re.create, Kr = F.createWithPreprocess, Hr = Re.create, Qr = () => Lt().optional(), Xr = () => Zt().optional(), es = () => Dt().optional(), ts = {
  string: (n) => D.create({ ...n, coerce: !0 }),
  number: (n) => X.create({ ...n, coerce: !0 }),
  boolean: (n) => Ee.create({
    ...n,
    coerce: !0
  }),
  bigint: (n) => ee.create({ ...n, coerce: !0 }),
  date: (n) => oe.create({ ...n, coerce: !0 })
}, rs = v;
var u = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: pe,
  setErrorMap: Kt,
  getErrorMap: Ze,
  makeIssue: De,
  EMPTY_PATH: Ht,
  addIssueToContext: f,
  ParseStatus: C,
  INVALID: v,
  DIRTY: le,
  OK: P,
  isAborted: He,
  isDirty: Qe,
  isValid: ie,
  isAsync: we,
  get util() {
    return w;
  },
  get objectUtil() {
    return Ke;
  },
  ZodParsedType: h,
  getParsedType: q,
  ZodType: b,
  datetimeRegex: Mt,
  ZodString: D,
  ZodNumber: X,
  ZodBigInt: ee,
  ZodBoolean: Ee,
  ZodDate: oe,
  ZodSymbol: Fe,
  ZodUndefined: xe,
  ZodNull: ke,
  ZodAny: me,
  ZodUnknown: ae,
  ZodNever: K,
  ZodVoid: $e,
  ZodArray: U,
  ZodObject: k,
  ZodUnion: Te,
  ZodDiscriminatedUnion: qe,
  ZodIntersection: Ae,
  ZodTuple: J,
  ZodRecord: Ie,
  ZodMap: Be,
  ZodSet: ce,
  ZodFunction: he,
  ZodLazy: Ce,
  ZodLiteral: Se,
  ZodEnum: te,
  ZodNativeEnum: Pe,
  ZodPromise: ge,
  ZodEffects: F,
  ZodTransformer: F,
  ZodOptional: B,
  ZodNullable: re,
  ZodDefault: Oe,
  ZodCatch: je,
  ZodNaN: ze,
  BRAND: _r,
  ZodBranded: st,
  ZodPipeline: Re,
  ZodReadonly: Me,
  custom: Nt,
  Schema: b,
  ZodSchema: b,
  late: br,
  get ZodFirstPartyTypeKind() {
    return y;
  },
  coerce: ts,
  any: Cr,
  array: jr,
  bigint: xr,
  boolean: Dt,
  date: kr,
  discriminatedUnion: Lr,
  effect: ot,
  enum: Vr,
  function: Br,
  instanceof: wr,
  intersection: Zr,
  lazy: zr,
  literal: Jr,
  map: Fr,
  nan: Er,
  nativeEnum: qr,
  never: Pr,
  null: Ir,
  nullable: Yr,
  number: Zt,
  object: Mr,
  oboolean: es,
  onumber: Xr,
  optional: Wr,
  ostring: Qr,
  pipeline: Hr,
  preprocess: Kr,
  promise: Gr,
  record: Ur,
  set: $r,
  strictObject: Rr,
  string: Lt,
  symbol: Tr,
  transformer: ot,
  tuple: Dr,
  undefined: Ar,
  union: Nr,
  unknown: Sr,
  void: Or,
  NEVER: rs,
  ZodIssueCode: l,
  quotelessJson: Yt,
  ZodError: M
});
const ct = u.object({
  prompt: u.string().default(""),
  aspect_ratio: u.string().default("1:1"),
  num_outputs: u.number().int().default(1),
  num_inference_steps: u.number().int().gt(0).lt(5).default(4),
  seed: u.number().int().optional().default(() => Math.floor(Math.random() * 1e6)),
  output_format: u.string().default("jpg"),
  disable_safety_checker: u.boolean().default(!1),
  go_fast: u.boolean().default(!1)
});
class ss extends Ve {
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
      queryParams: ct.parse({})
    });
  }
  async parseResult(e) {
    return Array.isArray(e) ? Promise.all(e.map((t) => new W().fromAny(t))) : await new W().fromAny(e);
  }
  /**
   * Generate an image from a text prompt
   * @param text - Text description of the desired image
   * @param args - Additional arguments (Python *args equivalent)
   * @param kwargs - Additional options (Python **kwargs equivalent)
   * @returns TrackedJob that resolves to the generated image
   */
  text2img(e, t) {
    const r = this.getEndpoint("text2img"), s = ct.parse({
      ...t,
      prompt: e
      // Always use the text parameter as the prompt
    });
    return this.submitTrackedJob(r, s, this.parseResult);
  }
}
const dt = u.object({
  prompt: u.string().default(""),
  max_tokens: u.number().int().default(20480),
  temperature: u.number().gt(0).lt(1).default(0.1),
  presence_penalty: u.number().gte(0).lte(1).default(0),
  frequency_penalty: u.number().gte(0).lte(1).default(0),
  top_p: u.number().gte(0).lte(1).default(1)
});
class ns {
  constructor(e) {
    g(this, "answer");
    g(this, "thoughts");
    Array.isArray(e) && (e = e.join(""));
    let t = e.indexOf("<think>"), r = e.indexOf("</think>", t + 7);
    this.thoughts = e.substring(t + 7, r), this.answer = e.substring(r + 8);
  }
}
class as extends Ve {
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
      queryParams: dt.parse({})
    });
  }
  async _parse_result(e) {
    return new ns(e);
  }
  async _infer(e, t) {
    const r = this.getEndpoint("chat"), s = dt.parse({
      ...t,
      prompt: e
      // Always use the text parameter as the prompt
    });
    return this.submitTrackedJob(r, s, this._parse_result);
  }
  /**
   * Generate a chat response from a text prompt
   * @param prompt - Text prompt for the chat model
   * @param options - Additional options for the request
   * @returns Promise that resolves to the generated response text
   */
  async chat(e, t) {
    return (await this._infer(e, t)).answer;
  }
}
const be = u.union([
  u.string(),
  u.null(),
  u.instanceof(Blob),
  u.instanceof(File),
  u.instanceof(W)
  // Add Buffer type for Node.js environment
  // z.instanceof(Buffer)
]).default(null), lt = u.object({
  enhance_face_model: u.string().optional().default("gpen_bfr_512")
}), ut = u.object({
  source_img: be,
  target_img: be
}), ft = u.object({
  faces: u.union([u.string(), u.array(u.string()), u.record(u.string(), u.any())]).default(""),
  enhance_face_model: u.string().optional()
}), ht = u.object({
  face_name: u.string().default(""),
  save: u.boolean().optional().default(!1)
}), pt = u.object({
  face_name: u.string().default(""),
  include_audio: u.boolean().optional().default(!0),
  enhance_face_model: u.string().optional().default("gpen_bfr_512")
});
class is extends Ve {
  constructor() {
    super("face2face");
  }
  /**
   * Register Face2Face specific endpoints
   */
  registerEndpoints() {
    this.registerEndpoint({
      path: "swap_img_to_img",
      method: "POST",
      queryParams: lt.parse({}),
      fileParams: ut.parse({})
    }), this.registerEndpoint({
      path: "swap",
      method: "POST",
      queryParams: ft.parse({}),
      fileParams: u.object({ media: be }).parse({})
    }), this.registerEndpoint({
      path: "add_face",
      method: "POST",
      queryParams: ht.parse({}),
      fileParams: u.object({ image: be }).parse({})
    }), this.registerEndpoint({
      path: "swap_video",
      method: "POST",
      queryParams: pt.parse({}),
      fileParams: u.object({ target_video: be }).parse({})
    });
  }
  async parseResult(e) {
    return Array.isArray(e) ? Promise.all(e.map((t) => new E().fromAny(t))) : await new E().fromAny(e);
  }
  /**
   * Swap faces between a source image and target image
   * @param sourceImg - Source image containing the face to use
   * @param targetImg - Target image where the face will be swapped
   * @param options - Additional options like enhance_face_model
   * @returns TrackedJob that resolves to the processed image
   */
  async swapImg2Img(e, t, r) {
    const s = this.getEndpoint("swap-img-to-img"), a = await W.create(e), i = await W.create(t);
    if (!a || !i)
      throw new Error("Invalid source or target image");
    let o = lt.parse(r || {}), c = ut.parse({ source_img: a, target_img: i }), d = { ...o, ...c };
    return this.submitTrackedJob(s, d, this.parseResult);
  }
  /**
   * Apply face swapping on a single image with predefined faces
   * @param media - Image where faces should be swapped
   * @param options - Options including which faces to use and enhance settings
   * @returns TrackedJob that resolves to the processed image
   */
  async swap(e, t) {
    const r = this.getEndpoint("swap"), s = await E.create(e);
    if (!s)
      throw new Error("Invalid media file");
    const o = { ...ft.parse(t || {}), ...{ media: s } };
    return this.submitTrackedJob(r, o, this.parseResult);
  }
  /**
   * Add a face to the face library for later use in swapping
   * @param image - Image containing the face to add
   * @param options - Options including the face name and whether to save it
   * @returns TrackedJob that resolves to the operation result
   */
  async addFace(e, t, r = !0) {
    const s = this.getEndpoint("add_face"), a = await W.create(e);
    if (!a)
      throw new Error("Invalid image file");
    const i = ht.parse({
      image: a.toBase64(),
      face_name: t,
      save: r
    });
    return this.submitTrackedJob(s, i, this.parseResult);
  }
  /**
   * Swap faces in a video using a previously added face
   * @param targetVideo - Video where faces should be swapped
   * @param faceName - Name of the face to use (previously added with addFace)
   * @param options - Additional options like include_audio and enhance settings
   * @returns TrackedJob that resolves to the processed video
   */
  async swapVideo(e, t, r) {
    const s = this.getEndpoint("swap_video");
    if (!await Je.create(e))
      throw new Error("Invalid video file");
    const i = pt.parse({
      face_name: t,
      ...r
    });
    return this.submitTrackedJob(s, i, this.parseResult);
  }
}
const nt = u.union([
  u.string(),
  u.null(),
  u.instanceof(Blob),
  u.instanceof(File),
  u.instanceof(E),
  u.instanceof($)
  // Add Buffer type for Node.js environment
  // z.instanceof(Buffer)
]).default(null), mt = u.object({
  text: u.string().default("Hey there, you did not provide an input text!"),
  voice: u.string().optional().default("hermine"),
  semantic_temp: u.number().optional().default(0.7),
  semantic_top_k: u.number().optional().default(50),
  semantic_top_p: u.number().optional().default(0.95),
  coarse_temp: u.number().optional().default(0.7),
  coarse_top_k: u.number().optional().default(50),
  coarse_top_p: u.number().optional().default(0.95),
  fine_temp: u.number().optional().default(0.7)
}), gt = u.object({
  text: u.string().default("Hey there, you did not provide an input text!"),
  semantic_temp: u.number().optional().default(0.7),
  semantic_top_k: u.number().optional().default(50),
  semantic_top_p: u.number().optional().default(0.95),
  coarse_temp: u.number().optional().default(0.7),
  coarse_top_k: u.number().optional().default(50),
  coarse_top_p: u.number().optional().default(0.95),
  fine_temp: u.number().optional().default(0.7)
}), yt = u.object({
  voice: nt
}), vt = u.object({
  voice_name: u.string().optional().default(""),
  save: u.boolean().optional().default(!1)
}), _t = u.object({
  audio_file: nt
}), bt = u.object({
  voice_name: u.union([u.string(), u.instanceof(E)]).optional().default(""),
  temp: u.number().optional().default(0.7)
}), wt = u.object({
  audio_file: nt
});
class os extends Ve {
  constructor() {
    super("speechcraft");
  }
  /**
   * Register SpeechCraft specific endpoints
   */
  registerEndpoints() {
    this.registerEndpoint({
      path: "text2voice",
      method: "POST",
      queryParams: mt.parse({}),
      fileParams: u.object({}).parse({})
    }), this.registerEndpoint({
      path: "text2voice_with_embedding",
      method: "POST",
      queryParams: gt.parse({}),
      fileParams: yt.parse({})
    }), this.registerEndpoint({
      path: "voice2embedding",
      method: "POST",
      queryParams: vt.parse({}),
      fileParams: _t.parse({})
    }), this.registerEndpoint({
      path: "voice2voice",
      method: "POST",
      queryParams: bt.parse({}),
      fileParams: wt.parse({})
    });
  }
  async parseResult(e) {
    return Array.isArray(e) ? Promise.all(e.map((t) => new $().fromAny(t))) : await new $().fromAny(e);
  }
  /**
   * Generate realistic sounding voice from a written text.
   * @param text - Text to convert to speech
   * @param options - Additional options like voice, temperature settings, etc.
   * @returns TrackedJob that resolves to the generated audio
   */
  async text2voice(e, t) {
    const r = this.getEndpoint("text2voice"), s = mt.parse({
      text: e,
      ...t
    });
    return this.submitTrackedJob(r, s, this.parseResult);
  }
  /**
   * Generate realistic sounding voice from text using a custom voice embedding.
   * @param text - Text to convert to speech
   * @param voiceEmbedding - Voice embedding .npz file to use for voice generation
   * @param options - Additional options like temperature settings
   * @returns TrackedJob that resolves to the generated audio
   */
  async text2voiceWithEmbedding(e, t, r) {
    const s = this.getEndpoint("text2voice_with_embedding"), a = await E.create(t);
    if (!a)
      throw new Error("Invalid voice embedding file");
    const i = gt.parse({
      text: e,
      ...r
    }), o = yt.parse({
      voice: a
    }), c = { ...i, ...o };
    return this.submitTrackedJob(s, c, this.parseResult);
  }
  /**
   * Generate voice embedding from an audio file.
   * @param audio - Audio file containing the voice to embed
   * @param options - Additional options like voice_name and save flag
   * @returns TrackedJob that resolves to the generated embedding
   */
  async voice2embedding(e, t) {
    const r = this.getEndpoint("voice2embedding");
    let s;
    if (Array.isArray(e)) {
      if (e.length === 0)
        throw new Error("Empty audio array provided");
      console.log("For now creating an embedding of multiple audio files is not supported. Only the first audio file will be used."), s = await $.create(e[0]);
    } else
      s = await $.create(e);
    if (!s)
      throw new Error("Invalid audio file");
    const a = vt.parse(t || {});
    (!a.voice_name || a.voice_name.length === 0) && (a.voice_name = `new_speaker_${Math.random().toString(36).substring(2, 8)}`);
    const i = _t.parse({ audio_file: s }), o = { ...a, ...i }, c = async (d) => await new E().fromAny(d);
    return this.submitTrackedJob(r, o, c);
  }
  /**
   * Clone a voice in an audio file using a source voice.
   * @param audio - Audio file to convert
   * @param source - Source voice (embedding, name, or audio file)
   * @param options - Additional options
   * @returns TrackedJob that resolves to the converted audio
   */
  async voice2voice(e, t, r) {
    const s = this.getEndpoint("voice2voice"), a = await $.create(e);
    if (!a)
      throw new Error("Invalid audio file");
    let i = { ...r };
    if (typeof t == "string" && t.length > 0)
      await xt(t) && (t = await Q.create(t)), i.voice_name = t;
    else if (t instanceof E) {
      if (t instanceof $) {
        const p = i.voice_name ? i.voice_name : "";
        t = await this.voice2embedding(t, { voice_name: p });
      }
      i.voice_name = t;
    } else
      i.voice_name = "hermine";
    const o = bt.parse(i), c = wt.parse({ audio_file: a }), d = { ...o, ...c };
    return this.submitTrackedJob(s, d, this.parseResult);
  }
}
I.registerClientType("flux-schnell", ss);
I.registerClientType("deepseek-r1", as);
I.registerClientType("face2face", is);
I.registerClientType("speechcraft", os);
class cs {
  constructor(e = {}) {
    Y.update(e);
  }
  async text2img(e, t = "flux-schnell", r) {
    return I.getClient(t).text2img(e, r);
  }
  async chat(e, t = "deepseek-r1", r) {
    return I.getClient(t).chat(e, r);
  }
  async swapImg2Img(e, t, r = "face2face", s) {
    return I.getClient(r).swapImg2Img(e, t, s);
  }
  async text2voice(e, t = "speechcraft", r) {
    return I.getClient(t).text2voice(e, r);
  }
  async text2voiceWithEmbedding(e, t, r = "speechcraft", s) {
    return I.getClient(r).text2voiceWithEmbedding(e, t, s);
  }
  async voice2embedding(e, t = "speechcraft", r) {
    return I.getClient(t).voice2embedding(e, r);
  }
  async voice2voice(e, t, r = "speechcraft", s) {
    return I.getClient(r).voice2voice(e, t, s);
  }
  getAvailableModels() {
    return I.getAvailableClients();
  }
}
class Ut extends cs {
  constructor(t = {}) {
    super(t);
    g(this, "_jobManager");
  }
  get jobManager() {
    return this._jobManager || (this._jobManager = Le.getInstance()), this._jobManager;
  }
  /**
   * Set the API key globally
   */
  setApiKey(t) {
    Y.update({ apiKey: t });
  }
  /**
   * Set the base URL globally
   */
  setBaseUrl(t) {
    Y.update({ baseUrl: t });
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
const et = new Ut();
typeof window < "u" && (window.socaity = et);
typeof module < "u" && typeof module.exports < "u" && (module.exports = { socaity: et, SocaitySDK: Ut, APIClientFactory: I }, module.exports.default = et);
typeof process < "u" && process.on("uncaughtException", (n) => {
  if (n.name === "ApiKeyError")
    console.error(`${n.name}: ${n.message}`), process.exit(1);
  else
    throw n;
});
export {
  I as APIClientFactory,
  $ as AudioFile,
  E as MediaFile,
  Q as MediaFileFactory,
  Ut as SocaitySDK,
  os as SpeechCraft,
  Je as VideoFile,
  et as socaity
};
//# sourceMappingURL=socaity.es.js.map
