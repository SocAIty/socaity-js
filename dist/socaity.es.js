var _t = Object.defineProperty;
var vt = (r, e, t) => e in r ? _t(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var m = (r, e, t) => vt(r, typeof e != "symbol" ? e + "" : e, t);
class Je extends Error {
  constructor(e = "Invalid API key format. API keys should start with 'sk_' and be 67 characters long.") {
    super(e), this.name = "ApiKeyError", Error.captureStackTrace && Error.captureStackTrace(this, Je);
  }
}
const J = class J {
  constructor(e = {}) {
    m(this, "apiKey");
    m(this, "baseUrl");
    m(this, "pollInterval");
    m(this, "maxRetries");
    this.apiKey = e.apiKey, this.baseUrl = "https://api.socaity.ai/v0", this.pollInterval = e.pollInterval || 5e3, this.maxRetries = e.maxRetries || 3;
  }
  /**
   * Get the global configuration instance
   */
  static getInstance() {
    return J.instance || (J.instance = new J()), J.instance;
  }
  /**
   * Updates global configuration with new values
   */
  static update(e) {
    if (e.apiKey !== void 0 && (!e.apiKey.startsWith("sk_") || e.apiKey.length != 67))
      throw new Je("API key is wrong. Get your API key from the Socaity https://www.socaity.ai dashboard.");
    const t = J.getInstance();
    Object.assign(t, e);
  }
};
m(J, "instance");
let F = J;
function Se(r) {
  return r && typeof r == "object" && "file_name" in r && "content_type" in r && "content" in r;
}
function We(r) {
  try {
    const e = new URL(r);
    return e.protocol === "http:" || e.protocol === "https:";
  } catch {
    return !1;
  }
}
function Ke(r) {
  return r.startsWith("data:") || bt(r);
}
function bt(r) {
  return /^[A-Za-z0-9+/=]+$/.test(r) && r.length % 4 === 0;
}
class T {
  /**
   * Creates a new MediaFile instance.
   * 
   * @param file_name - Default filename to use
   * @param content_type - Default content type to use
   */
  constructor(e = "file", t = "application/octet-stream") {
    m(this, "content_type");
    m(this, "file_name");
    m(this, "_content", null);
    m(this, "_isNode");
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
    if (e == null)
      throw new Error("Cannot create MediaFile from null or undefined data");
    return new T().fromAny(e);
  }
  /**
   * Load a file from any supported data type.
   * 
   * @param data - Data to load (file path, URL, base64 string, etc.)
   * @param websafe - Prevents loading from file paths and malformatted base64 strings.
   * @returns Promise resolving to a MediaFile instance or null
   */
  async fromAny(e) {
    if (e instanceof T)
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
      if (We(e))
        return await this.fromUrl(e);
      if (Ke(e))
        return this.fromBase64(e);
      if (await this._isValidFilePath(e))
        return await this.fromFile(e);
      throw new Error("Invalid data type for MediaFile");
    }
    return Se(e) ? await this.fromDict(e) : this;
  }
  /** 
  Load a file from any supported data type, with additional checks for websafe content.
  Prevents loading from file paths and malformatted base64 strings.
  @param data - Data to load (file path, URL, base64 string, etc.)
  @returns Promise resolving to a MediaFile instance or null
  */
  async fromAnyWebsafe(e) {
    if (typeof e == "string" && !We(e) && !Ke(e) && !Se(e))
      throw new Error("Invalid data type for websafe MediaFile");
    return Se(e) ? await this.fromAnyWebsafe(e.content) : await this.fromAny(e);
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
      const s = await fetch(e, {
        headers: t || {
          "User-Agent": "MediaFile/1.0.0"
        }
      });
      if (!s.ok)
        throw new Error(`HTTP error! Status: ${s.status}`);
      this.content_type = s.headers.get("content-type") || "application/octet-stream";
      const n = s.headers.get("content-disposition");
      if (n) {
        const a = n.match(/filename=(?:['"]?)([^'";\n]+)/i);
        a && a[1] && (this.file_name = a[1]);
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
      const a = 10240;
      for (let i = 0; i < s.length; i += a) {
        const o = s.subarray(i, Math.min(i + a, s.length));
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
        const s = await import("fs/promises").then((i) => i.default || i), n = await import("path").then((i) => i.default || i);
        if (!n || typeof n.dirname != "function")
          throw new Error("Failed to load 'path' module.");
        const a = n.dirname(t);
        a !== "." && await s.mkdir(a, { recursive: !0 }).catch(() => {
        }), await s.writeFile(t, Buffer.from(this._content));
      } catch (s) {
        throw new Error(`Failed to save file: ${s.message}`);
      }
    else {
      const s = this.toBlob(), n = URL.createObjectURL(s), a = document.createElement("a");
      a.href = n, a.download = t, document.body.appendChild(a), a.click(), setTimeout(() => {
        document.body.removeChild(a), URL.revokeObjectURL(n);
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
        const a = require("mime-types").lookup(this.file_name);
        if (a) {
          this.content_type = a;
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
      const [t, s] = e.split(",", 2), n = t.match(/^data:([^;,]+)/), a = n ? n[1] : null;
      return { data: s, mediaType: a };
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
  async _isValidFilePath(e) {
    if (!this._isNode)
      return !1;
    try {
      return (await (await import("fs/promises")).stat(e)).isFile();
    } catch {
      return !1;
    }
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
}
class wt {
  // 60 seconds timeout for uploads
  /**
   * Create a new FastCloud instance
   * @param config FastCloud configuration
   */
  constructor(e) {
    m(this, "uploadEndpoint");
    m(this, "apiKey");
    m(this, "defaultTimeout", 6e4);
    this.uploadEndpoint = e.uploadEndpoint || "https://api.socaity.ai/v0/files", this.apiKey = e.apiKey;
  }
  /**
   * Get authentication headers for requests
   * @returns Headers object with authentication
   */
  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    };
  }
  /**
   * Process the upload response to extract file URLs
   * @param response Response from the upload endpoint
   * @returns Array of temporary upload URLs
   */
  async processUploadResponse(e) {
    if (!e.ok)
      throw new Error(`Failed to get temporary upload URL: ${e.status} ${e.statusText}`);
    const t = await e.json();
    return Array.isArray(t) ? t : [t];
  }
  /**
   * Upload a file to a temporary URL
   * @param sasUrl Temporary URL for uploading
   * @param file File to upload
   */
  async uploadToTemporaryUrl(e, t) {
    const s = {
      "x-ms-blob-type": "BlockBlob",
      "x-ms-if-none-match": "*"
    }, n = t instanceof T ? await t.toArrayBuffer() : t, a = await fetch(e, {
      method: "PUT",
      headers: s,
      body: n
    });
    if (a.status !== 201)
      throw new Error(`Failed to upload to temporary URL ${e}. Response: ${a.statusText}`);
  }
  /**
   * Upload a single file
   * @param file File to upload
   * @returns URL of the uploaded file
   */
  async upload(e) {
    const t = Array.isArray(e) ? e : [e], s = t.map((o) => o.extension).filter((o) => o !== null), n = await fetch(this.uploadEndpoint, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        n_files: t.length,
        file_extensions: s.length > 0 ? s : void 0
      }),
      signal: AbortSignal.timeout(this.defaultTimeout)
    }), a = await this.processUploadResponse(n), i = a.map(
      (o, l) => this.uploadToTemporaryUrl(o, t[l])
    );
    return await Promise.all(i), t.length === 1 ? a[0] : a;
  }
  /**
   * Download a file from a URL
   * @param url URL to download from
   * @param savePath Optional path to save the file to
   * @returns MediaFile object or save path if specified
   */
  async download(e, t) {
    const s = await new T(e).fromUrl(e, this.getAuthHeaders());
    return t ? (await s.save(t), t) : s;
  }
}
class Ve {
  constructor() {
    m(this, "config");
    m(this, "uploadFileThresholdMB", 1);
    m(this, "maxFileUploadLimitMB", 1e3);
    m(this, "fastCloud");
    m(this, "abortController");
    this.config = F.getInstance(), this.abortController = new AbortController(), this.fastCloud = new wt({
      uploadEndpoint: `${this.config.baseUrl}/v0/files`,
      apiKey: this.config.apiKey ? this.config.apiKey : ""
    });
  }
  /**
   * Match request parameters against defined parameters
   * @param definingParams Expected parameters
   * @param params Actual parameters
   */
  matchParams(e, t) {
    const s = {};
    for (const [n, a] of Object.entries(e))
      n in t ? s[n] = t[n] : a !== void 0 && (s[n] = a);
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
   * Parse file parameters for the request
   * @param endpoint Endpoint metadata
   * @param params Request parameters
   * @returns Processed file parameters
   */
  async parseFileParams(e, t) {
    if (!e.fileParams)
      return {};
    const s = this.matchParams(e.fileParams, t), n = {};
    try {
      let a = 0;
      const i = {};
      for (const [o, l] of Object.entries(s))
        if (typeof l == "string" && l.startsWith("http"))
          n[o] = l;
        else {
          let d = l;
          try {
            d = l instanceof T ? l : await T.create(l);
          } catch (p) {
            console.log(`Failed to convert ${o} to MediaFile`, p);
          }
          if (!(d instanceof T))
            continue;
          i[o] = d, a += d.fileSize("mb");
        }
      if (a > this.maxFileUploadLimitMB)
        throw new Error(`Total file size exceeds maximum limit of ${this.maxFileUploadLimitMB}MB`);
      if (a > this.uploadFileThresholdMB)
        if (Object.keys(i).length > 1) {
          const o = Object.values(i), l = await this.fastCloud.upload(o);
          Object.keys(i).forEach((d, p) => {
            n[d] = l[p];
          });
        } else
          for (const [o, l] of Object.entries(i))
            n[o] = await this.fastCloud.upload(l);
      else
        for (const [o, l] of Object.entries(i))
          n[o] = l.toBlob();
      return n;
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
    return t;
  }
  /**
   * Build query string from parameters
   * @private
   */
  buildQueryString(e) {
    if (!e || Object.keys(e).length === 0) return "";
    const t = new URLSearchParams();
    for (const [n, a] of Object.entries(e))
      a != null && (typeof a == "object" ? t.append(n, JSON.stringify(a)) : t.append(n, String(a)));
    const s = t.toString();
    return s ? `?${s}` : "";
  }
  /**
   * Format error response from fetch
   * @private
   */
  async formatErrorResponse(e) {
    const t = e.status;
    let s;
    try {
      const n = e.headers.get("content-type");
      if (n && n.includes("application/json")) {
        const a = await e.json();
        s = JSON.stringify(a);
      } else
        s = await e.text();
    } catch {
      s = "Could not parse error response";
    }
    return new Error(`API error (${t}): ${s}`);
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
  async sendRequest(e, t = "POST", s = {}, n = {}, a = {}, i) {
    const o = this.validateAPIKey(i);
    this.abortController = new AbortController();
    const { signal: l } = this.abortController, d = {
      Authorization: `Bearer ${o}`
    };
    let p = `${this.config.baseUrl}/${e}`, E = null;
    if (t === "GET") {
      const S = { ...s, ...n, ...a };
      p += this.buildQueryString(S);
    } else if (Object.keys(a).length > 0) {
      p += this.buildQueryString({ ...s, ...n });
      const j = new FormData();
      Object.entries(a).forEach(([ce, Ce]) => {
        Ce != null && (console.log(`File param ${ce} type:`, Object.prototype.toString.call(Ce)), j.append(ce, Ce));
      }), E = j;
    } else
      p += this.buildQueryString(s), d["Content-Type"] = "application/json", E = Object.keys(n).length > 0 ? JSON.stringify(n) : null;
    try {
      const S = setTimeout(() => {
        this.abort();
      }, 3e4), j = await fetch(p, {
        method: t,
        headers: d,
        body: E,
        signal: l
      });
      if (clearTimeout(S), !j.ok)
        throw await this.formatErrorResponse(j);
      const ce = j.headers.get("content-type");
      return ce && ce.includes("application/json") ? await j.json() : await j.text();
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
  async request_endpoint(e, t, s) {
    const n = this.parseQueryParams(e, t), a = this.parseBodyParams(e, t), i = await this.parseFileParams(e, t);
    return this.sendRequest(
      e.path,
      e.method,
      n,
      a,
      i,
      s
    );
  }
  /**
   * Abort any ongoing requests
   */
  abort() {
    this.abortController.abort(), this.abortController = new AbortController();
  }
}
var A = /* @__PURE__ */ ((r) => (r.CREATED = "CREATED", r.QUEUED = "QUEUED", r.PROCESSING = "PROCESSING", r.COMPLETED = "COMPLETED", r.FAILED = "FAILED", r))(A || {}), k = /* @__PURE__ */ ((r) => (r.INITIALIZING = "INITIALIZING", r.PREPARING = "PREPARING", r.SENDING = "SENDING", r.TRACKING = "TRACKING", r.PROCESSING_RESULT = "PROCESSING_RESULT", r.COMPLETED = "COMPLETED", r.FAILED = "FAILED", r))(k || {});
class xt {
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
      return A.COMPLETED;
    if (t === "FAILED" || t === "ERROR")
      return A.FAILED;
    if (t === "IN_PROGRESS" || t === "PROCESSING" || t === "RUNNING" || t === "BOOTING")
      return A.PROCESSING;
    if (t === "QUEUED" || t === "PENDING" || t === "IN_QUEUE" || t === "STARTING")
      return A.QUEUED;
    if (e.state) {
      const s = e.state.toUpperCase();
      if (s === "COMPLETED") return A.COMPLETED;
      if (s === "FAILED") return A.FAILED;
      if (s === "IN_PROGRESS") return A.PROCESSING;
      if (s === "IN_QUEUE") return A.QUEUED;
      if (s === "CANCELLED" || s === "TIMED_OUT") return A.FAILED;
    }
    return A.CREATED;
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
    return this.parseStatus(e) === A.COMPLETED && (t = 1), {
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
    if (Se(e))
      try {
        return await new T().fromDict(e);
      } catch {
        return e;
      }
    return e;
  }
}
const K = class K {
  /**
   * Private constructor to enforce singleton pattern
   * @param requestHandler - RequestHandler for API communication
   */
  constructor(e) {
    m(this, "requestHandler");
    m(this, "config");
    m(this, "jobs");
    m(this, "responseParser");
    m(this, "mediaHandler");
    this.requestHandler = e, this.config = F.getInstance(), this.jobs = /* @__PURE__ */ new Map(), this.responseParser = new xt(), this.mediaHandler = new T();
  }
  /**
   * Get the singleton instance of JobManager
   * @param requestHandler - Optional RequestHandler to use when creating the instance
   * @returns The JobManager instance
   */
  static getInstance(e) {
    return K.instance || (e || (e = new Ve()), K.instance = new K(e)), K.instance;
  }
  /**
   * Submit a new job to the API
   * @param endpoint - API endpoint to call
   * @param params - Parameters for the job
   * @param apiKey - Optional API key to use for this request
   * @param file - Optional file to include
   * @returns Promise resolving to the created job
   */
  async submitJob(e, t, s) {
    try {
      const n = await this.requestHandler.request_endpoint(e, t, s);
      if (!this.responseParser.canParse(n))
        throw new Error("Unexpected response format from API");
      const a = await this.responseParser.parse(n);
      return this.jobs.set(a.id, a), a;
    } catch (n) {
      throw n instanceof Error ? n : new Error(`Failed to submit job: ${String(n)}`);
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
        if (this.jobs.set(e.id, n), n.status === A.COMPLETED)
          return n.result;
        if (n.status === A.FAILED)
          throw new Error(`Job failed: ${n.error}`);
        await new Promise((a) => setTimeout(a, this.config.pollInterval));
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
      (t.status === A.COMPLETED || t.status === A.FAILED) && this.jobs.delete(e);
  }
};
m(K, "instance");
let Ie = K;
const ue = typeof process < "u" && process.stdout && process.stdout.clearLine;
let re;
if (ue)
  try {
    re = require("cli-progress");
  } catch {
    console.warn("cli-progress package not found. Using basic console output for progress.");
  }
const H = class H {
  constructor() {
    m(this, "multiBar");
    m(this, "bars", /* @__PURE__ */ new Map());
    m(this, "isInitialized", !1);
    ue && re && (this.multiBar = new re.MultiBar({
      clearOnComplete: !1,
      hideCursor: !0,
      format: "{bar} {percentage}% | {jobId} | {phase} | {message}"
    }), this.isInitialized = !0);
  }
  static getInstance() {
    return H.instance || (H.instance = new H()), H.instance;
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
m(H, "instance");
let De = H;
class kt {
  constructor(e, t, s, n, a = !0) {
    m(this, "apiJob");
    m(this, "endpoint");
    m(this, "processingState");
    m(this, "jobManager");
    m(this, "result", null);
    m(this, "error", null);
    m(this, "completed", !1);
    m(this, "resolvePromise");
    m(this, "rejectPromise");
    m(this, "promise");
    m(this, "eventListeners", /* @__PURE__ */ new Map());
    m(this, "verbose");
    m(this, "progressBar", null);
    m(this, "progressBarManager");
    m(this, "parseResultCallbacks", []);
    // Keep track of the last logged message to avoid duplicates
    m(this, "_lastLoggedMessage", null);
    this.apiJob = e, this.jobManager = t, this.endpoint = s, this.verbose = a, this.processingState = {
      phase: k.INITIALIZING,
      progress: 0
    }, this.progressBarManager = De.getInstance(), this.promise = new Promise((i, o) => {
      this.resolvePromise = i, this.rejectPromise = o;
    }), n && this.onParseResult(n), setTimeout(() => this.startTracking(), 0), this.verbose && this.initProgressDisplay();
  }
  /**
   * Initialize the progress display
   */
  initProgressDisplay() {
    this.verbose && (ue && re ? (this.progressBar = this.progressBarManager.createBar(
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
    ue && re && this.progressBar ? this.progressBarManager.updateBar(this.apiJob.id, t, {
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
    if (e === k.TRACKING && ((t = this.apiJob.progress) != null && t.progress))
      return Math.round(this.apiJob.progress.progress * 100);
    switch (e) {
      case k.INITIALIZING:
        return 0;
      case k.PREPARING:
        return 5;
      case k.SENDING:
        return 10;
      case k.TRACKING:
        return 15;
      case k.PROCESSING_RESULT:
        return 90;
      case k.COMPLETED:
        return 100;
      case k.FAILED:
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
    if (e === k.INITIALIZING || e === k.PREPARING || e === k.SENDING)
      return `${e} job | API: ${this.endpoint.path}`;
    if (e === k.TRACKING) {
      const n = this.apiJob.progress ? `${Math.round(this.apiJob.progress.progress * 100)}%` : "unknown";
      let a = `Job ${t} | Progress: ${n} | API: ${this.endpoint.path}`;
      return (s = this.apiJob.progress) != null && s.message && (a += ` | ${this.apiJob.progress.message}`), a;
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
    ue && re && this.progressBar && (this.progressBarManager.removeBar(this.apiJob.id), this.progressBar = null);
    const e = this.processingState.phase;
    e === k.COMPLETED ? console.log(`✓ Job ${this.apiJob.id} completed successfully (${this.endpoint.path})`) : e === k.FAILED && console.log(`✗ Job ${this.apiJob.id} failed: ${this.processingState.message} (${this.endpoint.path})`);
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
        const t = await this.jobManager.responseParser.parse(e);
        if (this.apiJob = t, this.emitJobUpdate(), this.verbose && this.updateProgressDisplay(), t.status === A.COMPLETED) {
          this.updateProcessingState(k.PROCESSING_RESULT, 0.9, "Processing result");
          try {
            this.result = await t.result, this.result = await this.runParseResultCallbacks(this.result), this.complete();
          } catch (s) {
            this.fail(s instanceof Error ? s : new Error(String(s)));
          }
        } else t.status === A.FAILED ? (this.updateProcessingState(k.FAILED, 1, t.error || "Job failed"), this.fail(new Error(t.error || "Job failed with no error message"))) : setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
      } catch (e) {
        console.error("Error polling job status:", e), setTimeout(() => this.pollJobStatus(), this.jobManager.config.pollInterval);
      }
  }
  /**
   * Start tracking the job
   */
  startTracking() {
    this.updateProcessingState(k.TRACKING, 0, "Tracking job status"), this.pollJobStatus();
  }
  /**
   * Mark the job as completed
   */
  complete() {
    this.updateProcessingState(k.COMPLETED, 1, "Job completed"), this.cleanup(), this.completed = !0, this.emit("completed", this.result), this.resolvePromise(this.result);
  }
  /**
   * Mark the job as failed
   */
  fail(e) {
    this.updateProcessingState(k.FAILED, 1, e.message), this.cleanup(), this.completed = !0, this.error = e, this.emit("failed", e), this.rejectPromise(e);
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
    for (const s of this.parseResultCallbacks) {
      const n = await s(t);
      n !== void 0 && (t = n);
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
const P = class P {
  constructor() {
    m(this, "registeredClients", /* @__PURE__ */ new Map());
    m(this, "clientConstructors", /* @__PURE__ */ new Map());
  }
  static getInstance() {
    return P.instance || (P.instance = new P()), P.instance;
  }
  static registerClientType(e, t) {
    const s = P.getInstance(), n = P.normalizeClientName(e);
    s.clientConstructors.set(n, t);
  }
  static registerClient(e) {
    const t = P.getInstance(), s = P.normalizeClientName(e.name);
    t.registeredClients.set(s, e);
  }
  static getClient(e) {
    const t = P.getInstance(), s = P.normalizeClientName(e);
    let n = t.registeredClients.get(s);
    if (!n) {
      const a = t.clientConstructors.get(s);
      if (!a)
        throw new Error(
          `Client "${e}" not found. Available clients: ${Array.from(t.clientConstructors.keys()).join(", ")}`
        );
      n = new a(), t.registeredClients.set(s, n);
    }
    return n;
  }
  static getAvailableClients() {
    const e = P.getInstance();
    return Array.from(e.clientConstructors.keys());
  }
  static normalizeClientName(e) {
    return e.toLowerCase().replace(/[^a-z0-9-]/g, "");
  }
};
m(P, "instance");
let M = P;
class qe {
  constructor(e) {
    m(this, "requestHandler");
    m(this, "config");
    m(this, "endpoints");
    m(this, "jobManager");
    // Name of the API client. Has influence on path variable in the requests which will be formatted like /api/v1/{name}/{endpoint}
    m(this, "name");
    this.name = this.sanitizePath(e), this.config = F.getInstance(), this.requestHandler = new Ve(), this.endpoints = /* @__PURE__ */ new Map(), this.jobManager = Ie.getInstance(this.requestHandler), this.registerEndpoints(), M.registerClient(this);
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
    F.update(e);
  }
  /**
   * Submit a job to the API and return a TrackedJob for monitoring
   * @param endpoint - API endpoint path
   * @param params - Request parameters
   * @param apiKey - Optional API key to override the default
   * @param file - Optional file to upload
   * @returns A TrackedJob for monitoring the job
   */
  async submitTrackedJob(e, t, s, n, a = !0) {
    const i = await this.jobManager.submitJob(e, t, n);
    return new kt(i, this.jobManager, e, s, a);
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
(function(r) {
  r.assertEqual = (n) => n;
  function e(n) {
  }
  r.assertIs = e;
  function t(n) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (n) => {
    const a = {};
    for (const i of n)
      a[i] = i;
    return a;
  }, r.getValidEnumValues = (n) => {
    const a = r.objectKeys(n).filter((o) => typeof n[n[o]] != "number"), i = {};
    for (const o of a)
      i[o] = n[o];
    return r.objectValues(i);
  }, r.objectValues = (n) => r.objectKeys(n).map(function(a) {
    return n[a];
  }), r.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
    const a = [];
    for (const i in n)
      Object.prototype.hasOwnProperty.call(n, i) && a.push(i);
    return a;
  }, r.find = (n, a) => {
    for (const i of n)
      if (a(i))
        return i;
  }, r.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && isFinite(n) && Math.floor(n) === n;
  function s(n, a = " | ") {
    return n.map((i) => typeof i == "string" ? `'${i}'` : i).join(a);
  }
  r.joinValues = s, r.jsonStringifyReplacer = (n, a) => typeof a == "bigint" ? a.toString() : a;
})(w || (w = {}));
var $e;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})($e || ($e = {}));
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
]), U = (r) => {
  switch (typeof r) {
    case "undefined":
      return h.undefined;
    case "string":
      return h.string;
    case "number":
      return isNaN(r) ? h.nan : h.number;
    case "boolean":
      return h.boolean;
    case "function":
      return h.function;
    case "bigint":
      return h.bigint;
    case "symbol":
      return h.symbol;
    case "object":
      return Array.isArray(r) ? h.array : r === null ? h.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? h.promise : typeof Map < "u" && r instanceof Map ? h.map : typeof Set < "u" && r instanceof Set ? h.set : typeof Date < "u" && r instanceof Date ? h.date : h.object;
    default:
      return h.unknown;
  }
}, c = w.arrayToEnum([
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
]), Tt = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class N extends Error {
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
    const t = e || function(a) {
      return a.message;
    }, s = { _errors: [] }, n = (a) => {
      for (const i of a.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(n);
        else if (i.code === "invalid_return_type")
          n(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          n(i.argumentsError);
        else if (i.path.length === 0)
          s._errors.push(t(i));
        else {
          let o = s, l = 0;
          for (; l < i.path.length; ) {
            const d = i.path[l];
            l === i.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(i))) : o[d] = o[d] || { _errors: [] }, o = o[d], l++;
          }
        }
    };
    return n(this), s;
  }
  static assert(e) {
    if (!(e instanceof N))
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
    const t = {}, s = [];
    for (const n of this.issues)
      n.path.length > 0 ? (t[n.path[0]] = t[n.path[0]] || [], t[n.path[0]].push(e(n))) : s.push(e(n));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
N.create = (r) => new N(r);
const ae = (r, e) => {
  let t;
  switch (r.code) {
    case c.invalid_type:
      r.received === h.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case c.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, w.jsonStringifyReplacer)}`;
      break;
    case c.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${w.joinValues(r.keys, ", ")}`;
      break;
    case c.invalid_union:
      t = "Invalid input";
      break;
    case c.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${w.joinValues(r.options)}`;
      break;
    case c.invalid_enum_value:
      t = `Invalid enum value. Expected ${w.joinValues(r.options)}, received '${r.received}'`;
      break;
    case c.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case c.invalid_return_type:
      t = "Invalid function return type";
      break;
    case c.invalid_date:
      t = "Invalid date";
      break;
    case c.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : w.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case c.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case c.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case c.custom:
      t = "Invalid input";
      break;
    case c.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case c.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case c.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, w.assertNever(r);
  }
  return { message: t };
};
let it = ae;
function Et(r) {
  it = r;
}
function Pe() {
  return it;
}
const Ne = (r) => {
  const { data: e, path: t, errorMaps: s, issueData: n } = r, a = [...t, ...n.path || []], i = {
    ...n,
    path: a
  };
  if (n.message !== void 0)
    return {
      ...n,
      path: a,
      message: n.message
    };
  let o = "";
  const l = s.filter((d) => !!d).slice().reverse();
  for (const d of l)
    o = d(i, { data: e, defaultError: o }).message;
  return {
    ...n,
    path: a,
    message: o
  };
}, At = [];
function u(r, e) {
  const t = Pe(), s = Ne({
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
      t === ae ? void 0 : ae
      // then global default map
    ].filter((n) => !!n)
  });
  r.common.issues.push(s);
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
    const s = [];
    for (const n of t) {
      if (n.status === "aborted")
        return y;
      n.status === "dirty" && e.dirty(), s.push(n.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const n of t) {
      const a = await n.key, i = await n.value;
      s.push({
        key: a,
        value: i
      });
    }
    return C.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const n of t) {
      const { key: a, value: i } = n;
      if (a.status === "aborted" || i.status === "aborted")
        return y;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof i.value < "u" || n.alwaysSet) && (s[a.value] = i.value);
    }
    return { status: e.value, value: s };
  }
}
const y = Object.freeze({
  status: "aborted"
}), se = (r) => ({ status: "dirty", value: r }), I = (r) => ({ status: "valid", value: r }), Ue = (r) => r.status === "aborted", Fe = (r) => r.status === "dirty", Y = (r) => r.status === "valid", fe = (r) => typeof Promise < "u" && r instanceof Promise;
function je(r, e, t, s) {
  if (typeof e == "function" ? r !== e || !0 : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function ot(r, e, t, s, n) {
  if (typeof e == "function" ? r !== e || !0 : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var f;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(f || (f = {}));
var le, de;
class L {
  constructor(e, t, s, n) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const He = (r, e) => {
  if (Y(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new N(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function v(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: n } = r;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (i, o) => {
    var l, d;
    const { message: p } = r;
    return i.code === "invalid_enum_value" ? { message: p ?? o.defaultError } : typeof o.data > "u" ? { message: (l = p ?? s) !== null && l !== void 0 ? l : o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: (d = p ?? t) !== null && d !== void 0 ? d : o.defaultError };
  }, description: n };
}
class b {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return U(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: U(e.data),
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
        parsedType: U(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (fe(t))
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
      parsedType: U(e)
    }, a = this._parseSync({ data: e, path: n.path, parent: n });
    return He(n, a);
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
      parsedType: U(e)
    };
    if (!this["~standard"].async)
      try {
        const a = this._parseSync({ data: e, path: [], parent: n });
        return Y(a) ? {
          value: a.value
        } : {
          issues: n.common.issues
        };
      } catch (a) {
        !((s = (t = a == null ? void 0 : a.message) === null || t === void 0 ? void 0 : t.toLowerCase()) === null || s === void 0) && s.includes("encountered") && (this["~standard"].async = !0), n.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: n }).then((a) => Y(a) ? {
      value: a.value
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
      parsedType: U(e)
    }, n = this._parse({ data: e, path: s.path, parent: s }), a = await (fe(n) ? n : Promise.resolve(n));
    return He(s, a);
  }
  refine(e, t) {
    const s = (n) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(n) : t;
    return this._refinement((n, a) => {
      const i = e(n), o = () => a.addIssue({
        code: c.custom,
        ...s(n)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((l) => l ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, n) => e(s) ? !0 : (n.addIssue(typeof t == "function" ? t(s, n) : t), !1));
  }
  _refinement(e) {
    return new Z({
      schema: this,
      typeName: g.ZodEffects,
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
    return W.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return O.create(this);
  }
  promise() {
    return oe.create(this, this._def);
  }
  or(e) {
    return ye.create([this, e], this._def);
  }
  and(e) {
    return _e.create(this, e, this._def);
  }
  transform(e) {
    return new Z({
      ...v(this._def),
      schema: this,
      typeName: g.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ke({
      ...v(this._def),
      innerType: this,
      defaultValue: t,
      typeName: g.ZodDefault
    });
  }
  brand() {
    return new Ge({
      typeName: g.ZodBranded,
      type: this,
      ...v(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Te({
      ...v(this._def),
      innerType: this,
      catchValue: t,
      typeName: g.ZodCatch
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
    return Ae.create(this, e);
  }
  readonly() {
    return Ee.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Ct = /^c[^\s-]{8,}$/i, St = /^[0-9a-z]+$/, It = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Pt = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Nt = /^[a-z0-9_-]{21}$/i, jt = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Rt = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Ot = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Zt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Le;
const Mt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Bt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Lt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Dt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, $t = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Ut = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, ct = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Ft = new RegExp(`^${ct}$`);
function lt(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function zt(r) {
  return new RegExp(`^${lt(r)}$`);
}
function dt(r) {
  let e = `${ct}T${lt(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Jt(r, e) {
  return !!((e === "v4" || !e) && Mt.test(r) || (e === "v6" || !e) && Lt.test(r));
}
function Vt(r, e) {
  if (!jt.test(r))
    return !1;
  try {
    const [t] = r.split("."), s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n = JSON.parse(atob(s));
    return !(typeof n != "object" || n === null || !n.typ || !n.alg || e && n.alg !== e);
  } catch {
    return !1;
  }
}
function qt(r, e) {
  return !!((e === "v4" || !e) && Bt.test(r) || (e === "v6" || !e) && Dt.test(r));
}
class R extends b {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== h.string) {
      const a = this._getOrReturnCtx(e);
      return u(a, {
        code: c.invalid_type,
        expected: h.string,
        received: a.parsedType
      }), y;
    }
    const s = new C();
    let n;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (n = this._getOrReturnCtx(e, n), u(n, {
          code: c.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), s.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (n = this._getOrReturnCtx(e, n), u(n, {
          code: c.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), s.dirty());
      else if (a.kind === "length") {
        const i = e.data.length > a.value, o = e.data.length < a.value;
        (i || o) && (n = this._getOrReturnCtx(e, n), i ? u(n, {
          code: c.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : o && u(n, {
          code: c.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), s.dirty());
      } else if (a.kind === "email")
        Ot.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "email",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "emoji")
        Le || (Le = new RegExp(Zt, "u")), Le.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "emoji",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "uuid")
        Pt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "uuid",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "nanoid")
        Nt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "nanoid",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "cuid")
        Ct.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "cuid",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "cuid2")
        St.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "cuid2",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "ulid")
        It.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "ulid",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          n = this._getOrReturnCtx(e, n), u(n, {
            validation: "url",
            code: c.invalid_string,
            message: a.message
          }), s.dirty();
        }
      else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "regex",
        code: c.invalid_string,
        message: a.message
      }), s.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: { includes: a.value, position: a.position },
        message: a.message
      }), s.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: { startsWith: a.value },
        message: a.message
      }), s.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: { endsWith: a.value },
        message: a.message
      }), s.dirty()) : a.kind === "datetime" ? dt(a).test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: "datetime",
        message: a.message
      }), s.dirty()) : a.kind === "date" ? Ft.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: "date",
        message: a.message
      }), s.dirty()) : a.kind === "time" ? zt(a).test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: "time",
        message: a.message
      }), s.dirty()) : a.kind === "duration" ? Rt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "duration",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "ip" ? Jt(e.data, a.version) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "ip",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "jwt" ? Vt(e.data, a.alg) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "jwt",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "cidr" ? qt(e.data, a.version) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "cidr",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "base64" ? $t.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "base64",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "base64url" ? Ut.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "base64url",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : w.assertNever(a);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((n) => e.test(n), {
      validation: t,
      code: c.invalid_string,
      ...f.errToObj(s)
    });
  }
  _addCheck(e) {
    return new R({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...f.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...f.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...f.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...f.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...f.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...f.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...f.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...f.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...f.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...f.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...f.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...f.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...f.errToObj(e) });
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
      ...f.errToObj(e == null ? void 0 : e.message)
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
      ...f.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...f.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...f.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...f.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...f.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...f.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...f.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...f.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...f.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, f.errToObj(e));
  }
  trim() {
    return new R({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new R({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new R({
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
R.create = (r) => {
  var e;
  return new R({
    checks: [],
    typeName: g.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...v(r)
  });
};
function Gt(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, n = t > s ? t : s, a = parseInt(r.toFixed(n).replace(".", "")), i = parseInt(e.toFixed(n).replace(".", ""));
  return a % i / Math.pow(10, n);
}
class V extends b {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== h.number) {
      const a = this._getOrReturnCtx(e);
      return u(a, {
        code: c.invalid_type,
        expected: h.number,
        received: a.parsedType
      }), y;
    }
    let s;
    const n = new C();
    for (const a of this._def.checks)
      a.kind === "int" ? w.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), n.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), n.dirty()) : a.kind === "multipleOf" ? Gt(e.data, a.value) !== 0 && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), n.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.not_finite,
        message: a.message
      }), n.dirty()) : w.assertNever(a);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, f.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, f.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, f.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, f.toString(t));
  }
  setLimit(e, t, s, n) {
    return new V({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: f.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new V({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: f.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: f.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: f.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: f.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: f.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: f.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: f.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: f.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: f.toString(e)
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
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
V.create = (r) => new V({
  checks: [],
  typeName: g.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...v(r)
});
class q extends b {
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
    let s;
    const n = new C();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), n.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), n.dirty()) : w.assertNever(a);
    return { status: n.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return u(t, {
      code: c.invalid_type,
      expected: h.bigint,
      received: t.parsedType
    }), y;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, f.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, f.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, f.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, f.toString(t));
  }
  setLimit(e, t, s, n) {
    return new q({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: f.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new q({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: f.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: f.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: f.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: f.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: f.toString(t)
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
q.create = (r) => {
  var e;
  return new q({
    checks: [],
    typeName: g.ZodBigInt,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...v(r)
  });
};
class pe extends b {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== h.boolean) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.boolean,
        received: s.parsedType
      }), y;
    }
    return I(e.data);
  }
}
pe.create = (r) => new pe({
  typeName: g.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...v(r)
});
class X extends b {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== h.date) {
      const a = this._getOrReturnCtx(e);
      return u(a, {
        code: c.invalid_type,
        expected: h.date,
        received: a.parsedType
      }), y;
    }
    if (isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return u(a, {
        code: c.invalid_date
      }), y;
    }
    const s = new C();
    let n;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), s.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), s.dirty()) : w.assertNever(a);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new X({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: f.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: f.toString(t)
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
X.create = (r) => new X({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: g.ZodDate,
  ...v(r)
});
class Re extends b {
  _parse(e) {
    if (this._getType(e) !== h.symbol) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.symbol,
        received: s.parsedType
      }), y;
    }
    return I(e.data);
  }
}
Re.create = (r) => new Re({
  typeName: g.ZodSymbol,
  ...v(r)
});
class me extends b {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.undefined,
        received: s.parsedType
      }), y;
    }
    return I(e.data);
  }
}
me.create = (r) => new me({
  typeName: g.ZodUndefined,
  ...v(r)
});
class ge extends b {
  _parse(e) {
    if (this._getType(e) !== h.null) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.null,
        received: s.parsedType
      }), y;
    }
    return I(e.data);
  }
}
ge.create = (r) => new ge({
  typeName: g.ZodNull,
  ...v(r)
});
class ie extends b {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return I(e.data);
  }
}
ie.create = (r) => new ie({
  typeName: g.ZodAny,
  ...v(r)
});
class Q extends b {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return I(e.data);
  }
}
Q.create = (r) => new Q({
  typeName: g.ZodUnknown,
  ...v(r)
});
class z extends b {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return u(t, {
      code: c.invalid_type,
      expected: h.never,
      received: t.parsedType
    }), y;
  }
}
z.create = (r) => new z({
  typeName: g.ZodNever,
  ...v(r)
});
class Oe extends b {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.void,
        received: s.parsedType
      }), y;
    }
    return I(e.data);
  }
}
Oe.create = (r) => new Oe({
  typeName: g.ZodVoid,
  ...v(r)
});
class O extends b {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== h.array)
      return u(t, {
        code: c.invalid_type,
        expected: h.array,
        received: t.parsedType
      }), y;
    if (n.exactLength !== null) {
      const i = t.data.length > n.exactLength.value, o = t.data.length < n.exactLength.value;
      (i || o) && (u(t, {
        code: i ? c.too_big : c.too_small,
        minimum: o ? n.exactLength.value : void 0,
        maximum: i ? n.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: n.exactLength.message
      }), s.dirty());
    }
    if (n.minLength !== null && t.data.length < n.minLength.value && (u(t, {
      code: c.too_small,
      minimum: n.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.minLength.message
    }), s.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (u(t, {
      code: c.too_big,
      maximum: n.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => n.type._parseAsync(new L(t, i, t.path, o)))).then((i) => C.mergeArray(s, i));
    const a = [...t.data].map((i, o) => n.type._parseSync(new L(t, i, t.path, o)));
    return C.mergeArray(s, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new O({
      ...this._def,
      minLength: { value: e, message: f.toString(t) }
    });
  }
  max(e, t) {
    return new O({
      ...this._def,
      maxLength: { value: e, message: f.toString(t) }
    });
  }
  length(e, t) {
    return new O({
      ...this._def,
      exactLength: { value: e, message: f.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
O.create = (r, e) => new O({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: g.ZodArray,
  ...v(e)
});
function te(r) {
  if (r instanceof x) {
    const e = {};
    for (const t in r.shape) {
      const s = r.shape[t];
      e[t] = B.create(te(s));
    }
    return new x({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof O ? new O({
    ...r._def,
    type: te(r.element)
  }) : r instanceof B ? B.create(te(r.unwrap())) : r instanceof W ? W.create(te(r.unwrap())) : r instanceof D ? D.create(r.items.map((e) => te(e))) : r;
}
class x extends b {
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
      return u(d, {
        code: c.invalid_type,
        expected: h.object,
        received: d.parsedType
      }), y;
    }
    const { status: s, ctx: n } = this._processInputParams(e), { shape: a, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof z && this._def.unknownKeys === "strip"))
      for (const d in n.data)
        i.includes(d) || o.push(d);
    const l = [];
    for (const d of i) {
      const p = a[d], E = n.data[d];
      l.push({
        key: { status: "valid", value: d },
        value: p._parse(new L(n, E, n.path, d)),
        alwaysSet: d in n.data
      });
    }
    if (this._def.catchall instanceof z) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const p of o)
          l.push({
            key: { status: "valid", value: p },
            value: { status: "valid", value: n.data[p] }
          });
      else if (d === "strict")
        o.length > 0 && (u(n, {
          code: c.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const p of o) {
        const E = n.data[p];
        l.push({
          key: { status: "valid", value: p },
          value: d._parse(
            new L(n, E, n.path, p)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: p in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const p of l) {
        const E = await p.key, S = await p.value;
        d.push({
          key: E,
          value: S,
          alwaysSet: p.alwaysSet
        });
      }
      return d;
    }).then((d) => C.mergeObjectSync(s, d)) : C.mergeObjectSync(s, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return f.errToObj, new x({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var n, a, i, o;
          const l = (i = (a = (n = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(n, t, s).message) !== null && i !== void 0 ? i : s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (o = f.errToObj(e).message) !== null && o !== void 0 ? o : l
          } : {
            message: l
          };
        }
      } : {}
    });
  }
  strip() {
    return new x({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new x({
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
    return new x({
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
    return new x({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: g.ZodObject
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
    return new x({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    return w.objectKeys(e).forEach((s) => {
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return w.objectKeys(this.shape).forEach((s) => {
      e[s] || (t[s] = this.shape[s]);
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return te(this);
  }
  partial(e) {
    const t = {};
    return w.objectKeys(this.shape).forEach((s) => {
      const n = this.shape[s];
      e && !e[s] ? t[s] = n : t[s] = n.optional();
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return w.objectKeys(this.shape).forEach((s) => {
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let a = this.shape[s];
        for (; a instanceof B; )
          a = a._def.innerType;
        t[s] = a;
      }
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return ut(w.objectKeys(this.shape));
  }
}
x.create = (r, e) => new x({
  shape: () => r,
  unknownKeys: "strip",
  catchall: z.create(),
  typeName: g.ZodObject,
  ...v(e)
});
x.strictCreate = (r, e) => new x({
  shape: () => r,
  unknownKeys: "strict",
  catchall: z.create(),
  typeName: g.ZodObject,
  ...v(e)
});
x.lazycreate = (r, e) => new x({
  shape: r,
  unknownKeys: "strip",
  catchall: z.create(),
  typeName: g.ZodObject,
  ...v(e)
});
class ye extends b {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function n(a) {
      for (const o of a)
        if (o.result.status === "valid")
          return o.result;
      for (const o of a)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = a.map((o) => new N(o.ctx.common.issues));
      return u(t, {
        code: c.invalid_union,
        unionErrors: i
      }), y;
    }
    if (t.common.async)
      return Promise.all(s.map(async (a) => {
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
      })).then(n);
    {
      let a;
      const i = [];
      for (const l of s) {
        const d = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, p = l._parseSync({
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
      const o = i.map((l) => new N(l));
      return u(t, {
        code: c.invalid_union,
        unionErrors: o
      }), y;
    }
  }
  get options() {
    return this._def.options;
  }
}
ye.create = (r, e) => new ye({
  options: r,
  typeName: g.ZodUnion,
  ...v(e)
});
const $ = (r) => r instanceof be ? $(r.schema) : r instanceof Z ? $(r.innerType()) : r instanceof we ? [r.value] : r instanceof G ? r.options : r instanceof xe ? w.objectValues(r.enum) : r instanceof ke ? $(r._def.innerType) : r instanceof me ? [void 0] : r instanceof ge ? [null] : r instanceof B ? [void 0, ...$(r.unwrap())] : r instanceof W ? [null, ...$(r.unwrap())] : r instanceof Ge || r instanceof Ee ? $(r.unwrap()) : r instanceof Te ? $(r._def.innerType) : [];
class Be extends b {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.object)
      return u(t, {
        code: c.invalid_type,
        expected: h.object,
        received: t.parsedType
      }), y;
    const s = this.discriminator, n = t.data[s], a = this.optionsMap.get(n);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (u(t, {
      code: c.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [s]
    }), y);
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
    for (const a of t) {
      const i = $(a.shape[e]);
      if (!i.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of i) {
        if (n.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        n.set(o, a);
      }
    }
    return new Be({
      typeName: g.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: n,
      ...v(s)
    });
  }
}
function ze(r, e) {
  const t = U(r), s = U(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === h.object && s === h.object) {
    const n = w.objectKeys(e), a = w.objectKeys(r).filter((o) => n.indexOf(o) !== -1), i = { ...r, ...e };
    for (const o of a) {
      const l = ze(r[o], e[o]);
      if (!l.valid)
        return { valid: !1 };
      i[o] = l.data;
    }
    return { valid: !0, data: i };
  } else if (t === h.array && s === h.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const n = [];
    for (let a = 0; a < r.length; a++) {
      const i = r[a], o = e[a], l = ze(i, o);
      if (!l.valid)
        return { valid: !1 };
      n.push(l.data);
    }
    return { valid: !0, data: n };
  } else return t === h.date && s === h.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class _e extends b {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = (a, i) => {
      if (Ue(a) || Ue(i))
        return y;
      const o = ze(a.value, i.value);
      return o.valid ? ((Fe(a) || Fe(i)) && t.dirty(), { status: t.value, value: o.data }) : (u(s, {
        code: c.invalid_intersection_types
      }), y);
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
    ]).then(([a, i]) => n(a, i)) : n(this._def.left._parseSync({
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
_e.create = (r, e, t) => new _e({
  left: r,
  right: e,
  typeName: g.ZodIntersection,
  ...v(t)
});
class D extends b {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.array)
      return u(s, {
        code: c.invalid_type,
        expected: h.array,
        received: s.parsedType
      }), y;
    if (s.data.length < this._def.items.length)
      return u(s, {
        code: c.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), y;
    !this._def.rest && s.data.length > this._def.items.length && (u(s, {
      code: c.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...s.data].map((i, o) => {
      const l = this._def.items[o] || this._def.rest;
      return l ? l._parse(new L(s, i, s.path, o)) : null;
    }).filter((i) => !!i);
    return s.common.async ? Promise.all(a).then((i) => C.mergeArray(t, i)) : C.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new D({
      ...this._def,
      rest: e
    });
  }
}
D.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new D({
    items: r,
    typeName: g.ZodTuple,
    rest: null,
    ...v(e)
  });
};
class ve extends b {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.object)
      return u(s, {
        code: c.invalid_type,
        expected: h.object,
        received: s.parsedType
      }), y;
    const n = [], a = this._def.keyType, i = this._def.valueType;
    for (const o in s.data)
      n.push({
        key: a._parse(new L(s, o, s.path, o)),
        value: i._parse(new L(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? C.mergeObjectAsync(t, n) : C.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof b ? new ve({
      keyType: e,
      valueType: t,
      typeName: g.ZodRecord,
      ...v(s)
    }) : new ve({
      keyType: R.create(),
      valueType: e,
      typeName: g.ZodRecord,
      ...v(t)
    });
  }
}
class Ze extends b {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.map)
      return u(s, {
        code: c.invalid_type,
        expected: h.map,
        received: s.parsedType
      }), y;
    const n = this._def.keyType, a = this._def.valueType, i = [...s.data.entries()].map(([o, l], d) => ({
      key: n._parse(new L(s, o, s.path, [d, "key"])),
      value: a._parse(new L(s, l, s.path, [d, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const l of i) {
          const d = await l.key, p = await l.value;
          if (d.status === "aborted" || p.status === "aborted")
            return y;
          (d.status === "dirty" || p.status === "dirty") && t.dirty(), o.set(d.value, p.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const l of i) {
        const d = l.key, p = l.value;
        if (d.status === "aborted" || p.status === "aborted")
          return y;
        (d.status === "dirty" || p.status === "dirty") && t.dirty(), o.set(d.value, p.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Ze.create = (r, e, t) => new Ze({
  valueType: e,
  keyType: r,
  typeName: g.ZodMap,
  ...v(t)
});
class ee extends b {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.set)
      return u(s, {
        code: c.invalid_type,
        expected: h.set,
        received: s.parsedType
      }), y;
    const n = this._def;
    n.minSize !== null && s.data.size < n.minSize.value && (u(s, {
      code: c.too_small,
      minimum: n.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.minSize.message
    }), t.dirty()), n.maxSize !== null && s.data.size > n.maxSize.value && (u(s, {
      code: c.too_big,
      maximum: n.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function i(l) {
      const d = /* @__PURE__ */ new Set();
      for (const p of l) {
        if (p.status === "aborted")
          return y;
        p.status === "dirty" && t.dirty(), d.add(p.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...s.data.values()].map((l, d) => a._parse(new L(s, l, s.path, d)));
    return s.common.async ? Promise.all(o).then((l) => i(l)) : i(o);
  }
  min(e, t) {
    return new ee({
      ...this._def,
      minSize: { value: e, message: f.toString(t) }
    });
  }
  max(e, t) {
    return new ee({
      ...this._def,
      maxSize: { value: e, message: f.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ee.create = (r, e) => new ee({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: g.ZodSet,
  ...v(e)
});
class ne extends b {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.function)
      return u(t, {
        code: c.invalid_type,
        expected: h.function,
        received: t.parsedType
      }), y;
    function s(o, l) {
      return Ne({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Pe(),
          ae
        ].filter((d) => !!d),
        issueData: {
          code: c.invalid_arguments,
          argumentsError: l
        }
      });
    }
    function n(o, l) {
      return Ne({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          Pe(),
          ae
        ].filter((d) => !!d),
        issueData: {
          code: c.invalid_return_type,
          returnTypeError: l
        }
      });
    }
    const a = { errorMap: t.common.contextualErrorMap }, i = t.data;
    if (this._def.returns instanceof oe) {
      const o = this;
      return I(async function(...l) {
        const d = new N([]), p = await o._def.args.parseAsync(l, a).catch((j) => {
          throw d.addIssue(s(l, j)), d;
        }), E = await Reflect.apply(i, this, p);
        return await o._def.returns._def.type.parseAsync(E, a).catch((j) => {
          throw d.addIssue(n(E, j)), d;
        });
      });
    } else {
      const o = this;
      return I(function(...l) {
        const d = o._def.args.safeParse(l, a);
        if (!d.success)
          throw new N([s(l, d.error)]);
        const p = Reflect.apply(i, this, d.data), E = o._def.returns.safeParse(p, a);
        if (!E.success)
          throw new N([n(p, E.error)]);
        return E.data;
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
    return new ne({
      ...this._def,
      args: D.create(e).rest(Q.create())
    });
  }
  returns(e) {
    return new ne({
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
    return new ne({
      args: e || D.create([]).rest(Q.create()),
      returns: t || Q.create(),
      typeName: g.ZodFunction,
      ...v(s)
    });
  }
}
class be extends b {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
be.create = (r, e) => new be({
  getter: r,
  typeName: g.ZodLazy,
  ...v(e)
});
class we extends b {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return u(t, {
        received: t.data,
        code: c.invalid_literal,
        expected: this._def.value
      }), y;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
we.create = (r, e) => new we({
  value: r,
  typeName: g.ZodLiteral,
  ...v(e)
});
function ut(r, e) {
  return new G({
    values: r,
    typeName: g.ZodEnum,
    ...v(e)
  });
}
class G extends b {
  constructor() {
    super(...arguments), le.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return u(t, {
        expected: w.joinValues(s),
        received: t.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (je(this, le) || ot(this, le, new Set(this._def.values)), !je(this, le).has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return u(t, {
        received: t.data,
        code: c.invalid_enum_value,
        options: s
      }), y;
    }
    return I(e.data);
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
    return G.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return G.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
le = /* @__PURE__ */ new WeakMap();
G.create = ut;
class xe extends b {
  constructor() {
    super(...arguments), de.set(this, void 0);
  }
  _parse(e) {
    const t = w.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== h.string && s.parsedType !== h.number) {
      const n = w.objectValues(t);
      return u(s, {
        expected: w.joinValues(n),
        received: s.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (je(this, de) || ot(this, de, new Set(w.getValidEnumValues(this._def.values))), !je(this, de).has(e.data)) {
      const n = w.objectValues(t);
      return u(s, {
        received: s.data,
        code: c.invalid_enum_value,
        options: n
      }), y;
    }
    return I(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
de = /* @__PURE__ */ new WeakMap();
xe.create = (r, e) => new xe({
  values: r,
  typeName: g.ZodNativeEnum,
  ...v(e)
});
class oe extends b {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.promise && t.common.async === !1)
      return u(t, {
        code: c.invalid_type,
        expected: h.promise,
        received: t.parsedType
      }), y;
    const s = t.parsedType === h.promise ? t.data : Promise.resolve(t.data);
    return I(s.then((n) => this._def.type.parseAsync(n, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
oe.create = (r, e) => new oe({
  type: r,
  typeName: g.ZodPromise,
  ...v(e)
});
class Z extends b {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === g.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = this._def.effect || null, a = {
      addIssue: (i) => {
        u(s, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), n.type === "preprocess") {
      const i = n.transform(s.data, a);
      if (s.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return y;
          const l = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return l.status === "aborted" ? y : l.status === "dirty" || t.value === "dirty" ? se(l.value) : l;
        });
      {
        if (t.value === "aborted")
          return y;
        const o = this._def.schema._parseSync({
          data: i,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? y : o.status === "dirty" || t.value === "dirty" ? se(o.value) : o;
      }
    }
    if (n.type === "refinement") {
      const i = (o) => {
        const l = n.refinement(o, a);
        if (s.common.async)
          return Promise.resolve(l);
        if (l instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? y : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? y : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (n.type === "transform")
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!Y(i))
          return i;
        const o = n.transform(i.value, a);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => Y(i) ? Promise.resolve(n.transform(i.value, a)).then((o) => ({ status: t.value, value: o })) : i);
    w.assertNever(n);
  }
}
Z.create = (r, e, t) => new Z({
  schema: r,
  typeName: g.ZodEffects,
  effect: e,
  ...v(t)
});
Z.createWithPreprocess = (r, e, t) => new Z({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: g.ZodEffects,
  ...v(t)
});
class B extends b {
  _parse(e) {
    return this._getType(e) === h.undefined ? I(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
B.create = (r, e) => new B({
  innerType: r,
  typeName: g.ZodOptional,
  ...v(e)
});
class W extends b {
  _parse(e) {
    return this._getType(e) === h.null ? I(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
W.create = (r, e) => new W({
  innerType: r,
  typeName: g.ZodNullable,
  ...v(e)
});
class ke extends b {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === h.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ke.create = (r, e) => new ke({
  innerType: r,
  typeName: g.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...v(e)
});
class Te extends b {
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
    return fe(n) ? n.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new N(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new N(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Te.create = (r, e) => new Te({
  innerType: r,
  typeName: g.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...v(e)
});
class Me extends b {
  _parse(e) {
    if (this._getType(e) !== h.nan) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.nan,
        received: s.parsedType
      }), y;
    }
    return { status: "valid", value: e.data };
  }
}
Me.create = (r) => new Me({
  typeName: g.ZodNaN,
  ...v(r)
});
const Wt = Symbol("zod_brand");
class Ge extends b {
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
class Ae extends b {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return a.status === "aborted" ? y : a.status === "dirty" ? (t.dirty(), se(a.value)) : this._def.out._parseAsync({
          data: a.value,
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
      return n.status === "aborted" ? y : n.status === "dirty" ? (t.dirty(), {
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
    return new Ae({
      in: e,
      out: t,
      typeName: g.ZodPipeline
    });
  }
}
class Ee extends b {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (n) => (Y(n) && (n.value = Object.freeze(n.value)), n);
    return fe(t) ? t.then((n) => s(n)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Ee.create = (r, e) => new Ee({
  innerType: r,
  typeName: g.ZodReadonly,
  ...v(e)
});
function Qe(r, e) {
  const t = typeof r == "function" ? r(e) : typeof r == "string" ? { message: r } : r;
  return typeof t == "string" ? { message: t } : t;
}
function ht(r, e = {}, t) {
  return r ? ie.create().superRefine((s, n) => {
    var a, i;
    const o = r(s);
    if (o instanceof Promise)
      return o.then((l) => {
        var d, p;
        if (!l) {
          const E = Qe(e, s), S = (p = (d = E.fatal) !== null && d !== void 0 ? d : t) !== null && p !== void 0 ? p : !0;
          n.addIssue({ code: "custom", ...E, fatal: S });
        }
      });
    if (!o) {
      const l = Qe(e, s), d = (i = (a = l.fatal) !== null && a !== void 0 ? a : t) !== null && i !== void 0 ? i : !0;
      n.addIssue({ code: "custom", ...l, fatal: d });
    }
  }) : ie.create();
}
const Kt = {
  object: x.lazycreate
};
var g;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(g || (g = {}));
const Ht = (r, e = {
  message: `Input not instance of ${r.name}`
}) => ht((t) => t instanceof r, e), ft = R.create, pt = V.create, Qt = Me.create, Yt = q.create, mt = pe.create, Xt = X.create, es = Re.create, ts = me.create, ss = ge.create, rs = ie.create, ns = Q.create, as = z.create, is = Oe.create, os = O.create, cs = x.create, ls = x.strictCreate, ds = ye.create, us = Be.create, hs = _e.create, fs = D.create, ps = ve.create, ms = Ze.create, gs = ee.create, ys = ne.create, _s = be.create, vs = we.create, bs = G.create, ws = xe.create, xs = oe.create, Ye = Z.create, ks = B.create, Ts = W.create, Es = Z.createWithPreprocess, As = Ae.create, Cs = () => ft().optional(), Ss = () => pt().optional(), Is = () => mt().optional(), Ps = {
  string: (r) => R.create({ ...r, coerce: !0 }),
  number: (r) => V.create({ ...r, coerce: !0 }),
  boolean: (r) => pe.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => q.create({ ...r, coerce: !0 }),
  date: (r) => X.create({ ...r, coerce: !0 })
}, Ns = y;
var _ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: ae,
  setErrorMap: Et,
  getErrorMap: Pe,
  makeIssue: Ne,
  EMPTY_PATH: At,
  addIssueToContext: u,
  ParseStatus: C,
  INVALID: y,
  DIRTY: se,
  OK: I,
  isAborted: Ue,
  isDirty: Fe,
  isValid: Y,
  isAsync: fe,
  get util() {
    return w;
  },
  get objectUtil() {
    return $e;
  },
  ZodParsedType: h,
  getParsedType: U,
  ZodType: b,
  datetimeRegex: dt,
  ZodString: R,
  ZodNumber: V,
  ZodBigInt: q,
  ZodBoolean: pe,
  ZodDate: X,
  ZodSymbol: Re,
  ZodUndefined: me,
  ZodNull: ge,
  ZodAny: ie,
  ZodUnknown: Q,
  ZodNever: z,
  ZodVoid: Oe,
  ZodArray: O,
  ZodObject: x,
  ZodUnion: ye,
  ZodDiscriminatedUnion: Be,
  ZodIntersection: _e,
  ZodTuple: D,
  ZodRecord: ve,
  ZodMap: Ze,
  ZodSet: ee,
  ZodFunction: ne,
  ZodLazy: be,
  ZodLiteral: we,
  ZodEnum: G,
  ZodNativeEnum: xe,
  ZodPromise: oe,
  ZodEffects: Z,
  ZodTransformer: Z,
  ZodOptional: B,
  ZodNullable: W,
  ZodDefault: ke,
  ZodCatch: Te,
  ZodNaN: Me,
  BRAND: Wt,
  ZodBranded: Ge,
  ZodPipeline: Ae,
  ZodReadonly: Ee,
  custom: ht,
  Schema: b,
  ZodSchema: b,
  late: Kt,
  get ZodFirstPartyTypeKind() {
    return g;
  },
  coerce: Ps,
  any: rs,
  array: os,
  bigint: Yt,
  boolean: mt,
  date: Xt,
  discriminatedUnion: us,
  effect: Ye,
  enum: bs,
  function: ys,
  instanceof: Ht,
  intersection: hs,
  lazy: _s,
  literal: vs,
  map: ms,
  nan: Qt,
  nativeEnum: ws,
  never: as,
  null: ss,
  nullable: Ts,
  number: pt,
  object: cs,
  oboolean: Is,
  onumber: Ss,
  optional: ks,
  ostring: Cs,
  pipeline: As,
  preprocess: Es,
  promise: xs,
  record: ps,
  set: gs,
  strictObject: ls,
  string: ft,
  symbol: es,
  transformer: Ye,
  tuple: fs,
  undefined: ts,
  union: ds,
  unknown: ns,
  void: is,
  NEVER: Ns,
  ZodIssueCode: c,
  quotelessJson: Tt,
  ZodError: N
});
const Xe = _.object({
  prompt: _.string().default(""),
  aspect_ratio: _.string().default("1:1"),
  num_outputs: _.number().int().default(1),
  num_inference_steps: _.number().int().gt(0).lt(5).default(4),
  seed: _.number().int().optional().default(() => Math.floor(Math.random() * 1e6)),
  output_format: _.string().default("jpg"),
  disable_safety_checker: _.boolean().default(!1),
  go_fast: _.boolean().default(!1)
});
class js extends qe {
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
      queryParams: Xe.parse({})
    });
  }
  async parseResult(e) {
    return Array.isArray(e) ? Promise.all(e.map((t) => new T().fromAny(t))) : await new T().fromAny(e);
  }
  /**
   * Generate an image from a text prompt
   * @param text - Text description of the desired image
   * @param args - Additional arguments (Python *args equivalent)
   * @param kwargs - Additional options (Python **kwargs equivalent)
   * @returns TrackedJob that resolves to the generated image
   */
  text2img(e, t) {
    const s = this.getEndpoint("text2img"), n = Xe.parse({
      ...t,
      prompt: e
      // Always use the text parameter as the prompt
    });
    return this.submitTrackedJob(s, n, this.parseResult);
  }
}
const et = _.object({
  prompt: _.string().default(""),
  max_tokens: _.number().int().default(20480),
  temperature: _.number().gt(0).lt(1).default(0.1),
  presence_penalty: _.number().gte(0).lte(1).default(0),
  frequency_penalty: _.number().gte(0).lte(1).default(0),
  top_p: _.number().gte(0).lte(1).default(1)
});
class Rs {
  constructor(e) {
    m(this, "answer");
    m(this, "thoughts");
    Array.isArray(e) && (e = e.join(""));
    let t = e.indexOf("<think>"), s = e.indexOf("</think>", t + 7);
    this.thoughts = e.substring(t + 7, s), this.answer = e.substring(s + 8);
  }
}
class Os extends qe {
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
      queryParams: et.parse({})
    });
  }
  async _parse_result(e) {
    return new Rs(e);
  }
  async _infer(e, t) {
    const s = this.getEndpoint("chat"), n = et.parse({
      ...t,
      prompt: e
      // Always use the text parameter as the prompt
    });
    return this.submitTrackedJob(s, n, this._parse_result);
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
const he = _.union([
  _.string(),
  _.null(),
  _.instanceof(Blob),
  _.instanceof(File),
  _.instanceof(T),
  // Add Buffer type for Node.js environment
  _.instanceof(Buffer)
]).default(null), tt = _.object({
  enhance_face_model: _.string().optional().default("gpen_bfr_512")
}), st = _.object({
  source_img: he,
  target_img: he
}), rt = _.object({
  faces: _.union([_.string(), _.array(_.string()), _.record(_.string(), _.any())]).default(""),
  enhance_face_model: _.string().optional()
}), nt = _.object({
  face_name: _.string().default(""),
  save: _.boolean().optional().default(!1)
}), at = _.object({
  face_name: _.string().default(""),
  include_audio: _.boolean().optional().default(!0),
  enhance_face_model: _.string().optional().default("gpen_bfr_512")
});
class Zs extends qe {
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
      queryParams: tt.parse({}),
      fileParams: st.parse({})
    }), this.registerEndpoint({
      path: "swap",
      method: "POST",
      queryParams: rt.parse({}),
      fileParams: _.object({ media: he }).parse({})
    }), this.registerEndpoint({
      path: "add_face",
      method: "POST",
      queryParams: nt.parse({}),
      fileParams: _.object({ image: he }).parse({})
    }), this.registerEndpoint({
      path: "swap_video",
      method: "POST",
      queryParams: at.parse({}),
      fileParams: _.object({ target_video: he }).parse({})
    });
  }
  async parseResult(e) {
    return Array.isArray(e) ? Promise.all(e.map((t) => new T().fromAny(t))) : await new T().fromAny(e);
  }
  /**
   * Swap faces between a source image and target image
   * @param sourceImg - Source image containing the face to use
   * @param targetImg - Target image where the face will be swapped
   * @param options - Additional options like enhance_face_model
   * @returns TrackedJob that resolves to the processed image
   */
  async swapImg2Img(e, t, s) {
    const n = this.getEndpoint("swap-img-to-img"), a = await T.create(e), i = await T.create(t);
    if (!a || !i)
      throw new Error("Invalid source or target image");
    let o = tt.parse(s || {}), l = st.parse({ source_img: a, target_img: i }), d = { ...o, ...l };
    return this.submitTrackedJob(n, d, this.parseResult);
  }
  /**
   * Apply face swapping on a single image with predefined faces
   * @param media - Image where faces should be swapped
   * @param options - Options including which faces to use and enhance settings
   * @returns TrackedJob that resolves to the processed image
   */
  async swap(e, t) {
    const s = this.getEndpoint("swap"), n = await T.create(e);
    if (!n)
      throw new Error("Invalid media file");
    const o = { ...rt.parse(t || {}), ...{ media: n } };
    return this.submitTrackedJob(s, o, this.parseResult);
  }
  /**
   * Add a face to the face library for later use in swapping
   * @param image - Image containing the face to add
   * @param options - Options including the face name and whether to save it
   * @returns TrackedJob that resolves to the operation result
   */
  async addFace(e, t, s = !0) {
    const n = this.getEndpoint("add_face"), a = await T.create(e);
    if (!a)
      throw new Error("Invalid image file");
    const i = nt.parse({
      image: a.toBase64(),
      face_name: t,
      save: s
    });
    return this.submitTrackedJob(n, i, this.parseResult);
  }
  /**
   * Swap faces in a video using a previously added face
   * @param targetVideo - Video where faces should be swapped
   * @param faceName - Name of the face to use (previously added with addFace)
   * @param options - Additional options like include_audio and enhance settings
   * @returns TrackedJob that resolves to the processed video
   */
  async swapVideo(e, t, s) {
    const n = this.getEndpoint("swap_video");
    if (!await T.create(e))
      throw new Error("Invalid video file");
    const i = at.parse({
      face_name: t,
      ...s
    });
    return this.submitTrackedJob(n, i, this.parseResult);
  }
}
M.registerClientType("flux-schnell", js);
M.registerClientType("deepseek-r1", Os);
M.registerClientType("face2face", Zs);
class Ms {
  constructor(e = {}) {
    F.update(e);
  }
  async text2img(e, t = "flux-schnell", s) {
    return M.getClient(t).text2img(e, s);
  }
  async chat(e, t = "deepseek-r1", s) {
    return M.getClient(t).chat(e, s);
  }
  async swapImg2Img(e, t, s = "face2face", n) {
    return M.getClient(s).swapImg2Img(e, t, n);
  }
  getAvailableModels() {
    return M.getAvailableClients();
  }
}
class gt extends Ms {
  constructor(t = {}) {
    super(t);
    m(this, "requestHandler");
    m(this, "jobManager");
    this.requestHandler = new Ve(), this.jobManager = Ie.getInstance(this.requestHandler);
  }
  /**
   * Set the API key globally
   */
  setApiKey(t) {
    F.update({ apiKey: t });
  }
  /**
   * Set the base URL globally
   */
  setBaseUrl(t) {
    F.update({ baseUrl: t });
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
const yt = new gt();
typeof window < "u" && (window.socaity = yt);
typeof module < "u" && module.exports && (module.exports = yt, module.exports.SocaitySDK = gt);
process.on("uncaughtException", (r) => {
  if (r.name === "ApiKeyError")
    console.error(`${r.name}: ${r.message}`), process.exit(1);
  else
    throw r;
});
export {
  M as APIClientFactory,
  T as MediaFile,
  gt as SocaitySDK,
  yt as socaity
};
//# sourceMappingURL=socaity.es.js.map
