const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://quizz:quizz@cluster0.hjqkf.mongodb.net/quizz_db?retryWrites=true&w=majority',
{ useNewUrlParser: true },
(err)=>{
    if(!err){console.log('MongoDb conection succeeded')}
    else console.log('Error ');
});

require('./question.model')
require('./user.model')
require('./session.model')