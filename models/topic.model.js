import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  topic_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  topic_name: { type: String, required: true },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
});

export default mongoose.model("Topic", topicSchema);
