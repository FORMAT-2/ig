const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
   userName: String,
   password:String,
   client_name:String,
   client_unique_id:String,
   client_id:Number,
   client_secret:String,
   appAuthToken:String,
   shortLivedToken:String,
   redirectStateUrl:String,
   longLivedToken:String,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('User', user);

module.exports = {User};
