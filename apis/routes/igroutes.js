const router = require('express').Router();
const {fetchUser,getToken} = require('../controllers/igapi');

router.get('/get-user',fetchUser)
router.get('/get-token',getToken)

module.exports = router;