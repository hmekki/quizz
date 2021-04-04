const mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    name:{
        type : String
    },
    score:{
        type : Number
    },
    date:{
        type : Date
    },
});

mongoose.model('Session',sessionSchema);