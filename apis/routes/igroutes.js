const router = require('express').Router();
const {loginAuth,oauthcallback,signup} = require('../controllers/igapi');

router.post('/',signup)
// router.get('/get-user',fetchUser)
router.get('/login',loginAuth)
router.get('/login/callback',oauthcallback)

module.exports = router;