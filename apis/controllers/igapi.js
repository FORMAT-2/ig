const { default: mongoose } = require('mongoose');
const {baseUrls} = require('../../base');
const { User } = require('../models/igmodel');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const signup = async (req, res) => {
    const { userName, password, client_id, client_secret } = req.body;
    const userExists = await User.findOne({ userName: userName });
    if (!userName) {
        return res.status(400).json("Please enter username")
    }
    if(!client_id || !client_secret){
        return res.status(400).json("We can't proceed without"+" Client ID/App ID"+ " or"+" Client secret, if you don't know how to create them please visit https://developers.facebook.com/docs/facebook-login/security/#appsecret")
    }
    if (!password) {
        return res.status(400).json("Please enter password")
    }
    if (userExists) {
        return res.status(400).json("User Name is taken, Use another user name");
    }
    const repsonseCode = await axios.get(`${baseUrls.authUrl}?client_id=${client_id}&redirect_uri=${encodeURIComponent(baseUrls.redirectUrl)}&scope=email`);
    console.log(repsonseCode);
    const newUser = new User({
        userName: userName,
        client_id:client_id,
        client_secret:client_secret,
        password: password
    })
    await newUser.save().then(() => {
        res.status(200).json("User created successfully please LOGIN!");
    }).catch(error => {
        console.error('Error creating user:', error);
    });
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
        const authUrl = `${baseUrls.authUrl}?client_id=${userExists.client_id}&redirect_uri=${encodeURIComponent(baseUrls.redirectUrl)}&scope=email`;
        res.status(302).redirect(authUrl)
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error');
    }

}
const oauthcallback = async (req, res) => {
    const { code } = req.query;
    if (!code) {
        res.status(400).json({ error: "code is required" })
    }
    return res.status(200).json(code);
    // try {
    //     const tokenUrl = baseUrls.tokenGen;
    //     const tokenParams = {
    //         client_id: process.env.CLIENT_ID,
    //         redirect_uri: process.env.REDIRECT_URI,
    //         client_secret: process.env.CLIENT_SECRET,
    //         code: code
    //     };
    //     const tokenResponse = await axios.get(tokenUrl, { params: tokenParams });
    //     const { access_token: shortLivedToken } = tokenResponse.data;

    //     const longLivedTokenUrl = baseUrls.longLivedTokenGen;
    //     const longLivedTokenParams = {
    //         grant_type: 'fb_exchange_token',
    //         client_id: process.env.CLIENT_ID,
    //         client_secret: process.env.CLIENT_SECRET,
    //         fb_exchange_token: shortLivedToken
    //     };
    //     const longLivedTokenResponse = await axios.get(longLivedTokenUrl, { params: longLivedTokenParams });
    //     const { access_token: longLivedToken } = longLivedTokenResponse.data;
    //     const user = new User({
    //         shortLivedToken: shortLivedToken,
    //         longLivedToken: longLivedToken
    //     })
    //     await user.save().then(() => {
    //         res.status(200).json({ shortLivedToken, longLivedToken })
    //     }).catch(error => {
    //         console.error('Error saving user:', error);
    //     });
    // } catch (error) {
    //     console.error('Error getting access token:', error.response ? error.response.data : error.message);
    //     res.status(500).send('Error getting access token');
    // }
}
// const fetchUser  = async(req,res)=>{
    // const user = User.findOne({})
    // const response = await axios.get('https://graph.facebook.com/me',{
//             params: {
//                 access_token: 
//         })
//         console.log(response.data);
//     res.status(200).json(response.data);


// }


module.exports = { loginAuth, oauthcallback, signup };