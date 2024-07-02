const {baseInstance} = require('../../base')
require('dotenv').config({path:'.env.local'});
const axios = require('axios');

const auth = async(req, res, next) => {
    const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=email`;
    res.redirect(authUrl);
}
const oauthcallback = async(req,res)=>{
    const {code} = req.query;
    if(!code){
        res.status(400).json({error:"code is required"})
    }
    try {
         const tokenUrl = `https://graph.facebook.com/v12.0/oauth/access_token`;
         const tokenParams = {
             client_id: process.env.CLIENT_ID,
             redirect_uri: process.env.REDIRECT_URI,
             client_secret: process.env.CLIENT_SECRET,
             code: code
         };
 
         const tokenResponse = await axios.get(tokenUrl, { params: tokenParams });
         const { access_token: shortLivedToken } = tokenResponse.data;
 
         const longLivedTokenUrl = `https://graph.facebook.com/v12.0/oauth/access_token`;
         const longLivedTokenParams = {
             grant_type: 'fb_exchange_token',
             client_id: process.env.CLIENT_ID,
             client_secret: process.env.CLIENT_SECRET,
             fb_exchange_token: shortLivedToken
         };
 
         const longLivedTokenResponse = await axios.get(longLivedTokenUrl, { params: longLivedTokenParams });
         const { access_token: longLivedToken } = longLivedTokenResponse.data;
 
         res.json({ shortLivedToken, longLivedToken });
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        res.status(500).send('Error getting access token');
    }
}
const getToken = async(req,res)=>{
    const response = await axios.get("https://graph.facebook.com",{
        params:{
            client_id:447452908193993,
            client_secret:"5c5dcb65a02a81cebbae51c215e206be",
            grant_type:"client_credentials"
        }
    })

    res.status(200).json(response.data);
}
const fetchUser  = async(req,res)=>{
    const response = await axios.get('https://graph.facebook.com/me',{
            params: {
                access_token: 'EAAGW9LZBliMkBOzwOipl5IAVgE3iTnpDINUvVM05bKZCRwMuihXk7E5B1VZBA70l9kKsT0awmJR3tEATYAJJpOzWSYiuZBl54NBSKElSjEHyL6VJbZACjiyxZCWnKXyAofVRhA7lhDQmWgq2PDvZCC9jrrbiEkj0fJy0lKWg7ZCYHDrkEkZCdv5ZAJ5QGtKTVoOPH2P23Fcc8w4kxTgzqilapY7eGgoFAI6FVWQGroTh44nOUs2A4PkX6AeaxlrA3o2IxutmkMmwZDZD'
            }
        })
        console.log(response.data);
    res.status(200).json(response.data);


}
    

module.exports= {fetchUser,getToken,auth,oauthcallback};