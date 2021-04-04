const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name:{
        type : String
    },
    email:{
        type : String
    },
    password:{
        type : String
    },
    score:{
        type : Number
    },
    role:{
        type : String
    }
});

mongoose.model('User',userSchema);