import mongoose from "mongoose";

const channelsSchema = new mongoose.Schema({
    id_workspaces: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkSpace",
        required: true
    },
    name:{
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        default: false,
        required: true
    },
    active:{
        type: Boolean,
        default: true,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now,
        required: true
    },
    modified_at:{
        type: Date,
        default: null
    }
})

const Channels = mongoose.model("Channels", channelsSchema)

export default Channels