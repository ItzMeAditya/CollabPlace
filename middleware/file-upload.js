const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3-v2');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    secretKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const MIME_TYPE = {
    'image/png' : 'png',
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg'
};

// Below function was for uploading files to the folder
/*
const fileUpload = multer({
    limits : 500000,
    storage : multer.diskStorage({
        destination : (req,file,cb) => {
            cb(null, './uploads/images');
        },
        filename : (req, file, cb) => {
            const ext = MIME_TYPE[file.mimetype];
            cb(null, uuid() + '.' + ext);
        }
    }),
    fileFilter : (req, file, cb) => {
        const isValid = !!MIME_TYPE[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!');
        cb (error, isValid);
    }
});*/

const fileUpload = multer({
    limits: 500000,
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type !');
        cb(error, isValid);
    },
});



module.exports = fileUpload;