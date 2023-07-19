const express = require("express")
const router = express.Router()
const {Users} = require("../models")
const bcrypt = require("bcryptjs")
const {sign} = require("jsonwebtoken")
const { validateToken } = require("../middlewares/AuthMiddleware")

// router.get("/", async (req, res) => {
//     const users = await Users.findAll()
//     res.json(users)
// })

// router.get("/:username", async (req, res) => {
//   let { username } = req.params
//   const user = await Users.findOne({     
//       where: {
//         username: username
//       }
//   })
//   res.json(user)
// })

router.post("/", async (req, res) => {
    const { username, password } = req.body
    const existingUser = await Users.findAll({
      where: {
        username: username
      }
    })
    console.log(existingUser)
    if (existingUser.length == 0) {
      bcrypt.hash(password, 10).then(async (hashedPassword) => {
        let user = {
          username: username,
          password: hashedPassword
        }
        user = await Users.create(user)
        res.sendStatus(200)
      })
    } else {
      res.status(400).send("Username already exists")
    }
})

router.post("/login", async (req, res) => {
  const {username, password} = req.body
  const user = await Users.findOne({
    where: {
      username: username
    }
  })
  if (!user) return res.status(400).json({error: "User does not exist"})
  bcrypt.compare(password, user.password).then((matches) => {
    if (!matches) return res.status(400).json({ error: "Username or password is incorrect"})
    const accessToken = sign({username: user.username, id: user.id}, process.env.SECRET)
    res.cookie('token', accessToken, { httpOnly: true })
    res.cookie('loggedin', true)
    res.sendStatus(200)
  })
})

router.post("/logout", [validateToken], async (req, res) => {
  res.clearCookie("token")
  res.clearCookie('loggedin')
  res.status(200).send("Logged out")
})

router.get("/validate", [validateToken], async (req, res) => {
  res.status(200).json(req.user.username)
})

module.exports = router