var b = Object.defineProperty;
var y = (a, e, t) => e in a ? b(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var i = (a, e, t) => y(a, typeof e != "symbol" ? e + "" : e, t);
class g {
  constructor(e) {
    i(this, "config");
    i(this, "controller");
    this.config = e, this.controller = new AbortController();
  }
  /**
   * Send a request to the API
   * @param endpoint - API endpoint path
   * @param method - HTTP method (GET, POST, etc)
   * @param params - Request parameters
   * @param apiKey - API key to use for this request
   * @param file - Optional file to upload
   * @returns Promise with the API response
   */
  async sendRequest(e, t = "POST", r = {}, l, n) {
    const u = `${this.config.baseUrl}/${e}`, p = l || this.config.apiKey;
    if (!p)
      throw new Error("API key not provided");
    const d = {
      method: t,
      headers: {
        Authorization: `Bearer ${p}`
      },
      signal: this.controller.signal
    };
    if (n) {
      const s = new FormData();
      Object.entries(r).forEach(([c, h]) => {
        typeof h == "object" ? s.append(c, JSON.stringify(h)) : s.append(c, String(h));
      }), s.append("file", n), d.body = s;
    } else if (Object.keys(r).length > 0)
      if (t === "GET") {
        const s = new URLSearchParams();
        Object.entries(r).forEach(([h, f]) => {
          typeof f == "object" ? s.append(h, JSON.stringify(f)) : s.append(h, String(f));
        });
        const c = s.toString();
        c && (e = `${e}?${c}`);
      } else
        d.headers["Content-Type"] = "application/json", d.body = JSON.stringify(r);
    try {
      const s = await fetch(u, d);
      if (!s.ok) {
        const c = await s.text();
        throw new Error(`API error (${s.status}): ${c}`);
      }
      return await s.json();
    } catch (s) {
      throw s instanceof Error ? s : new Error(`Network error: ${String(s)}`);
    }
  }
  /**
   * Send a GET request
   */
  async get(e, t = {}, r) {
    return this.sendRequest(e, "GET", t, r);
  }
  /**
   * Send a POST request
   */
  async post(e, t = {}, r, l) {
    return this.sendRequest(e, "POST", t, r, l);
  }
  /**
   * Abort any ongoing requests
   */
  abort() {
    this.controller.abort(), this.controller = new AbortController();
  }
}
var o = /* @__PURE__ */ ((a) => (a.CREATED = "CREATED", a.QUEUED = "QUEUED", a.PROCESSING = "PROCESSING", a.COMPLETED = "COMPLETED", a.FAILED = "FAILED", a))(o || {});
class m {
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
      message: e.message || "",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
  /**
   * Parse status from different API formats
   */
  parseStatus(e) {
    const t = (e.status || "").toUpperCase();
    if (t === "COMPLETED" || t === "SUCCEEDED")
      return o.COMPLETED;
    if (t === "FAILED" || t === "ERROR")
      return o.FAILED;
    if (t === "IN_PROGRESS" || t === "PROCESSING" || t === "RUNNING")
      return o.PROCESSING;
    if (t === "QUEUED" || t === "PENDING")
      return o.QUEUED;
    if (e.state) {
      const r = e.state.toUpperCase();
      if (r === "COMPLETED") return o.COMPLETED;
      if (r === "FAILED") return o.FAILED;
      if (r === "IN_PROGRESS") return o.PROCESSING;
      if (r === "QUEUED") return o.QUEUED;
    }
    return o.CREATED;
  }
  /**
   * Parse progress from different API formats
   */
  parseProgress(e) {
    return typeof e.progress == "number" ? e.progress : e.status === "COMPLETED" || e.status === "SUCCEEDED" ? 1 : 0;
  }
}
class w {
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
        appendTo: (r) => (r.appendChild(t), t)
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
        const r = new FileReader();
        r.onloadend = () => t(r.result), r.readAsDataURL(e);
      })
    } : { data: e };
  }
}
class R {
  constructor(e, t) {
    i(this, "requestHandler");
    i(this, "config");
    i(this, "jobs");
    i(this, "responseParser");
    i(this, "mediaHandler");
    this.requestHandler = e, this.config = t, this.jobs = /* @__PURE__ */ new Map(), this.responseParser = new m(), this.mediaHandler = new w();
  }
  /**
   * Submit a new job to the API
   * @param endpoint - API endpoint to call
   * @param params - Parameters for the job
   * @param apiKey - Optional API key to use for this request
   * @param file - Optional file to include
   * @returns Promise resolving to the created job
   */
  async submitJob(e, t, r, l) {
    try {
      const n = await this.requestHandler.post(e, t, r, l);
      if (!this.responseParser.canParse(n))
        throw new Error("Unexpected response format from API");
      const u = this.responseParser.parse(n);
      return this.jobs.set(u.id, u), u;
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
    for (; ; ) {
      await new Promise((r) => setTimeout(r, this.config.pollInterval));
      const t = await this.requestHandler.get(`status/${e.id}`);
      if (t.status === o.COMPLETED)
        return this.mediaHandler.processResponse(t.result);
      if (t.status === o.FAILED)
        throw new Error(`Job failed: ${t.error}`);
    }
  }
  /**
   * Cancel a running job
   * @param jobId - ID of the job to cancel
   * @returns Promise resolving to true if the job was cancelled
   */
  async cancelJob(e) {
    try {
      return await this.requestHandler.post(`cancel/${e}`, {}), this.jobs.delete(e), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Clear completed or failed jobs from tracking
   */
  clearCompletedJobs() {
    for (const [e, t] of this.jobs.entries())
      (t.status === o.COMPLETED || t.status === o.FAILED) && this.jobs.delete(e);
  }
}
class E {
  constructor(e = {}) {
    i(this, "apiKey");
    i(this, "baseUrl");
    i(this, "pollInterval");
    i(this, "maxRetries");
    this.apiKey = e.apiKey, this.baseUrl = e.baseUrl || "https://api.socaity.ai/v1", this.pollInterval = e.pollInterval || 1e3, this.maxRetries = e.maxRetries || 3;
  }
  /**
   * Updates configuration with new values
   */
  update(e) {
    e.apiKey !== void 0 && (this.apiKey = e.apiKey), e.baseUrl !== void 0 && (this.baseUrl = e.baseUrl), e.pollInterval !== void 0 && (this.pollInterval = e.pollInterval), e.maxRetries !== void 0 && (this.maxRetries = e.maxRetries);
  }
  /**
   * Creates a copy of this configuration
   */
  clone() {
    return new E({
      apiKey: this.apiKey,
      baseUrl: this.baseUrl,
      pollInterval: this.pollInterval,
      maxRetries: this.maxRetries
    });
  }
}
class D {
  constructor() {
    i(this, "requestHandler");
    i(this, "jobManager");
    i(this, "config");
    this.config = new E(), this.requestHandler = new g(this.config), this.jobManager = new R(this.requestHandler, this.config);
  }
  /**
   * Set the API key for all future requests
   * @param apiKey - Your Socaity API key
   */
  setApiKey(e) {
    this.config.apiKey = e;
  }
  /**
   * Set the base URL for the API
   * @param url - Base URL for the Socaity API
   */
  setBaseUrl(e) {
    this.config.baseUrl = e;
  }
  /**
   * Generate an image from text prompt
   * @param prompt - Text description of the image to generate
   * @param options - Additional options for the request
   * @returns Promise resolving to the generated image
   */
  async text2img(e, t = {}) {
    const r = "text2img", l = { prompt: e };
    return this.executeRequest(r, l, t);
  }
  /**
   * Chat with an AI model
   * @param messages - Array of message objects with roles and content
   * @param options - Additional options for the request
   * @returns Promise resolving to the chat response
   */
  async chat(e, t = {}) {
    const r = "chat", l = {
      messages: e,
      model: t.model || "default",
      temperature: t.temperature || 0.7
    };
    return this.executeRequest(r, l, t);
  }
  /**
   * Upload a file to be processed by Socaity services
   * @param file - File to upload (File object, Buffer, or file path)
   * @param options - Additional options for the request
   * @returns Promise resolving to the uploaded file information
   */
  async uploadFile(e, t = {}) {
    return this.validateApiKey(t.apiKey), this.executeRequest("upload", {}, t, e);
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
  getJob(e) {
    return this.jobManager.getJob(e);
  }
  /**
   * Cancel a running job
   * @param jobId - ID of the job to cancel
   * @returns Promise resolving to true if successful
   */
  async cancelJob(e) {
    return this.jobManager.cancelJob(e);
  }
  /**
   * Execute a request to the Socaity API
   * @private
   */
  async executeRequest(e, t, r = {}, l) {
    const n = r.apiKey || this.config.apiKey;
    this.validateApiKey(n);
    const u = await this.jobManager.submitJob(e, t, n, l);
    return this.jobManager.trackJobToCompletion(u);
  }
  /**
   * Validates that an API key is available
   * @private
   */
  validateApiKey(e) {
    if (!e && !this.config.apiKey)
      throw new Error("API key not set. Use setApiKey() method or provide an apiKey in the options.");
  }
}
const U = new D();
typeof window < "u" && (window.socaity = U);
export {
  D as SocaitySDK,
  U as socaity
};
//# sourceMappingURL=socaity.es.js.map
