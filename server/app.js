require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const ArticleRoute = require('./routes/article')
const cors = require('cors')

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

mongoose
    .connect(process.env.DATABASE, { useCreateIndex: true, useNewUrlParser: true })
    .then(() => {
        console.log("Successfully Connected to Database")
    })
    .catch((err) => {
        console.log(err)
    })

app.use('/articles', ArticleRoute)

app.listen(port, () => {
    console.log(`Now Listening to Port ${port}`)
})

