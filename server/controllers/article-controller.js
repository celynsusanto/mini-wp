const Article = require('../models/article')
const Tag  = require('../models/tag')
const mongoose = require('mongoose')
const ObjectId = mongoose.ObjectId

class ArticleController {
    static showAll(req, res) {
        Article
            .find({})
            .sort({created_at:-1})
            .populate('author')
            .then((articles) => {
                res.status(200).json(articles)
            })
            .catch((err => {
                res.status(500).json({status: "Internal Server Error"})
            }))
    }

    static findOne(req, res) {
        Article
            .findOne({title: req.body.title})
            .then((article) => {
                if (!article) {
                    res.status(404).json({status: "Article Not Found"})
                } else {
                    res.status(200).json(article)
                }
            })
            .catch((err) => {
                res.status(404).json({status: "Article Not Found"})
            })
    }

    static update(req, res) {
        Article
            .findByIdAndUpdate({_id: req.params.articleId}, req.body, {new: true})
            .then((updatedArticle) => {
                if (!updatedArticle) {
                    res.status(404).json({status: "Article Not Found"})
                } else {
                    res.status(200).json({article: updatedArticle, status: "Article Updated"})
                }
            })
            .catch((err) => {
                res.status(400).json({err: err})
            })
    }


    static create(req, res) {
        let newArticle = {}
        let imageUrl = ""
        if(req.file){
            imageUrl = req.file.cloudStoragePublicUrl
        }
        let tags = req.body.tags.split(',')
        Article
            .create({
                title: req.body.title, 
                content: req.body.content, 
                featured_image: imageUrl, 
                author: req.app.locals.userId,
                tags: tags

            })
            .then((createdArticle) => {
                return createdArticle.populate('author').execPopulate()
            })
            .then((createdArticle) => {
                newArticle =  createdArticle
                if (tags) {
                    let tagAdd = tags.forEach((tag) => {
                        return new Promise((resolve, reject) => {
                            Tag
                            .findOne({name: tag})
                            .then((tagFound) => {
                                if (!tagFound) {
                                    Tag.create({name: tag, articles: [createdArticle._id]})
                                        .then((article) => {
                                            resolve(article)
                                        })
                                        .catch((err) => {
                                            reject(err)
                                        })
                                } else {
                                    Tag.updateOne({_id: tagFound._id}, {$push:{articles: createdArticle._id}}, {new:true })
                                        .then((article) => {
                                            resolve(article)
                                        })
                                        .catch((err) => {
                                            reject(err)
                                        })
                                }
                            })
                            .catch((err) => {
                                reject(err)
                            })
                        }) 
                        
                    })

                    return tagAdd
                } else {
                    res.status(201).json({newArticle, status: "New Article"})
                } 
            })
            .then(() => {
                res.status(201).json({newArticle, status: "New Article"})

            })
            .catch((err) => {
                res.status(400).json({err: err})
            })
    }

    static findArticleByTag(req, res) {
        Tag
            .findOne({name: req.params.tagName})
            .populate('articles')
            .then((tag) => {
                res.status(200).json(tag.articles)
            })
            .catch((err) => {
                res.status(500).json({status: "Internal Server Error"})
            })
    }

    static delete(req, res) {
        Article
            .findByIdAndDelete(req.params.articleId)
            .then((article) => {
                if (!article) {
                    res.send(404).json({status: "Article Not Found"})
                } else {
                    res.status(200).json({status: "Article Deleted"})
                }
            })
            .catch((err) => {
                res.status(401).json({err: err})
            })
    }
}

module.exports = ArticleController