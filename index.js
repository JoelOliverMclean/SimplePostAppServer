require('dotenv').config()
const express = require('express')
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { expressjwt: jwt } = require("express-jwt")
const csrf = require("csurf")

const path = __dirname + '/views/'

const db = require("./models")

app.use(express.static(path))
app.use(cors())

app.use(express.json())
app.use(cookieParser())
const csrfProtection = csrf({
    cookie: true
})
app.use(csrfProtection)
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.get('/', (req, res) => {
    res.sendFile(path + "index.html")
})

//Routers
const postRouter = require('./routes/Posts')
app.use("/posts", postRouter)
const commentsRouter = require('./routes/Comments')
app.use("/comments", commentsRouter)
const usersRouter = require('./routes/Users')
app.use("/auth", usersRouter)
const likesRouter = require('./routes/Likes')
app.use("/likes", likesRouter)

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)
    })
})

