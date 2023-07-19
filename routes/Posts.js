const express = require("express")
const router = express.Router()
const {Posts, Comments} = require("../models")
const {validateToken} = require("../middlewares/AuthMiddleware")

router.get("/", async (req, res) => {
    const posts = await Posts.findAll({     
        order: [
            ["createdAt", "DESC"]
        ]
    })
    let postsJson = JSON.parse(JSON.stringify(posts))
    for (let i = 0; i < postsJson.length; i++) {
      let commentCount = await Comments.count({
        where: { PostId: posts[i].id }
      })
      postsJson[i].commentCount = commentCount
      console.log("Post:")
      console.log(postsJson[i])
    }
    res.json(postsJson)
})

router.post("/", [validateToken], async (req, res) => {
    let post = req.body 
    post = await Posts.create(post) 
    res.json(post)
})

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id
    const post = await Posts.findByPk(id)
    res.json(post)
})

router.delete("/:id", [validateToken], async (req, res) => {
  let { id } = req.params
  const user = await Users.findOne({
    where: {
      username: req.body.username
    }
  })
  const postToDestroy = await Posts.findById(id)
  if (!post) return res.status(404).json({error: "Post not found"})
  if (postToDestroy.UserId !== user.id) return res.status(403).json({error: "Not authorized to delete post"})
  await Posts.destroy({
    where: {
      id: id
    }
  })
  res.sendStatus(200)
})

module.exports = router