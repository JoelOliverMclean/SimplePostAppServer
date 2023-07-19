const express = require("express")
const router = express.Router()
const {Likes} = require("../models")
const { validateToken } = require("../middlewares/AuthMiddleware")

router.post("/", [validateToken], async (req, res) => {
  let like = req.body
  if (!like.PostId && !like.CommentId)
    return res.status(400).json({error: "Cannot like nothing"})
  if (!like.UserId)
    return res.status(401).json({error: "Must be logged in to like"})
  like = await Likes.create(like)
  res.status(200).json(like)
})

module.exports = router 