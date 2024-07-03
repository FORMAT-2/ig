const axios = require('axios');
const {baseUrls} = require('../base');
const{removeCircularReferences} = require('./circularJsonConvert');

const verifAppId = async(appid)=>{
    const response = await axios.get(baseUrls.authUrl,{
        params:{
            client_id: appid
        }
    })
    const verifyParam = removeCircularReferences(response);
    if( verifyParam.request.path=="/oauth/error/?error_code=PLATFORM__INVALID_APP_ID")
        {
            return false;
        }
        else{
            return true;
        }
}

module.exports = {verifAppId};