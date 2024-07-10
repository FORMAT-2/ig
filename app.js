const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config({path:'.env.local'});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.set('debug',true);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('connected to mongo');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});
app.listen(3000, () => {
    console.log('connected to port 3000');
});
app.use('/', require('./apis/routes/igroutes'));
