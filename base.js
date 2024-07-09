const baseUrls = {
    tokenGen :`https://graph.facebook.com/v12.0/oauth/access_token`,
    longLivedTokenGen:`https://graph.facebook.com/v12.0/oauth/access_token`,
    authUrl:'https://www.facebook.com/v12.0/dialog/oauth',
    redirectUrl:'http://localhost:3000/login/callback',
    loginUrl:'https://graph.facebook.com/me'
}

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/png','image/bmp','image/heic','image/heif'];
const allowedVideoTypes = ['video/mp4', 'video/quicktime'];
const allowedMimeTypes = [...allowedImageTypes, ...allowedVideoTypes];
const uploadAllowedTypes = ['uploadType_post', 'uploadType_reel', 'uploadType_story']; 
const maxImageSize = 30 * 1024 * 1024;
const maxVideoSize = 600 * 1024 * 1024;

module.exports= {baseUrls,allowedMimeTypes,maxImageSize,maxVideoSize,uploadAllowedTypes,allowedImageTypes,allowedVideoTypes};