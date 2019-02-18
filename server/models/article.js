const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.ObjectId

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {type: ObjectId, ref: "User"},
    featured_image: String,
    tags:[String],
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Article = mongoose.model('Article', ArticleSchema)

module.exports = Article