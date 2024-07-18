const Comment = require("../models/commentModel");

const postComment = async (req, res) => {
  try {
    const { username, text, parentId } = req.body;
    const comment = new Comment({ username, text, parentId });

    await comment.save();

    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).send({ message: "Parent comment not found" });
      }
      parentComment.children.push(comment._id);
      await parentComment.save();
    }

    res.status(201).send(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getComments = async (req, res) => {
  try {
    const populateChildren = async (comment) => {
      await comment.populate("children");
      if (comment.children.length > 0) {
        for (let child of comment.children) {
          await populateChildren(child);
        }
      }
    };

    const populateAllChildren = async (comments) => {
      for (let comment of comments) {
        await populateChildren(comment);
      }
    };

    const getCommentsWithAllChildren = async () => {
      let comments = await Comment.find({ parentId: null }).exec();
      await populateAllChildren(comments);
      return comments;
    };

    const comments = await getCommentsWithAllChildren();

    res.status(200).send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }
    res.status(200).send(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  postComment,
  getComments,
  updateComment,
  deleteComment,
};
