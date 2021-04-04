const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Session = mongoose.model('Session');


router.get('/signup', (req, res) => {
    res.render("users/signup", {
        viewTitle: "Signup",
        displayMenu: "none"
    });
});

router.get('/', (req, res) => {
    res.render("users/login", {
        viewTitle: "Login",
        displayMenu: "none"
    });
});

router.post('/insert', (req, res) => {
       insertRecord(req, res);
});

//Methode insert in quesion collection 
function insertRecord(req, res) {

    var user = new User();
 
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.role = 'admin';
    score=0;
    
    user.save((err, doc) => {
        if (!err){
           res.redirect('/user/admin/list/'+doc.name);  
          
    }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}



router.post('/loginuser', (req, res) => {

    if( req.body.email === '' ||req.body.password==='' ){
                res.render("users/login", {
                   viewTitle: "Login",
                erreurlogin: "login and passeword are required ",
                displayMenu: "none"
             });
    } else{
    User.findOne({ email: req.body.email},{}, { new: true }, (err, userDoc) => {
        console.log(userDoc);
        if (!err) {
            if(req.body.password ==userDoc.password && req.body.email == userDoc.email){
               if(userDoc.role == 'client'){
                  res.redirect('user/client/createSessionGame/'+userDoc.name);
                  
               }
               else{
                res.redirect('user/admin/list/'+userDoc.name);  
              }
            }
            else 
              res.render("users/login", {
                viewTitle: "Login",
             });
          }
        else {
            console.log('Error during record update : ' + err);
        }
    });
    }
});


module.exports = router;