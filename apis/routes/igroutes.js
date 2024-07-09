const router = require('express').Router();
const {storeUserSession} = require('../../utils/sessionMiddlware');
const {upload} = require('../../utils/multerUpload');
const {loginAuth,oauthcallback,signup,uploadPost} = require('../controllers/igapi');

router.post('/',signup)
// router.get('/get-user',fetchUser)
router.get('/login',loginAuth)
router.get('/login/callback',oauthcallback)
router.post('/upload-post',upload.any(),uploadPost)

module.exports = router;