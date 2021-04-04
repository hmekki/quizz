const mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    name:{
        type : String
    },
    gameName:{
        type : String
    }
});

mongoose.model('Question',questionSchema);