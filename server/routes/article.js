const router = require('express').Router()
const ArticleController = require('../controllers/article-controller')

router.get('/', ArticleController.showAll)

router.get('/', ArticleController.findOne)

router.post('/', ArticleController.create)

router.put('/:articleId', ArticleController.update)

router.delete('/:articleId', ArticleController.delete)

module.exports = router