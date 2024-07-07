const router = require('express').Router();
const {storeUserSession} = require('../../utils/sessionMiddlware');
const {upload,uploadAny} = require('../../utils/multerUpload');
const {loginAuth,oauthcallback,signup,uploadPost} = require('../controllers/igapi');

router.post('/',signup)
// router.get('/get-user',fetchUser)
router.get('/login',loginAuth)
router.get('/login/callback',oauthcallback)
router.post('/upload-post',uploadAny.any(),uploadPost)

module.exports = router;