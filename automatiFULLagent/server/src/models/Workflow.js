import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "archived"],
      default: "draft",
      index: true
    },
    trigger: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    nodes: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    edges: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    version: {
      type: Number,
      default: 1,
      min: 1
    },
    tags: {
      type: [String],
      default: []
    },
    lastExecutionAt: {
      type: Date
    }
  },
  { timestamps: true }
);

workflowSchema.index({ owner: 1, updatedAt: -1 });
workflowSchema.index({ owner: 1, name: "text", description: "text", tags: "text" });

workflowSchema.methods.toClientObject = function toClientObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    owner: this.owner.toString(),
    status: this.status,
    trigger: this.trigger,
    nodes: this.nodes,
    edges: this.edges,
    version: this.version,
    tags: this.tags,
    lastExecutionAt: this.lastExecutionAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Workflow = mongoose.model("Workflow", workflowSchema);
