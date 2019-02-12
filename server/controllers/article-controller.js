const Article = require('../models/article')
class ArticleController {
    static showAll(req, res) {
        Article
            .find({})
            .then((articles) => {
                res.status(200).json(articles)
            })
            .catch((err => {
                console.log(err)
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
                console.log(err)
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
                console.log(err)
                res.status(400).json({err: err})
            })
    }

    static create(req, res) {
        Article
            .create(req.body)
            .then((createdArticle) => {
                res.status(201).json({createdArticle, status: "New Article"})
            })
            .catch((err) => {
                console.log(err)
                res.status(400).json({err: err})
            })
    }

    static delete(req, res) {
        Article
            .findByIdAndDelete(req.params.articleId)
            .then((article) => {
                console.log(article)
                if (!article) {
                    res.send(404).json({status: "Article Not Found"})
                } else {
                    return Article.find({})
                }
            })
            .then((articles) => {
                res.status(200).json({status: "Article Deleted", articles})
            })
            .catch((err) => {
                res.status(401).json({err: err})
            })
    }
}

module.exports = ArticleController