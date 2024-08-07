const multer = require('multer');
const fs = require('fs-extra')
const { baseUrls, allowedMimeTypes, maxImageSize, maxVideoSize, uploadAllowedTypes, allowedImageTypes, allowedVideoTypes } = require('../base');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
})
const uploadDest = './uploads'
const upload = multer({ dest: './uploads' });
multer({ dest: uploadDest })

const uploadFileLocal = (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err) return res.status(400).json(err.message);
        if (!fs.existsSync(uploadDest)) {
            fs.mkdirSync(uploadDest);
        }
        const files = req.files
        const errors = [];
        let CurrentDate = new Date().toISOString();
        files.forEach((file, index) => {
            const uploadDate = req.body[`uploadDate_${index}`];
            const uploadType = req.body[`uploadType_${index}`];
            const uploadCaption = req.body[`uploadCaption_${index}`];
            if (!uploadDate) {
                errors.push("Upload date is required " + `${file.originalname}`)

            }
            if (!uploadType) {
                errors.push("Upload type is required " + `${file.originalname}`)

            }
            if (!uploadCaption) {
                errors.push("Upload caption is required " + `${file.originalname}`)

            }
            if (!uploadAllowedTypes.includes(uploadType)) {
                errors.push("Upload Type Not Allowed " + `${file.originalname}`)
            }
            if (allowedImageTypes.includes(file.mimetype)) {
                if (file.size > maxImageSize) {
                    errors.push("Uploaded image file size is too large " + `${file.originalname}`)
                }
            }
            else if (allowedVideoTypes.includes(file.mimetype)) {
                if (file.size > maxVideoSize) {
                    errors.push("Uploaded video file size is too large " + `${file.originalname}`)
                }
            }
            else {
                errors.push("Uploaded file extension is not allowed " + `${file.originalname}`)
            }
            if (errors.length > 0) {
                files.forEach((file) => {
                    fs.unlinkSync(file.path);
                    return res.status(400).json({err:errors})
                })
            }
            file.uploadDate = uploadDate;
            file.uploadType = uploadType;
            file.uploadCaption = uploadCaption;
        });
        next();
    });
};

module.exports = { uploadFileLocal };