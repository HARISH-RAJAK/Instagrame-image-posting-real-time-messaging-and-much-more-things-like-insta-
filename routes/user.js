const mongoose = require('mongoose');
const express = require('express');
const plm = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://rajakharish027:ojWDSRqlhqbcxjVo@cluster0.ffmenhr.mongodb.net/',{
  "dbname":"namaste"
}).then(() => {
  console.log("connected to database")
}).catch((err) => {
  console.log("error in connecting to database", err)
});
const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    profileImage:{
        type: String
    },
    bio: String,
    hobby: String,
    posts:[{type: mongoose.Schema.Types.ObjectId, ref: 'post'}]
});
userSchema.plugin(plm);
module.exports = mongoose.model('user', userSchema);