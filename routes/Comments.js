const express = require("express")
const router = express.Router()
const {Comments} = require("../models")
const { validateToken } = require("../middlewares/AuthMiddleware")

const getCommentsCreatedAtDesc = async (postId) => {
  return await Comments.findAll({
    where: {
      PostId: postId
    },
    order: [
      ["createdAt", "DESC"]
    ]
  })
}

router.get("/byPost/:postId", async (req, res) => {
  let { postId } = req.params
  const comments = await getCommentsCreatedAtDesc(postId)
  res.json(comments)
})

router.get("/:id", async (req, res) => {
  let { id } = req.params
  const comment = await Comments.findById(id)
  res.json(comment)
})

router.post("/", [validateToken], async (req, res) => {
  let comment = req.body
  await Comments.create(comment)
  const comments = await getCommentsCreatedAtDesc(comment.PostId)
  res.json(comments)
})

router.delete("/:id", [validateToken], async (req, res) => {
  let { id } = req.params
  await Comments.destroy({
    where: {
      id: id
    }
  })
  res.status(200)
})

module.exports = router 