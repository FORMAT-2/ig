const baseUrls = {
    tokenGen :`https://graph.facebook.com/v12.0/oauth/access_token`,
    longLivedTokenGen:`https://graph.facebook.com/v12.0/oauth/access_token`,
    authUrl:'https://www.facebook.com/v12.0/dialog/oauth',
    redirectUrl:'http://localhost:3000/login/callback',
    loginUrl:'https://graph.facebook.com/me'
}

module.exports= {baseUrls};