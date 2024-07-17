const Comment = require("../models/commentModel");

const postComment = async (req, res) => {
  const { username, text, parentId } = req.body;
  const comment = new Comment({ username, text, parentId });

  await comment.save();

  if (parentId) {
    const parentComment = await Comment.findById(parentId);
    parentComment.children.push(comment._id);
    await parentComment.save();
  }

  res.status(201).send(comment);
};

const getComments = async (req, res) => {
  const populateChildren = async (comment) => {
    await comment
      .populate({
        path: "children",
        populate: {
          path: "children",
          model: "Comment",
          populate: {
            path: "children",
            model: "Comment",
          },
        },
      })
      .execPopulate();
  };

  const comments = await Comment.find({ parentId: null }).populate({
    path: "children",
    populate: {
      path: "children",
      model: "Comment",
      populate: {
        path: "children",
        model: "Comment",
      },
    },
  });

  res.status(200).send(comments);
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const comment = await Comment.findByIdAndUpdate(id, { text }, { new: true });
  res.status(200).send(comment);
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  await Comment.findByIdAndDelete(id);
  res.status(204).send();
};

module.exports = {
  postComment,
  getComments,
  updateComment,
  deleteComment,
};
