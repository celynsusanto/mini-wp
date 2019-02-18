// Imports the Google Cloud client library.
require('dotenv').config()

const {Storage} = require('@google-cloud/storage');
const CLOUD_BUCKET = process.env.CLOUD_BUCKET
// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.KEYFILE_PATH
});

// Makes an authenticated API request.
const bucket = storage.bucket(CLOUD_BUCKET)
const getPublicUrl = (filename) => {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`
}

const sendUploadToGCS = (req, res, next) => {

    if (!req.file) {
      return next()
    }

    req.file.originalname = req.file.originalname.replace(/\s/g,'')
        const gcsname = Date.now() + req.file.originalname
        const file = bucket.file(gcsname)
        const stream = file.createWriteStream({
            metadata: {
            contentType: req.file.mimetype
            }
    })

    stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
    })

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname
        file.makePublic().then(() => {
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
        next()
        })
    })

    stream.end(req.file.buffer)
}

const Multer = require('multer'),
      multer = Multer({
        storage: Multer.MemoryStorage,
      })

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  multer
}