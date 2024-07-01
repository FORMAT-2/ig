const axios = require('axios');
const graphApi = "https://graph.instagram.com";

const baseInstance = axios.create({
    baseUrl:"https://graph.instagram.com",
    timeout: 5000
});

module.exports= {baseInstance};