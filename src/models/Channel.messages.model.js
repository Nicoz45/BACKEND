import mongoose from "mongoose";

const channelMessagesSchema = new mongoose.Schema({
    channels_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channels",
        required: true
    },
    sender_member_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkspaceMembers",
        required: true,
    },
    content:{
        type: String,
    },
    created_at:{
        type: Date,
        default: Date.now
    }
})

const ChannelMessages = mongoose.model("ChannelMessages", channelMessagesSchema)

export default ChannelMessages