const express = require('express');
const app = express();
const IgAPI = require('instagram-graph-api');
require('dotenv').config


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3000, () => {
    console.log('connected to port 3000');
})

app.use('/', require('./apis/routes/igroutes'));

// const getToken = async(req,res) =>{
    
// }

// const loginIG = async (req, res) => {
//     try {
//         const { USERNAME, PASSWORD } = process.env
//         const client = new IgAPI({ USERNAME, PASSWORD });
//         await client.login()

//     } catch (error) {
//         console.log(error);
//         res.status(400).json(error.message);
//     }

// }
// app.get('/', loginIG);