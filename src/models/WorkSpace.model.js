import mongoose from "mongoose";

const workSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url_image: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    modified_at: {
        type: Date,
        default: null
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    }
})

const Workspace = mongoose.model("Workspace", workSpaceSchema)

export default Workspace    