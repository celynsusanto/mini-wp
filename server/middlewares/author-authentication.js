const Article = require('../models/article')

function authorAuthentication(req, res, next) {
    let userId = req.app.locals.userId
    Article
        .findOne({_id: req.params.articleId})
        .then((article) => {

            if (article.author.toString() === userId.toString()) {
                next()
            } else {
                res.status(401).json({status: "Only author is allowed to make changes with this article"})
            }
        })
        .catch((err) => {
            res.status(500).json({status: "Internal Server Error"})
        })

    
}

module.exports = authorAuthentication