const { default: mongoose } = require('mongoose');
const { baseUrls } = require('../../base');
const { generateState } = require('../../utils/sessionMiddlware');
const { createJwtToken, verifyJwtToken } = require('../../utils/jwtAuth');
const { verifAppId } = require('../../utils/verifyAppId');
const { User,Post } = require('../models/igmodel');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const signup = async (req, res) => {
    const { userName, password, client_id, client_secret } = req.body;
    const userExists = await User.findOne({ userName: userName });
    const validateAppID = await verifAppId(client_id)
    if (!userName) {
        return res.status(400).json("Please enter username")
    }
    if (!client_id || !client_secret) {
        return res.status(400).json("We can't proceed without" + " Client ID/App ID" + " or" + " Client secret, if you don't know how to create them please visit https://developers.facebook.com/docs/facebook-login/security/#appsecret")
    }
    if (!password) {
        return res.status(400).json("Please enter password")
    }
    if (userExists) {
        return res.status(400).json("User Name is taken, Use another user name");
    }
    if (!validateAppID) {
        return res.status(400).json("Invalid App ID");
    }
    const newUser = new User({
        userName: userName,
        client_id: client_id,
        client_secret: client_secret,
        password: password,
    });
    await newUser.save();
    res.status(200).json("User Created! Please Login");
    // const repsonseCode = await axios.get(`${baseUrls.authUrl}?client_id=${client_id}&redirect_uri=${encodeURIComponent(baseUrls.redirectUrl)}&scope=email`);
    // console.log(repsonseCode);
}
const loginAuth = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName) {
            return res.status(400).json("Please enter username")
        }
        if (!password) {
            return res.status(400).json("Please enter password")
        }
        const userExists = await User.findOne({ userName: userName })
        if (!userExists) {
            return res.status(400).json("User doesn't exist please signup");
        }
        if (userExists.password != password) {
            return res.status(400).json("Incorrect Password");
        }
        const appAuthToken = await createJwtToken({ userName });
        await userExists.updateOne({ appAuthToken: appAuthToken });
        const authUrl = `${baseUrls.authUrl}?client_id=${userExists.client_id}&redirect_uri=${encodeURIComponent(baseUrls.redirectUrl)}&scope=email,public_profile&state=${userExists.userName}`;
        console.log(userExists);
        res.status(302).redirect(authUrl)
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error');
    }
}
const oauthcallback = async (req, res) => {
    const queryData = req.query;
    const code = queryData.code;
    if (!code) {
        res.status(400).json({ error: "code is required" });
    }
    try {
        const userData = await User.findOne({ userName: queryData.state });
        console.log(userData);
        if (!userData) {
            return res.status(400).json("User doesn't exists");
        }
        const tokenUrl = baseUrls.tokenGen;
        const tokenParams = {
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            client_secret: process.env.CLIENT_SECRET,
            code: code
        };
        const tokenResponse = await axios.get(tokenUrl, { params: tokenParams });
        const { access_token: shortLivedToken } = tokenResponse.data;

        const longLivedTokenUrl = baseUrls.longLivedTokenGen;
        const longLivedTokenParams = {
            grant_type: 'fb_exchange_token',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            fb_exchange_token: shortLivedToken
        };
        const longLivedTokenResponse = await axios.get(longLivedTokenUrl, { params: longLivedTokenParams });
        const { access_token: longLivedToken } = longLivedTokenResponse.data;
        const fbUserData = await axios.get('https://graph.facebook.com/me', {
            params: {
                access_token: longLivedToken
            }
        })
        await userData.updateOne({
            shortLivedToken: shortLivedToken,
            longLivedToken: longLivedToken,
            client_name:fbUserData.data.name,
            client_unique_id:fbUserData.data.id
        })
        res.status(200).json({
            shortLivedToken: shortLivedToken,
            longLivedToken: longLivedToken,
            appAuthToken: userData.appAuthToken,
            userName:userData.userName,
            client_name:fbUserData.data.name,
            client_unique_id:fbUserData.data.id
        })
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        res.status(500).send('Error getting access token');
    }
}
const uploadPost = async(req,res)=>{
    const files = req.files;
    if(!files){
        return res.status(400).json("Please upload files");
    }
    console.log(req.files);
    await Post. 


    
}


module.exports = { loginAuth, oauthcallback, signup, uploadPost};