const express = require("express");
const {
  postComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controller/commentController");

const router = express.Router();

router.post("/", postComment);
router.get("/", getComments);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
