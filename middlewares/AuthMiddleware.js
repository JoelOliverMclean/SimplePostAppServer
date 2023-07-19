const { verify } = require("jsonwebtoken")
const { Users } = require("../models")

const validateToken = async (req, res, next) => {
  const accessToken = req.cookies.token ?? req.header("accessToken")
  
  if (!accessToken)
    return res.status(401).json({error: "User not logged in!"})
  
  try {
    const validToken = verify(accessToken, process.env.SECRET)
    if (validToken) {
      const user = await Users.findOne({ where: {username: validToken.username}})
      req.user = user
      req.body.username = user.username
      req.body.UserId = user.id
      return next()
    }
  } catch (err) {
    return res.status(400).json({error: err})
  }
}

module.exports = {validateToken}