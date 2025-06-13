const mongoose = require('mongoose');
const express = require('express');

mongoose.connect('mongodb+srv://rajakharish027:ojWDSRqlhqbcxjVo@cluster0.ffmenhr.mongodb.net/',{
  "dbname":"namaste"
}).then(() => {
  console.log("connected to database")
}).catch((err) => {
  console.log("error in connecting to database", err)
});

const postSchema = new mongoose.Schema({
    picture: String,
    title: String,
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    date: {
        type : Date,
        default : Date.now,
    },
    likes: [
      {  type : mongoose.Schema.Types.ObjectId,
        ref : "user",
      }
    ],
});

module.exports = mongoose.model('post', postSchema);