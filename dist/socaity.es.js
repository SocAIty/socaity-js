var Xe = Object.defineProperty;
var et = (r, e, t) => e in r ? Xe(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var y = (r, e, t) => et(r, typeof e != "symbol" ? e + "" : e, t);
const $ = class $ {
  constructor(e = {}) {
    y(this, "apiKey");
    y(this, "baseUrl");
    y(this, "pollInterval");
    y(this, "maxRetries");
    this.apiKey = e.apiKey, this.baseUrl = "http://localhost:8000/v0", this.pollInterval = e.pollInterval || 5e3, this.maxRetries = e.maxRetries || 3;
  }
  /**
   * Get the global configuration instance
   */
  static getInstance() {
    return $.instance || ($.instance = new $()), $.instance;
  }
  /**
   * Updates global configuration with new values
   */
  static update(e) {
    const t = $.getInstance();
    e.apiKey !== void 0 && (t.apiKey = e.apiKey), e.baseUrl !== void 0 && (t.baseUrl = e.baseUrl), e.pollInterval !== void 0 && (t.pollInterval = e.pollInterval), e.maxRetries !== void 0 && (t.maxRetries = e.maxRetries);
  }
};
y($, "instance");
let D = $;
class De {
  constructor() {
    y(this, "config");
    y(this, "controller");
    this.config = D.getInstance(), this.controller = new AbortController();
  }
  async handleFileUpload(e) {
    if (e)
      return null;
  }
  matchParams(e, t) {
    const s = {};
    for (const [a, n] of Object.entries(e))
      a in t ? s[a] = t[a] : n !== void 0 && (s[a] = n);
    return s;
  }
  /**
   * Filters the with endpoint.queryParams matching parameters to Record<string, any>
   * @param endpoint 
   * @param params 
   * @returns 
   */
  parseQueryParams(e, t) {
    if (!e.queryParams)
      return {};
    const s = this.matchParams(e.queryParams, t);
    return new URLSearchParams(s);
  }
  /**
   * Filters the with endpoint.bodyParams matching parameters to Record<string, any>
   * @param endpoint 
   * @param params 
   */
  parseBodyParams(e, t) {
    return e.bodyParams ? this.matchParams(e.bodyParams, t) : {};
  }
  /**
  * Validates that an API key is available
  * @private
  */
  validateAPIKey(e) {
    if (!e)
      throw new Error("API key not provided");
  }
  /**
   * Send a request to the API
   * @param path - API endpoint path
   * @param method - HTTP method (GET, POST, etc)
   * @param params - Request parameters
   * @param apiKey - API key to use for this request
   * @param file - Optional file to upload
   * @returns Promise with the API response
   */
  async sendRequest(e, t = "POST", s = {}, a = {}, n, i) {
    const o = n || this.config.apiKey;
    this.validateAPIKey(o), s = new URLSearchParams(s);
    const l = `${this.config.baseUrl}/${e}?${s.toString()}`, d = {
      method: t,
      headers: {
        Authorization: `Bearer ${o}`,
        "Content-Type": "application/json"
      },
      signal: this.controller.signal
    };
    if (t === "GET") {
      const f = Object.keys(a);
      if (f.length > 0)
        for (const w of f)
          s.append(w, a[w]);
    } else
      d.body = JSON.stringify(a);
    try {
      const f = await fetch(l, d);
      if (!f.ok) {
        const w = await f.text();
        throw new Error(`API error (${f.status}): ${w}`);
      }
      return await f.json();
    } catch (f) {
      throw f instanceof Error ? f : new Error(`Network error: ${String(f)}`);
    }
  }
  async request_endpoint(e, t, s, a) {
    const n = this.parseQueryParams(e, t), i = this.parseBodyParams(e, t);
    return a = await this.handleFileUpload(a), this.sendRequest(e.path, e.method, n, i, s, a);
  }
  /**
   * Abort any ongoing requests
   */
  abort() {
    this.controller.abort(), this.controller = new AbortController();
  }
}
var T = /* @__PURE__ */ ((r) => (r.CREATED = "CREATED", r.QUEUED = "QUEUED", r.PROCESSING = "PROCESSING", r.COMPLETED = "COMPLETED", r.FAILED = "FAILED", r))(T || {}), k = /* @__PURE__ */ ((r) => (r.INITIALIZING = "INITIALIZING", r.PREPARING = "PREPARING", r.SENDING = "SENDING", r.TRACKING = "TRACKING", r.PROCESSING_RESULT = "PROCESSING_RESULT", r.COMPLETED = "COMPLETED", r.FAILED = "FAILED", r))(k || {});
class tt {
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
      return T.COMPLETED;
    if (t === "FAILED" || t === "ERROR")
      return T.FAILED;
    if (t === "IN_PROGRESS" || t === "PROCESSING" || t === "RUNNING" || t === "BOOTING")
      return T.PROCESSING;
    if (t === "QUEUED" || t === "PENDING" || t === "IN_QUEUE" || t === "STARTING")
      return T.QUEUED;
    if (e.state) {
      const s = e.state.toUpperCase();
      if (s === "COMPLETED") return T.COMPLETED;
      if (s === "FAILED") return T.FAILED;
      if (s === "IN_PROGRESS") return T.PROCESSING;
      if (s === "IN_QUEUE") return T.QUEUED;
      if (s === "CANCELLED" || s === "TIMED_OUT") return T.FAILED;
    }
    return T.CREATED;
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
    return this.parseStatus(e) === T.COMPLETED && (t = 1), {
      progress: t,
      message: s
    };
  }
}
class st {
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
const V = class V {
  /**
   * Private constructor to enforce singleton pattern
   * @param requestHandler - RequestHandler for API communication
   */
  constructor(e) {
    y(this, "requestHandler");
    y(this, "config");
    y(this, "jobs");
    y(this, "responseParser");
    y(this, "mediaHandler");
    this.requestHandler = e, this.config = D.getInstance(), this.jobs = /* @__PURE__ */ new Map(), this.responseParser = new tt(), this.mediaHandler = new st();
  }
  /**
   * Get the singleton instance of JobManager
   * @param requestHandler - Optional RequestHandler to use when creating the instance
   * @returns The JobManager instance
   */
  static getInstance(e) {
    return V.instance || (e || (e = new De()), V.instance = new V(e)), V.instance;
  }
  /**
   * Submit a new job to the API
   * @param endpoint - API endpoint to call
   * @param params - Parameters for the job
   * @param apiKey - Optional API key to use for this request
   * @param file - Optional file to include
   * @returns Promise resolving to the created job
   */
  async submitJob(e, t, s, a) {
    try {
      const n = await this.requestHandler.request_endpoint(e, t, s, a);
      if (!this.responseParser.canParse(n))
        throw new Error("Unexpected response format from API");
      const i = this.responseParser.parse(n);
      return this.jobs.set(i.id, i), i;
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
        const s = await this.requestHandler.sendRequest("status", "POST", { job_id: e.id }), a = this.responseParser.parse(s);
        if (this.jobs.set(e.id, a), a.status === T.COMPLETED)
          return a.result;
        if (a.status === T.FAILED)
          throw new Error(`Job failed: ${a.error}`);
        await new Promise((n) => setTimeout(n, this.config.pollInterval));
      } catch (s) {
        if (t++, t >= this.config.maxRetries)
          throw s;
        await new Promise((a) => setTimeout(a, this.config.pollInterval * t));
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
      (t.status === T.COMPLETED || t.status === T.FAILED) && this.jobs.delete(e);
  }
};
y(V, "instance");
let xe = V;
const ne = typeof process < "u" && process.stdout && process.stdout.clearLine;
let Y;
if (ne)
  try {
    Y = require("cli-progress");
  } catch {
    console.warn("cli-progress package not found. Using basic console output for progress.");
  }
const F = class F {
  constructor() {
    y(this, "multiBar");
    y(this, "bars", /* @__PURE__ */ new Map());
    y(this, "isInitialized", !1);
    ne && Y && (this.multiBar = new Y.MultiBar({
      clearOnComplete: !1,
      hideCursor: !0,
      format: "{bar} {percentage}% | {jobId} | {phase} | {message}"
    }), this.isInitialized = !0);
  }
  static getInstance() {
    return F.instance || (F.instance = new F()), F.instance;
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
    const a = this.bars.get(e);
    a && a.update(t, s);
  }
  removeBar(e) {
    const t = this.bars.get(e);
    t && (t.stop(), this.multiBar.remove(t), this.bars.delete(e));
  }
  stopAll() {
    this.isInitialized && (this.multiBar.stop(), this.bars.clear());
  }
};
y(F, "instance");
let Oe = F;
class rt {
  constructor(e, t, s, a = !0) {
    y(this, "apiJob");
    y(this, "endpoint");
    y(this, "processingState");
    y(this, "jobManager");
    y(this, "result", null);
    y(this, "error", null);
    y(this, "completed", !1);
    y(this, "pollingInterval", null);
    y(this, "resolvePromise");
    y(this, "rejectPromise");
    y(this, "promise");
    y(this, "eventListeners", /* @__PURE__ */ new Map());
    y(this, "verbose");
    y(this, "progressBar", null);
    y(this, "progressBarManager");
    // Keep track of the last logged message to avoid duplicates
    y(this, "_lastLoggedMessage", null);
    this.apiJob = e, this.jobManager = t, this.endpoint = s, this.verbose = a, this.processingState = {
      phase: k.INITIALIZING,
      progress: 0
    }, this.progressBarManager = Oe.getInstance(), this.promise = new Promise((n, i) => {
      this.resolvePromise = n, this.rejectPromise = i;
    }), setTimeout(() => this.startTracking(), 0), this.verbose && this.initProgressDisplay();
  }
  /**
   * Initialize the progress display
   */
  initProgressDisplay() {
    this.verbose && (ne && Y ? (this.progressBar = this.progressBarManager.createBar(
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
    ne && Y && this.progressBar ? this.progressBarManager.updateBar(this.apiJob.id, t, {
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
      const a = this.apiJob.progress ? `${Math.round(this.apiJob.progress.progress * 100)}%` : "unknown";
      let n = `Job ${t} | Progress: ${a} | API: ${this.endpoint.path}`;
      return (s = this.apiJob.progress) != null && s.message && (n += ` | ${this.apiJob.progress.message}`), n;
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
    ne && Y && this.progressBar && (this.progressBarManager.removeBar(this.apiJob.id), this.progressBar = null);
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
    s && s.forEach((a) => a(...t));
  }
  /**
   * Start tracking the job
   */
  startTracking() {
    this.updateProcessingState(k.TRACKING, 0, "Tracking job status"), this.pollingInterval = setInterval(async () => {
      try {
        const e = await this.jobManager.requestHandler.sendRequest("status", "POST", { job_id: this.apiJob.id });
        if (!e)
          return;
        const t = this.jobManager.responseParser.parse(e);
        if (this.apiJob = t, this.emitJobUpdate(), this.verbose && this.updateProgressDisplay(), t.status === T.COMPLETED) {
          this.updateProcessingState(k.PROCESSING_RESULT, 0.9, "Processing result");
          try {
            this.result = t.result, this.complete();
          } catch (s) {
            this.fail(s instanceof Error ? s : new Error(String(s)));
          }
        } else t.status === T.FAILED && (this.updateProcessingState(k.FAILED, 1, t.error || "Job failed"), this.fail(new Error(t.error || "Job failed with no error message")));
      } catch (e) {
        console.error("Error polling job status:", e);
      }
    }, this.jobManager.config.pollInterval);
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
    this.pollingInterval && (clearInterval(this.pollingInterval), this.pollingInterval = null), this.stopProgressDisplay();
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
class at {
  constructor(e) {
    y(this, "requestHandler");
    y(this, "config");
    y(this, "endpoints");
    y(this, "jobManager");
    // Name of the API client. Has influence on path variable in the requests which will be formatted like /api/v1/{name}/{endpoint}
    y(this, "name");
    this.name = this.sanitize_path(e), this.config = D.getInstance(), this.requestHandler = new De(), this.endpoints = /* @__PURE__ */ new Map(), this.jobManager = xe.getInstance(this.requestHandler), this.registerEndpoints();
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
  async submitTrackedJob(e, t, s, a, n = !0) {
    const i = await this.jobManager.submitJob(e, t, s, a);
    return new rt(i, this.jobManager, e, n);
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
var b;
(function(r) {
  r.assertEqual = (a) => a;
  function e(a) {
  }
  r.assertIs = e;
  function t(a) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (a) => {
    const n = {};
    for (const i of a)
      n[i] = i;
    return n;
  }, r.getValidEnumValues = (a) => {
    const n = r.objectKeys(a).filter((o) => typeof a[a[o]] != "number"), i = {};
    for (const o of n)
      i[o] = a[o];
    return r.objectValues(i);
  }, r.objectValues = (a) => r.objectKeys(a).map(function(n) {
    return a[n];
  }), r.objectKeys = typeof Object.keys == "function" ? (a) => Object.keys(a) : (a) => {
    const n = [];
    for (const i in a)
      Object.prototype.hasOwnProperty.call(a, i) && n.push(i);
    return n;
  }, r.find = (a, n) => {
    for (const i of a)
      if (n(i))
        return i;
  }, r.isInteger = typeof Number.isInteger == "function" ? (a) => Number.isInteger(a) : (a) => typeof a == "number" && isFinite(a) && Math.floor(a) === a;
  function s(a, n = " | ") {
    return a.map((i) => typeof i == "string" ? `'${i}'` : i).join(n);
  }
  r.joinValues = s, r.jsonStringifyReplacer = (a, n) => typeof n == "bigint" ? n.toString() : n;
})(b || (b = {}));
var je;
(function(r) {
  r.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(je || (je = {}));
const h = b.arrayToEnum([
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
]), M = (r) => {
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
}, c = b.arrayToEnum([
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
]), nt = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class S extends Error {
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
    const t = e || function(n) {
      return n.message;
    }, s = { _errors: [] }, a = (n) => {
      for (const i of n.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(a);
        else if (i.code === "invalid_return_type")
          a(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          a(i.argumentsError);
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
    return a(this), s;
  }
  static assert(e) {
    if (!(e instanceof S))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, b.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const a of this.issues)
      a.path.length > 0 ? (t[a.path[0]] = t[a.path[0]] || [], t[a.path[0]].push(e(a))) : s.push(e(a));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
S.create = (r) => new S(r);
const ee = (r, e) => {
  let t;
  switch (r.code) {
    case c.invalid_type:
      r.received === h.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case c.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, b.jsonStringifyReplacer)}`;
      break;
    case c.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${b.joinValues(r.keys, ", ")}`;
      break;
    case c.invalid_union:
      t = "Invalid input";
      break;
    case c.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${b.joinValues(r.options)}`;
      break;
    case c.invalid_enum_value:
      t = `Invalid enum value. Expected ${b.joinValues(r.options)}, received '${r.received}'`;
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
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : b.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
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
      t = e.defaultError, b.assertNever(r);
  }
  return { message: t };
};
let Je = ee;
function it(r) {
  Je = r;
}
function ke() {
  return Je;
}
const we = (r) => {
  const { data: e, path: t, errorMaps: s, issueData: a } = r, n = [...t, ...a.path || []], i = {
    ...a,
    path: n
  };
  if (a.message !== void 0)
    return {
      ...a,
      path: n,
      message: a.message
    };
  let o = "";
  const l = s.filter((d) => !!d).slice().reverse();
  for (const d of l)
    o = d(i, { data: e, defaultError: o }).message;
  return {
    ...a,
    path: n,
    message: o
  };
}, ot = [];
function u(r, e) {
  const t = ke(), s = we({
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
      t === ee ? void 0 : ee
      // then global default map
    ].filter((a) => !!a)
  });
  r.common.issues.push(s);
}
class E {
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
    for (const a of t) {
      if (a.status === "aborted")
        return g;
      a.status === "dirty" && e.dirty(), s.push(a.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const a of t) {
      const n = await a.key, i = await a.value;
      s.push({
        key: n,
        value: i
      });
    }
    return E.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const a of t) {
      const { key: n, value: i } = a;
      if (n.status === "aborted" || i.status === "aborted")
        return g;
      n.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), n.value !== "__proto__" && (typeof i.value < "u" || a.alwaysSet) && (s[n.value] = i.value);
    }
    return { status: e.value, value: s };
  }
}
const g = Object.freeze({
  status: "aborted"
}), Q = (r) => ({ status: "dirty", value: r }), I = (r) => ({ status: "valid", value: r }), Pe = (r) => r.status === "aborted", Ze = (r) => r.status === "dirty", q = (r) => r.status === "valid", ie = (r) => typeof Promise < "u" && r instanceof Promise;
function Te(r, e, t, s) {
  if (typeof e == "function" ? r !== e || !0 : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function Ve(r, e, t, s, a) {
  if (typeof e == "function" ? r !== e || !0 : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var p;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(p || (p = {}));
var re, ae;
class O {
  constructor(e, t, s, a) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = a;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const $e = (r, e) => {
  if (q(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new S(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function v(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: a } = r;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a } : { errorMap: (i, o) => {
    var l, d;
    const { message: f } = r;
    return i.code === "invalid_enum_value" ? { message: f ?? o.defaultError } : typeof o.data > "u" ? { message: (l = f ?? s) !== null && l !== void 0 ? l : o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: (d = f ?? t) !== null && d !== void 0 ? d : o.defaultError };
  }, description: a };
}
class _ {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return M(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: M(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new E(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: M(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (ie(t))
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
    const a = {
      common: {
        issues: [],
        async: (s = t == null ? void 0 : t.async) !== null && s !== void 0 ? s : !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: M(e)
    }, n = this._parseSync({ data: e, path: a.path, parent: a });
    return $e(a, n);
  }
  "~validate"(e) {
    var t, s;
    const a = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: M(e)
    };
    if (!this["~standard"].async)
      try {
        const n = this._parseSync({ data: e, path: [], parent: a });
        return q(n) ? {
          value: n.value
        } : {
          issues: a.common.issues
        };
      } catch (n) {
        !((s = (t = n == null ? void 0 : n.message) === null || t === void 0 ? void 0 : t.toLowerCase()) === null || s === void 0) && s.includes("encountered") && (this["~standard"].async = !0), a.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: a }).then((n) => q(n) ? {
      value: n.value
    } : {
      issues: a.common.issues
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
      parsedType: M(e)
    }, a = this._parse({ data: e, path: s.path, parent: s }), n = await (ie(a) ? a : Promise.resolve(a));
    return $e(s, n);
  }
  refine(e, t) {
    const s = (a) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a) : t;
    return this._refinement((a, n) => {
      const i = e(a), o = () => n.addIssue({
        code: c.custom,
        ...s(a)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((l) => l ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, a) => e(s) ? !0 : (a.addIssue(typeof t == "function" ? t(s, a) : t), !1));
  }
  _refinement(e) {
    return new R({
      schema: this,
      typeName: m.ZodEffects,
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
    return N.create(this, this._def);
  }
  nullable() {
    return J.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return C.create(this);
  }
  promise() {
    return se.create(this, this._def);
  }
  or(e) {
    return ue.create([this, e], this._def);
  }
  and(e) {
    return le.create(this, e, this._def);
  }
  transform(e) {
    return new R({
      ...v(this._def),
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ge({
      ...v(this._def),
      innerType: this,
      defaultValue: t,
      typeName: m.ZodDefault
    });
  }
  brand() {
    return new Le({
      typeName: m.ZodBranded,
      type: this,
      ...v(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ye({
      ...v(this._def),
      innerType: this,
      catchValue: t,
      typeName: m.ZodCatch
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
    return _e.create(this, e);
  }
  readonly() {
    return ve.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const ct = /^c[^\s-]{8,}$/i, dt = /^[0-9a-z]+$/, ut = /^[0-9A-HJKMNP-TV-Z]{26}$/i, lt = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, ht = /^[a-z0-9_-]{21}$/i, ft = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, pt = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, mt = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, gt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Ne;
const yt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, vt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, _t = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, bt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, xt = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, kt = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Fe = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", wt = new RegExp(`^${Fe}$`);
function Ge(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function Tt(r) {
  return new RegExp(`^${Ge(r)}$`);
}
function qe(r) {
  let e = `${Fe}T${Ge(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Et(r, e) {
  return !!((e === "v4" || !e) && yt.test(r) || (e === "v6" || !e) && _t.test(r));
}
function It(r, e) {
  if (!ft.test(r))
    return !1;
  try {
    const [t] = r.split("."), s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a = JSON.parse(atob(s));
    return !(typeof a != "object" || a === null || !a.typ || !a.alg || e && a.alg !== e);
  } catch {
    return !1;
  }
}
function St(r, e) {
  return !!((e === "v4" || !e) && vt.test(r) || (e === "v6" || !e) && bt.test(r));
}
class A extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== h.string) {
      const n = this._getOrReturnCtx(e);
      return u(n, {
        code: c.invalid_type,
        expected: h.string,
        received: n.parsedType
      }), g;
    }
    const s = new E();
    let a;
    for (const n of this._def.checks)
      if (n.kind === "min")
        e.data.length < n.value && (a = this._getOrReturnCtx(e, a), u(a, {
          code: c.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), s.dirty());
      else if (n.kind === "max")
        e.data.length > n.value && (a = this._getOrReturnCtx(e, a), u(a, {
          code: c.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), s.dirty());
      else if (n.kind === "length") {
        const i = e.data.length > n.value, o = e.data.length < n.value;
        (i || o) && (a = this._getOrReturnCtx(e, a), i ? u(a, {
          code: c.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }) : o && u(a, {
          code: c.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }), s.dirty());
      } else if (n.kind === "email")
        mt.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "email",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "emoji")
        Ne || (Ne = new RegExp(gt, "u")), Ne.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "emoji",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "uuid")
        lt.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "uuid",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "nanoid")
        ht.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "nanoid",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "cuid")
        ct.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "cuid",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "cuid2")
        dt.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "cuid2",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "ulid")
        ut.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
          validation: "ulid",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "url")
        try {
          new URL(e.data);
        } catch {
          a = this._getOrReturnCtx(e, a), u(a, {
            validation: "url",
            code: c.invalid_string,
            message: n.message
          }), s.dirty();
        }
      else n.kind === "regex" ? (n.regex.lastIndex = 0, n.regex.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "regex",
        code: c.invalid_string,
        message: n.message
      }), s.dirty())) : n.kind === "trim" ? e.data = e.data.trim() : n.kind === "includes" ? e.data.includes(n.value, n.position) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: c.invalid_string,
        validation: { includes: n.value, position: n.position },
        message: n.message
      }), s.dirty()) : n.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : n.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : n.kind === "startsWith" ? e.data.startsWith(n.value) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: c.invalid_string,
        validation: { startsWith: n.value },
        message: n.message
      }), s.dirty()) : n.kind === "endsWith" ? e.data.endsWith(n.value) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: c.invalid_string,
        validation: { endsWith: n.value },
        message: n.message
      }), s.dirty()) : n.kind === "datetime" ? qe(n).test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: c.invalid_string,
        validation: "datetime",
        message: n.message
      }), s.dirty()) : n.kind === "date" ? wt.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: c.invalid_string,
        validation: "date",
        message: n.message
      }), s.dirty()) : n.kind === "time" ? Tt(n).test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        code: c.invalid_string,
        validation: "time",
        message: n.message
      }), s.dirty()) : n.kind === "duration" ? pt.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "duration",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "ip" ? Et(e.data, n.version) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "ip",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "jwt" ? It(e.data, n.alg) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "jwt",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "cidr" ? St(e.data, n.version) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "cidr",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "base64" ? xt.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "base64",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "base64url" ? kt.test(e.data) || (a = this._getOrReturnCtx(e, a), u(a, {
        validation: "base64url",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : b.assertNever(n);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((a) => e.test(a), {
      validation: t,
      code: c.invalid_string,
      ...p.errToObj(s)
    });
  }
  _addCheck(e) {
    return new A({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...p.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...p.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...p.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...p.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...p.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...p.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...p.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...p.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...p.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...p.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...p.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...p.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...p.errToObj(e) });
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
      ...p.errToObj(e == null ? void 0 : e.message)
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
      ...p.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...p.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...p.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...p.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...p.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...p.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...p.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...p.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...p.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, p.errToObj(e));
  }
  trim() {
    return new A({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new A({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new A({
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
A.create = (r) => {
  var e;
  return new A({
    checks: [],
    typeName: m.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...v(r)
  });
};
function At(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, a = t > s ? t : s, n = parseInt(r.toFixed(a).replace(".", "")), i = parseInt(e.toFixed(a).replace(".", ""));
  return n % i / Math.pow(10, a);
}
class U extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== h.number) {
      const n = this._getOrReturnCtx(e);
      return u(n, {
        code: c.invalid_type,
        expected: h.number,
        received: n.parsedType
      }), g;
    }
    let s;
    const a = new E();
    for (const n of this._def.checks)
      n.kind === "int" ? b.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.invalid_type,
        expected: "integer",
        received: "float",
        message: n.message
      }), a.dirty()) : n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.too_small,
        minimum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), a.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.too_big,
        maximum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), a.dirty()) : n.kind === "multipleOf" ? At(e.data, n.value) !== 0 && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), a.dirty()) : n.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.not_finite,
        message: n.message
      }), a.dirty()) : b.assertNever(n);
    return { status: a.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, p.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, p.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, p.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, p.toString(t));
  }
  setLimit(e, t, s, a) {
    return new U({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: p.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new U({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: p.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: p.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: p.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: p.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: p.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: p.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: p.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: p.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: p.toString(e)
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && b.isInteger(e.value));
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
U.create = (r) => new U({
  checks: [],
  typeName: m.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...v(r)
});
class z extends _ {
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
    const a = new E();
    for (const n of this._def.checks)
      n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.too_small,
        type: "bigint",
        minimum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), a.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.too_big,
        type: "bigint",
        maximum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), a.dirty()) : n.kind === "multipleOf" ? e.data % n.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), u(s, {
        code: c.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), a.dirty()) : b.assertNever(n);
    return { status: a.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return u(t, {
      code: c.invalid_type,
      expected: h.bigint,
      received: t.parsedType
    }), g;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, p.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, p.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, p.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, p.toString(t));
  }
  setLimit(e, t, s, a) {
    return new z({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: p.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new z({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: p.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: p.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: p.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: p.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: p.toString(t)
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
z.create = (r) => {
  var e;
  return new z({
    checks: [],
    typeName: m.ZodBigInt,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1,
    ...v(r)
  });
};
class oe extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== h.boolean) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.boolean,
        received: s.parsedType
      }), g;
    }
    return I(e.data);
  }
}
oe.create = (r) => new oe({
  typeName: m.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1,
  ...v(r)
});
class W extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== h.date) {
      const n = this._getOrReturnCtx(e);
      return u(n, {
        code: c.invalid_type,
        expected: h.date,
        received: n.parsedType
      }), g;
    }
    if (isNaN(e.data.getTime())) {
      const n = this._getOrReturnCtx(e);
      return u(n, {
        code: c.invalid_date
      }), g;
    }
    const s = new E();
    let a;
    for (const n of this._def.checks)
      n.kind === "min" ? e.data.getTime() < n.value && (a = this._getOrReturnCtx(e, a), u(a, {
        code: c.too_small,
        message: n.message,
        inclusive: !0,
        exact: !1,
        minimum: n.value,
        type: "date"
      }), s.dirty()) : n.kind === "max" ? e.data.getTime() > n.value && (a = this._getOrReturnCtx(e, a), u(a, {
        code: c.too_big,
        message: n.message,
        inclusive: !0,
        exact: !1,
        maximum: n.value,
        type: "date"
      }), s.dirty()) : b.assertNever(n);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new W({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: p.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: p.toString(t)
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
W.create = (r) => new W({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: m.ZodDate,
  ...v(r)
});
class Ee extends _ {
  _parse(e) {
    if (this._getType(e) !== h.symbol) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.symbol,
        received: s.parsedType
      }), g;
    }
    return I(e.data);
  }
}
Ee.create = (r) => new Ee({
  typeName: m.ZodSymbol,
  ...v(r)
});
class ce extends _ {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.undefined,
        received: s.parsedType
      }), g;
    }
    return I(e.data);
  }
}
ce.create = (r) => new ce({
  typeName: m.ZodUndefined,
  ...v(r)
});
class de extends _ {
  _parse(e) {
    if (this._getType(e) !== h.null) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.null,
        received: s.parsedType
      }), g;
    }
    return I(e.data);
  }
}
de.create = (r) => new de({
  typeName: m.ZodNull,
  ...v(r)
});
class te extends _ {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return I(e.data);
  }
}
te.create = (r) => new te({
  typeName: m.ZodAny,
  ...v(r)
});
class G extends _ {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return I(e.data);
  }
}
G.create = (r) => new G({
  typeName: m.ZodUnknown,
  ...v(r)
});
class L extends _ {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return u(t, {
      code: c.invalid_type,
      expected: h.never,
      received: t.parsedType
    }), g;
  }
}
L.create = (r) => new L({
  typeName: m.ZodNever,
  ...v(r)
});
class Ie extends _ {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.void,
        received: s.parsedType
      }), g;
    }
    return I(e.data);
  }
}
Ie.create = (r) => new Ie({
  typeName: m.ZodVoid,
  ...v(r)
});
class C extends _ {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), a = this._def;
    if (t.parsedType !== h.array)
      return u(t, {
        code: c.invalid_type,
        expected: h.array,
        received: t.parsedType
      }), g;
    if (a.exactLength !== null) {
      const i = t.data.length > a.exactLength.value, o = t.data.length < a.exactLength.value;
      (i || o) && (u(t, {
        code: i ? c.too_big : c.too_small,
        minimum: o ? a.exactLength.value : void 0,
        maximum: i ? a.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: a.exactLength.message
      }), s.dirty());
    }
    if (a.minLength !== null && t.data.length < a.minLength.value && (u(t, {
      code: c.too_small,
      minimum: a.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.minLength.message
    }), s.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (u(t, {
      code: c.too_big,
      maximum: a.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => a.type._parseAsync(new O(t, i, t.path, o)))).then((i) => E.mergeArray(s, i));
    const n = [...t.data].map((i, o) => a.type._parseSync(new O(t, i, t.path, o)));
    return E.mergeArray(s, n);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new C({
      ...this._def,
      minLength: { value: e, message: p.toString(t) }
    });
  }
  max(e, t) {
    return new C({
      ...this._def,
      maxLength: { value: e, message: p.toString(t) }
    });
  }
  length(e, t) {
    return new C({
      ...this._def,
      exactLength: { value: e, message: p.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
C.create = (r, e) => new C({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: m.ZodArray,
  ...v(e)
});
function K(r) {
  if (r instanceof x) {
    const e = {};
    for (const t in r.shape) {
      const s = r.shape[t];
      e[t] = N.create(K(s));
    }
    return new x({
      ...r._def,
      shape: () => e
    });
  } else return r instanceof C ? new C({
    ...r._def,
    type: K(r.element)
  }) : r instanceof N ? N.create(K(r.unwrap())) : r instanceof J ? J.create(K(r.unwrap())) : r instanceof j ? j.create(r.items.map((e) => K(e))) : r;
}
class x extends _ {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = b.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== h.object) {
      const d = this._getOrReturnCtx(e);
      return u(d, {
        code: c.invalid_type,
        expected: h.object,
        received: d.parsedType
      }), g;
    }
    const { status: s, ctx: a } = this._processInputParams(e), { shape: n, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof L && this._def.unknownKeys === "strip"))
      for (const d in a.data)
        i.includes(d) || o.push(d);
    const l = [];
    for (const d of i) {
      const f = n[d], w = a.data[d];
      l.push({
        key: { status: "valid", value: d },
        value: f._parse(new O(a, w, a.path, d)),
        alwaysSet: d in a.data
      });
    }
    if (this._def.catchall instanceof L) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const f of o)
          l.push({
            key: { status: "valid", value: f },
            value: { status: "valid", value: a.data[f] }
          });
      else if (d === "strict")
        o.length > 0 && (u(a, {
          code: c.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const f of o) {
        const w = a.data[f];
        l.push({
          key: { status: "valid", value: f },
          value: d._parse(
            new O(a, w, a.path, f)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: f in a.data
        });
      }
    }
    return a.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const f of l) {
        const w = await f.key, be = await f.value;
        d.push({
          key: w,
          value: be,
          alwaysSet: f.alwaysSet
        });
      }
      return d;
    }).then((d) => E.mergeObjectSync(s, d)) : E.mergeObjectSync(s, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return p.errToObj, new x({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var a, n, i, o;
          const l = (i = (n = (a = this._def).errorMap) === null || n === void 0 ? void 0 : n.call(a, t, s).message) !== null && i !== void 0 ? i : s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: (o = p.errToObj(e).message) !== null && o !== void 0 ? o : l
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
      typeName: m.ZodObject
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
    return b.objectKeys(e).forEach((s) => {
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    return b.objectKeys(this.shape).forEach((s) => {
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
    return K(this);
  }
  partial(e) {
    const t = {};
    return b.objectKeys(this.shape).forEach((s) => {
      const a = this.shape[s];
      e && !e[s] ? t[s] = a : t[s] = a.optional();
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    return b.objectKeys(this.shape).forEach((s) => {
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let n = this.shape[s];
        for (; n instanceof N; )
          n = n._def.innerType;
        t[s] = n;
      }
    }), new x({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return We(b.objectKeys(this.shape));
  }
}
x.create = (r, e) => new x({
  shape: () => r,
  unknownKeys: "strip",
  catchall: L.create(),
  typeName: m.ZodObject,
  ...v(e)
});
x.strictCreate = (r, e) => new x({
  shape: () => r,
  unknownKeys: "strict",
  catchall: L.create(),
  typeName: m.ZodObject,
  ...v(e)
});
x.lazycreate = (r, e) => new x({
  shape: r,
  unknownKeys: "strip",
  catchall: L.create(),
  typeName: m.ZodObject,
  ...v(e)
});
class ue extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function a(n) {
      for (const o of n)
        if (o.result.status === "valid")
          return o.result;
      for (const o of n)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = n.map((o) => new S(o.ctx.common.issues));
      return u(t, {
        code: c.invalid_union,
        unionErrors: i
      }), g;
    }
    if (t.common.async)
      return Promise.all(s.map(async (n) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await n._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(a);
    {
      let n;
      const i = [];
      for (const l of s) {
        const d = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, f = l._parseSync({
          data: t.data,
          path: t.path,
          parent: d
        });
        if (f.status === "valid")
          return f;
        f.status === "dirty" && !n && (n = { result: f, ctx: d }), d.common.issues.length && i.push(d.common.issues);
      }
      if (n)
        return t.common.issues.push(...n.ctx.common.issues), n.result;
      const o = i.map((l) => new S(l));
      return u(t, {
        code: c.invalid_union,
        unionErrors: o
      }), g;
    }
  }
  get options() {
    return this._def.options;
  }
}
ue.create = (r, e) => new ue({
  options: r,
  typeName: m.ZodUnion,
  ...v(e)
});
const Z = (r) => r instanceof fe ? Z(r.schema) : r instanceof R ? Z(r.innerType()) : r instanceof pe ? [r.value] : r instanceof B ? r.options : r instanceof me ? b.objectValues(r.enum) : r instanceof ge ? Z(r._def.innerType) : r instanceof ce ? [void 0] : r instanceof de ? [null] : r instanceof N ? [void 0, ...Z(r.unwrap())] : r instanceof J ? [null, ...Z(r.unwrap())] : r instanceof Le || r instanceof ve ? Z(r.unwrap()) : r instanceof ye ? Z(r._def.innerType) : [];
class Ce extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.object)
      return u(t, {
        code: c.invalid_type,
        expected: h.object,
        received: t.parsedType
      }), g;
    const s = this.discriminator, a = t.data[s], n = this.optionsMap.get(a);
    return n ? t.common.async ? n._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : n._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (u(t, {
      code: c.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [s]
    }), g);
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
    const a = /* @__PURE__ */ new Map();
    for (const n of t) {
      const i = Z(n.shape[e]);
      if (!i.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const o of i) {
        if (a.has(o))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(o)}`);
        a.set(o, n);
      }
    }
    return new Ce({
      typeName: m.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: a,
      ...v(s)
    });
  }
}
function Me(r, e) {
  const t = M(r), s = M(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === h.object && s === h.object) {
    const a = b.objectKeys(e), n = b.objectKeys(r).filter((o) => a.indexOf(o) !== -1), i = { ...r, ...e };
    for (const o of n) {
      const l = Me(r[o], e[o]);
      if (!l.valid)
        return { valid: !1 };
      i[o] = l.data;
    }
    return { valid: !0, data: i };
  } else if (t === h.array && s === h.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const a = [];
    for (let n = 0; n < r.length; n++) {
      const i = r[n], o = e[n], l = Me(i, o);
      if (!l.valid)
        return { valid: !1 };
      a.push(l.data);
    }
    return { valid: !0, data: a };
  } else return t === h.date && s === h.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class le extends _ {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), a = (n, i) => {
      if (Pe(n) || Pe(i))
        return g;
      const o = Me(n.value, i.value);
      return o.valid ? ((Ze(n) || Ze(i)) && t.dirty(), { status: t.value, value: o.data }) : (u(s, {
        code: c.invalid_intersection_types
      }), g);
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
    ]).then(([n, i]) => a(n, i)) : a(this._def.left._parseSync({
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
le.create = (r, e, t) => new le({
  left: r,
  right: e,
  typeName: m.ZodIntersection,
  ...v(t)
});
class j extends _ {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.array)
      return u(s, {
        code: c.invalid_type,
        expected: h.array,
        received: s.parsedType
      }), g;
    if (s.data.length < this._def.items.length)
      return u(s, {
        code: c.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), g;
    !this._def.rest && s.data.length > this._def.items.length && (u(s, {
      code: c.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const n = [...s.data].map((i, o) => {
      const l = this._def.items[o] || this._def.rest;
      return l ? l._parse(new O(s, i, s.path, o)) : null;
    }).filter((i) => !!i);
    return s.common.async ? Promise.all(n).then((i) => E.mergeArray(t, i)) : E.mergeArray(t, n);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new j({
      ...this._def,
      rest: e
    });
  }
}
j.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new j({
    items: r,
    typeName: m.ZodTuple,
    rest: null,
    ...v(e)
  });
};
class he extends _ {
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
      }), g;
    const a = [], n = this._def.keyType, i = this._def.valueType;
    for (const o in s.data)
      a.push({
        key: n._parse(new O(s, o, s.path, o)),
        value: i._parse(new O(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? E.mergeObjectAsync(t, a) : E.mergeObjectSync(t, a);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof _ ? new he({
      keyType: e,
      valueType: t,
      typeName: m.ZodRecord,
      ...v(s)
    }) : new he({
      keyType: A.create(),
      valueType: e,
      typeName: m.ZodRecord,
      ...v(t)
    });
  }
}
class Se extends _ {
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
      }), g;
    const a = this._def.keyType, n = this._def.valueType, i = [...s.data.entries()].map(([o, l], d) => ({
      key: a._parse(new O(s, o, s.path, [d, "key"])),
      value: n._parse(new O(s, l, s.path, [d, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const l of i) {
          const d = await l.key, f = await l.value;
          if (d.status === "aborted" || f.status === "aborted")
            return g;
          (d.status === "dirty" || f.status === "dirty") && t.dirty(), o.set(d.value, f.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const l of i) {
        const d = l.key, f = l.value;
        if (d.status === "aborted" || f.status === "aborted")
          return g;
        (d.status === "dirty" || f.status === "dirty") && t.dirty(), o.set(d.value, f.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Se.create = (r, e, t) => new Se({
  valueType: e,
  keyType: r,
  typeName: m.ZodMap,
  ...v(t)
});
class H extends _ {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.set)
      return u(s, {
        code: c.invalid_type,
        expected: h.set,
        received: s.parsedType
      }), g;
    const a = this._def;
    a.minSize !== null && s.data.size < a.minSize.value && (u(s, {
      code: c.too_small,
      minimum: a.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.minSize.message
    }), t.dirty()), a.maxSize !== null && s.data.size > a.maxSize.value && (u(s, {
      code: c.too_big,
      maximum: a.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.maxSize.message
    }), t.dirty());
    const n = this._def.valueType;
    function i(l) {
      const d = /* @__PURE__ */ new Set();
      for (const f of l) {
        if (f.status === "aborted")
          return g;
        f.status === "dirty" && t.dirty(), d.add(f.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...s.data.values()].map((l, d) => n._parse(new O(s, l, s.path, d)));
    return s.common.async ? Promise.all(o).then((l) => i(l)) : i(o);
  }
  min(e, t) {
    return new H({
      ...this._def,
      minSize: { value: e, message: p.toString(t) }
    });
  }
  max(e, t) {
    return new H({
      ...this._def,
      maxSize: { value: e, message: p.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
H.create = (r, e) => new H({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: m.ZodSet,
  ...v(e)
});
class X extends _ {
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
      }), g;
    function s(o, l) {
      return we({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          ke(),
          ee
        ].filter((d) => !!d),
        issueData: {
          code: c.invalid_arguments,
          argumentsError: l
        }
      });
    }
    function a(o, l) {
      return we({
        data: o,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          ke(),
          ee
        ].filter((d) => !!d),
        issueData: {
          code: c.invalid_return_type,
          returnTypeError: l
        }
      });
    }
    const n = { errorMap: t.common.contextualErrorMap }, i = t.data;
    if (this._def.returns instanceof se) {
      const o = this;
      return I(async function(...l) {
        const d = new S([]), f = await o._def.args.parseAsync(l, n).catch((Re) => {
          throw d.addIssue(s(l, Re)), d;
        }), w = await Reflect.apply(i, this, f);
        return await o._def.returns._def.type.parseAsync(w, n).catch((Re) => {
          throw d.addIssue(a(w, Re)), d;
        });
      });
    } else {
      const o = this;
      return I(function(...l) {
        const d = o._def.args.safeParse(l, n);
        if (!d.success)
          throw new S([s(l, d.error)]);
        const f = Reflect.apply(i, this, d.data), w = o._def.returns.safeParse(f, n);
        if (!w.success)
          throw new S([a(f, w.error)]);
        return w.data;
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
    return new X({
      ...this._def,
      args: j.create(e).rest(G.create())
    });
  }
  returns(e) {
    return new X({
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
    return new X({
      args: e || j.create([]).rest(G.create()),
      returns: t || G.create(),
      typeName: m.ZodFunction,
      ...v(s)
    });
  }
}
class fe extends _ {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
fe.create = (r, e) => new fe({
  getter: r,
  typeName: m.ZodLazy,
  ...v(e)
});
class pe extends _ {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return u(t, {
        received: t.data,
        code: c.invalid_literal,
        expected: this._def.value
      }), g;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
pe.create = (r, e) => new pe({
  value: r,
  typeName: m.ZodLiteral,
  ...v(e)
});
function We(r, e) {
  return new B({
    values: r,
    typeName: m.ZodEnum,
    ...v(e)
  });
}
class B extends _ {
  constructor() {
    super(...arguments), re.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return u(t, {
        expected: b.joinValues(s),
        received: t.parsedType,
        code: c.invalid_type
      }), g;
    }
    if (Te(this, re) || Ve(this, re, new Set(this._def.values)), !Te(this, re).has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return u(t, {
        received: t.data,
        code: c.invalid_enum_value,
        options: s
      }), g;
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
    return B.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return B.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
re = /* @__PURE__ */ new WeakMap();
B.create = We;
class me extends _ {
  constructor() {
    super(...arguments), ae.set(this, void 0);
  }
  _parse(e) {
    const t = b.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== h.string && s.parsedType !== h.number) {
      const a = b.objectValues(t);
      return u(s, {
        expected: b.joinValues(a),
        received: s.parsedType,
        code: c.invalid_type
      }), g;
    }
    if (Te(this, ae) || Ve(this, ae, new Set(b.getValidEnumValues(this._def.values))), !Te(this, ae).has(e.data)) {
      const a = b.objectValues(t);
      return u(s, {
        received: s.data,
        code: c.invalid_enum_value,
        options: a
      }), g;
    }
    return I(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
ae = /* @__PURE__ */ new WeakMap();
me.create = (r, e) => new me({
  values: r,
  typeName: m.ZodNativeEnum,
  ...v(e)
});
class se extends _ {
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
      }), g;
    const s = t.parsedType === h.promise ? t.data : Promise.resolve(t.data);
    return I(s.then((a) => this._def.type.parseAsync(a, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
se.create = (r, e) => new se({
  type: r,
  typeName: m.ZodPromise,
  ...v(e)
});
class R extends _ {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), a = this._def.effect || null, n = {
      addIssue: (i) => {
        u(s, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (n.addIssue = n.addIssue.bind(n), a.type === "preprocess") {
      const i = a.transform(s.data, n);
      if (s.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return g;
          const l = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return l.status === "aborted" ? g : l.status === "dirty" || t.value === "dirty" ? Q(l.value) : l;
        });
      {
        if (t.value === "aborted")
          return g;
        const o = this._def.schema._parseSync({
          data: i,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? g : o.status === "dirty" || t.value === "dirty" ? Q(o.value) : o;
      }
    }
    if (a.type === "refinement") {
      const i = (o) => {
        const l = a.refinement(o, n);
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
        return o.status === "aborted" ? g : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? g : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (a.type === "transform")
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!q(i))
          return i;
        const o = a.transform(i.value, n);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => q(i) ? Promise.resolve(a.transform(i.value, n)).then((o) => ({ status: t.value, value: o })) : i);
    b.assertNever(a);
  }
}
R.create = (r, e, t) => new R({
  schema: r,
  typeName: m.ZodEffects,
  effect: e,
  ...v(t)
});
R.createWithPreprocess = (r, e, t) => new R({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: m.ZodEffects,
  ...v(t)
});
class N extends _ {
  _parse(e) {
    return this._getType(e) === h.undefined ? I(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
N.create = (r, e) => new N({
  innerType: r,
  typeName: m.ZodOptional,
  ...v(e)
});
class J extends _ {
  _parse(e) {
    return this._getType(e) === h.null ? I(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
J.create = (r, e) => new J({
  innerType: r,
  typeName: m.ZodNullable,
  ...v(e)
});
class ge extends _ {
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
ge.create = (r, e) => new ge({
  innerType: r,
  typeName: m.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...v(e)
});
class ye extends _ {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, a = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: {
        ...s
      }
    });
    return ie(a) ? a.then((n) => ({
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new S(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new S(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ye.create = (r, e) => new ye({
  innerType: r,
  typeName: m.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...v(e)
});
class Ae extends _ {
  _parse(e) {
    if (this._getType(e) !== h.nan) {
      const s = this._getOrReturnCtx(e);
      return u(s, {
        code: c.invalid_type,
        expected: h.nan,
        received: s.parsedType
      }), g;
    }
    return { status: "valid", value: e.data };
  }
}
Ae.create = (r) => new Ae({
  typeName: m.ZodNaN,
  ...v(r)
});
const Ct = Symbol("zod_brand");
class Le extends _ {
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
class _e extends _ {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const n = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return n.status === "aborted" ? g : n.status === "dirty" ? (t.dirty(), Q(n.value)) : this._def.out._parseAsync({
          data: n.value,
          path: s.path,
          parent: s
        });
      })();
    {
      const a = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return a.status === "aborted" ? g : a.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: a.value
      }) : this._def.out._parseSync({
        data: a.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new _e({
      in: e,
      out: t,
      typeName: m.ZodPipeline
    });
  }
}
class ve extends _ {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (a) => (q(a) && (a.value = Object.freeze(a.value)), a);
    return ie(t) ? t.then((a) => s(a)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ve.create = (r, e) => new ve({
  innerType: r,
  typeName: m.ZodReadonly,
  ...v(e)
});
function Ue(r, e) {
  const t = typeof r == "function" ? r(e) : typeof r == "string" ? { message: r } : r;
  return typeof t == "string" ? { message: t } : t;
}
function He(r, e = {}, t) {
  return r ? te.create().superRefine((s, a) => {
    var n, i;
    const o = r(s);
    if (o instanceof Promise)
      return o.then((l) => {
        var d, f;
        if (!l) {
          const w = Ue(e, s), be = (f = (d = w.fatal) !== null && d !== void 0 ? d : t) !== null && f !== void 0 ? f : !0;
          a.addIssue({ code: "custom", ...w, fatal: be });
        }
      });
    if (!o) {
      const l = Ue(e, s), d = (i = (n = l.fatal) !== null && n !== void 0 ? n : t) !== null && i !== void 0 ? i : !0;
      a.addIssue({ code: "custom", ...l, fatal: d });
    }
  }) : te.create();
}
const Rt = {
  object: x.lazycreate
};
var m;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(m || (m = {}));
const Nt = (r, e = {
  message: `Input not instance of ${r.name}`
}) => He((t) => t instanceof r, e), Ke = A.create, Qe = U.create, Ot = Ae.create, jt = z.create, Ye = oe.create, Pt = W.create, Zt = Ee.create, Mt = ce.create, Dt = de.create, Lt = te.create, $t = G.create, Ut = L.create, zt = Ie.create, Bt = C.create, Jt = x.create, Vt = x.strictCreate, Ft = ue.create, Gt = Ce.create, qt = le.create, Wt = j.create, Ht = he.create, Kt = Se.create, Qt = H.create, Yt = X.create, Xt = fe.create, es = pe.create, ts = B.create, ss = me.create, rs = se.create, ze = R.create, as = N.create, ns = J.create, is = R.createWithPreprocess, os = _e.create, cs = () => Ke().optional(), ds = () => Qe().optional(), us = () => Ye().optional(), ls = {
  string: (r) => A.create({ ...r, coerce: !0 }),
  number: (r) => U.create({ ...r, coerce: !0 }),
  boolean: (r) => oe.create({
    ...r,
    coerce: !0
  }),
  bigint: (r) => z.create({ ...r, coerce: !0 }),
  date: (r) => W.create({ ...r, coerce: !0 })
}, hs = g;
var P = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: ee,
  setErrorMap: it,
  getErrorMap: ke,
  makeIssue: we,
  EMPTY_PATH: ot,
  addIssueToContext: u,
  ParseStatus: E,
  INVALID: g,
  DIRTY: Q,
  OK: I,
  isAborted: Pe,
  isDirty: Ze,
  isValid: q,
  isAsync: ie,
  get util() {
    return b;
  },
  get objectUtil() {
    return je;
  },
  ZodParsedType: h,
  getParsedType: M,
  ZodType: _,
  datetimeRegex: qe,
  ZodString: A,
  ZodNumber: U,
  ZodBigInt: z,
  ZodBoolean: oe,
  ZodDate: W,
  ZodSymbol: Ee,
  ZodUndefined: ce,
  ZodNull: de,
  ZodAny: te,
  ZodUnknown: G,
  ZodNever: L,
  ZodVoid: Ie,
  ZodArray: C,
  ZodObject: x,
  ZodUnion: ue,
  ZodDiscriminatedUnion: Ce,
  ZodIntersection: le,
  ZodTuple: j,
  ZodRecord: he,
  ZodMap: Se,
  ZodSet: H,
  ZodFunction: X,
  ZodLazy: fe,
  ZodLiteral: pe,
  ZodEnum: B,
  ZodNativeEnum: me,
  ZodPromise: se,
  ZodEffects: R,
  ZodTransformer: R,
  ZodOptional: N,
  ZodNullable: J,
  ZodDefault: ge,
  ZodCatch: ye,
  ZodNaN: Ae,
  BRAND: Ct,
  ZodBranded: Le,
  ZodPipeline: _e,
  ZodReadonly: ve,
  custom: He,
  Schema: _,
  ZodSchema: _,
  late: Rt,
  get ZodFirstPartyTypeKind() {
    return m;
  },
  coerce: ls,
  any: Lt,
  array: Bt,
  bigint: jt,
  boolean: Ye,
  date: Pt,
  discriminatedUnion: Gt,
  effect: ze,
  enum: ts,
  function: Yt,
  instanceof: Nt,
  intersection: qt,
  lazy: Xt,
  literal: es,
  map: Kt,
  nan: Ot,
  nativeEnum: ss,
  never: Ut,
  null: Dt,
  nullable: ns,
  number: Qe,
  object: Jt,
  oboolean: us,
  onumber: ds,
  optional: as,
  ostring: cs,
  pipeline: os,
  preprocess: is,
  promise: rs,
  record: Ht,
  set: Qt,
  strictObject: Vt,
  string: Ke,
  symbol: Zt,
  transformer: ze,
  tuple: Wt,
  undefined: Mt,
  union: Ft,
  unknown: $t,
  void: zt,
  NEVER: hs,
  ZodIssueCode: c,
  quotelessJson: nt,
  ZodError: S
});
const Be = P.object({
  prompt: P.string().default(""),
  aspect_ratio: P.string().default("1:1"),
  num_outputs: P.number().int().default(1),
  num_inference_steps: P.number().int().gt(0).lt(5).default(4),
  seed: P.number().int().optional().default(() => Math.floor(Math.random() * 1e6)),
  output_format: P.string().default("jpg"),
  disable_safety_checker: P.boolean().default(!1),
  go_fast: P.boolean().default(!1)
});
class fs extends at {
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
      queryParams: Be.parse({}),
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
    const s = this.getEndpoint("text2img"), a = Be.parse({
      ...t,
      prompt: e
      // Always use the text parameter as the prompt
    });
    return this.submitTrackedJob(s, a, this.config.apiKey);
  }
}
class ps {
  constructor(e = {}) {
    y(this, "models");
    y(this, "config");
    this.config = D.getInstance(), D.update(e), this.models = {
      fluxschnell: new fs()
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
class ms extends ps {
  constructor(t = {}) {
    super(t);
    y(this, "requestHandler");
    y(this, "jobManager");
    this.requestHandler = new De(), this.jobManager = xe.getInstance(this.requestHandler);
  }
  /**
   * Set the API key globally
   */
  setApiKey(t) {
    D.update({ apiKey: t });
  }
  /**
   * Set the base URL globally
   */
  setBaseUrl(t) {
    D.update({ baseUrl: t });
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
const ys = new ms();
export {
  ms as SocaitySDK,
  ys as socaity
};
//# sourceMappingURL=socaity.es.js.map
