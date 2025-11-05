import mongoose from "mongoose";

const workspaceMembersSchema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    id_workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    role: {
        type: String,
        default: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const WorkspaceMembers = mongoose.model("WorkspaceMembers", workspaceMembersSchema)

export default WorkspaceMembers