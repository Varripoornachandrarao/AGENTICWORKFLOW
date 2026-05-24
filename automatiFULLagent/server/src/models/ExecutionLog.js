import mongoose from "mongoose";

const executionLogSchema = new mongoose.Schema(
  {
    execution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Execution",
      required: true,
      index: true
    },
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
      required: true,
      index: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    nodeId: String,
    agent: {
      type: String,
      enum: ["planner", "execution", "validation", "recovery", "monitoring"],
      required: true
    },
    level: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      default: "info"
    },
    eventType: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

executionLogSchema.index({ execution: 1, createdAt: 1 });

executionLogSchema.methods.toClientObject = function toClientObject() {
  return {
    id: this._id.toString(),
    execution: this.execution.toString(),
    workflow: this.workflow.toString(),
    owner: this.owner.toString(),
    nodeId: this.nodeId,
    agent: this.agent,
    level: this.level,
    eventType: this.eventType,
    message: this.message,
    metadata: this.metadata,
    createdAt: this.createdAt
  };
};

export const ExecutionLog = mongoose.model("ExecutionLog", executionLogSchema);
