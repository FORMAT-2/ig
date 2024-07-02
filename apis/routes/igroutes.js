const router = require('express').Router();
const {fetchUser,getToken,auth,oauthcallback} = require('../controllers/igapi');

router.get('/get-user',fetchUser)
router.get('/get-token',getToken)
router.get('/auth',auth)
router.get('/auth/callback',oauthcallback)

module.exports = router;