import Topic from "../../models/subject.model.js";

export const getAllTopics = async (req, res) => {
  const topics = await Topic.find();
  res.json(topics);
};
