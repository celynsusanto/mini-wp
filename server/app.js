require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')

const app = express()
const port = process.env.PORT

const ArticleRoute = require('./routes/article')
const UserRoute = require('./routes/user')

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

mongoose
    .connect(`${process.env.DATABASE}`, { useCreateIndex: true, useNewUrlParser: true })
    .then(() => {
    })
    .catch((err) => {
    })

app.use('/users', UserRoute)
app.use('/articles', ArticleRoute)

app.listen(port, () => {
    console.log(`Now Listening to Port ${port}`)
})

