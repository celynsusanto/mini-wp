const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.ObjectId

const TagSchema = new Schema({
    name: String,
    articles: [{type: ObjectId, ref: "Article"}]
})

const Tag = mongoose.model("Tag", TagSchema)

module.exports = Tag