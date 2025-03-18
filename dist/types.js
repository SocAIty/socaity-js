/**
 * Represents the status of a job
 */
export var JobStatus;
(function (JobStatus) {
    JobStatus["CREATED"] = "CREATED";
    JobStatus["QUEUED"] = "QUEUED";
    JobStatus["PROCESSING"] = "PROCESSING";
    JobStatus["COMPLETED"] = "COMPLETED";
    JobStatus["FAILED"] = "FAILED";
})(JobStatus || (JobStatus = {}));
/**
 * Internal job tracking status
 */
export var ProcessingPhase;
(function (ProcessingPhase) {
    ProcessingPhase["INITIALIZING"] = "INITIALIZING";
    ProcessingPhase["PREPARING"] = "PREPARING";
    ProcessingPhase["SENDING"] = "SENDING";
    ProcessingPhase["TRACKING"] = "TRACKING";
    ProcessingPhase["PROCESSING_RESULT"] = "PROCESSING_RESULT";
    ProcessingPhase["COMPLETED"] = "COMPLETED";
    ProcessingPhase["FAILED"] = "FAILED";
})(ProcessingPhase || (ProcessingPhase = {}));
//# sourceMappingURL=types.js.map