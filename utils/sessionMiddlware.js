const crypto = require('crypto');

const sessionStore = {};

function generateSessionId() {
    return 'SESSION_ID_' + Math.random().toString(36).substr(2, 9);
}
const storeUserSession = async(req,res,next) =>{
    const sessionId = generateSessionId();
    const request = req.body;
    if(!req){
        return "Invalid User";
    }
    console.log(request);
    sessionStore[sessionId] = req.body.userName;
    req.sessionId = sessionId;
    console.log(sessionStore);
    next();
}
const generateState = async()=>{
    return crypto.randomBytes(16).toString('hex');
}
module.exports = {storeUserSession,generateState};