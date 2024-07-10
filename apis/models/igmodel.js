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
   posts:[{type:Schema.Types.String, ref:'Post'}],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const post = new Schema({
    userId:{type:Schema.Types.ObjectId,ref:'User'},
    isUploaded:{type:Boolean,default:false},
    postdetails:{type:Object},
    createdAt: {
        type: Date,
        default: Date.now
    },
});
const User = mongoose.model('User', user);
const Post = mongoose.model('Post', post);
 
module.exports = {User,Post};
