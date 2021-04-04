require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

const userController = require('./controllers/user.controller');
const questionController = require('./controllers/question.controller');
const sessionController = require('./controllers/session.controller');


var app = express();

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');



const PORT = process.env.PORT || 5000 // # Fall back to port 5000 if process.env.PORT is not set

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

//app.listen(5000,() => {
  // console.log('Express server started at port 3000'); 
//})


app.use('/user', questionController);
app.use('/',userController);
app.use('/session', sessionController);
app.use(express.static(__dirname+'/image'));
