const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/quiz_db',
{ useNewUrlParser: true },
(err)=>{
    if(!err){console.log('MongoDb conection succeeded')}
    else console.log('Error ');
});

require('./question.model')
require('./user.model')
require('./session.model')