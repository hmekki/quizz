const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Session = mongoose.model('Session');


router.post('/score', (req, res) => {
   
    var session = new Session();

    session.name = req.body.name;
   
    session.score =  8;
    session.date = Date.now() ;



    session.save((err, doc) => {
        if (!err)
            res.redirect('list'); 
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("quiz/session", {
                    Note: session.score,
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
});


router.get('/allscore', (req, res) => {
    var mysort = { score: 1 };
    Session.find((err, docs) => {
         if (!err) {
            res.render("quiz/session", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving quesion list :' + err);
        }
    }).sort(mysort).limit(3).lean();
});

router.get('/addsession', (req, res) => {
    res.render("quiz/session", {
        viewTitle: "Add session"
    });
});

module.exports = router;
