const router = require('express').Router()
const ArticleController = require('../controllers/article-controller')
const upload = require('../helpers/upload')
const authenticationAuthor = require('../middlewares/author-authentication')
const verifyUser = require('../middlewares/verify-user')

router.use(verifyUser)

router.get('/', ArticleController.showAll)

router.get('/', ArticleController.findOne)

router.post('/', upload.multer.single('featured_image'), upload.sendUploadToGCS, ArticleController.create)

router.put('/:articleId', authenticationAuthor ,ArticleController.update)

router.delete('/:articleId', authenticationAuthor, ArticleController.delete)

router.get('/:tagName', ArticleController.findArticleByTag)

module.exports = router