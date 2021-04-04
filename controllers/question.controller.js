const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Session = mongoose.model('Session');

const fs = require('fs');
const fetch = require('node-fetch');
const { Console } = require('console');

const url = "https://images.rtl.fr/~r/880v587/rtl/www/1313058-fifa-20-est-disponible-le-27-septembre.png"

function GetFilename(url)
{
   if (url)
   {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1)
      {
         return m[1];
      }
   }
   return "";
}
async function download(req,next) {
    //console.log(req.body.name);

    try {
        var url = GetFilename(req.body.name);
        console.log("url " + url);
        const response = await fetch(req.body.name);
        const buffer = await response.buffer();
       fs.writeFile(`./image/`+url+'.jpg', buffer, () => 
         console.log('finished downloading!'));
    } catch (err) {
        next(err);
    }
    
}

/*router.get('/', (req, res) => {
    res.json('it s work')
});*/

//load first Page 
router.get('/admin/addOrEdit/:username', (req, res) => {
    console.log("req.params.username : " + req.params.username);
    userName = req.params.username;
    res.render("question/addOrEdit", {
        viewTitle: "Insert Game",
        username: userName
    });
});

var index = 0;
var score = 0;
var userName = "";

//load first Page 
router.get('/client/createSessionGame/:username', (req, res) => {    
     score=0;
     index=0;
     userName = req.params.username;
    if(listQuestion === undefined){
        initListQuestion(req, res);
       
    } else {    
        res.render("question/createSessionGame", {
        question: listQuestion[index],
        displayMenu: "display",
        displayDivForm: "display",
        displayDivScore: "none",
        username: userName
    });}

    
});


router.post('/client/checkQuestion', (req, res) => {
   
     console.log("gameName : " + req.body.gameName);
     console.log("reponseUser : " + req.body.reponseUser);

    if(req.body.gameName===req.body.reponseUser){
        score=score+10;
    }

    if(index<9){
        index = index + 1;
        res.render("question/createSessionGame", {
            question: listQuestion[index],
            username: userName,
            displayDivForm: "display",
            displayDivScore: "none",
        });
    } else{
//insert in bd session score
    index = 0;
    insertSession(req,res);
   
    }

    
    console.log("index :  " + index);
   

});

function insertSession(req,res){
     var session = new Session();

console.log("score : "+ score);
    session.name = userName;
    session.score =  score;
    session.date = Date.now() ;

    session.save((err, doc) => {
        if (!err){
            res.render("question/createSessionGame", {
                    scorefinal: session.score,
                    displayDivForm: "none",
                    displayDivScore: "display",
                     username: userName
                });
        }
        else{
                console.log('Error during record insertion : ' + err);
        }
    });
    index = 0 ;
    score = 0 ;
}


//methodePost  isert or update
router.post('/admin/question', (req, res,next) => {
    if (req.body._id == ''){

       download(req,next);
         console.log("imageName 1 "+ req.body.name);
        req.body.name=GetFilename(req.body.name);;
          console.log("imageName 2 "+ req.body.name);
        
        insertRecord(req, res);
}
    else{
        updateRecord(req, res);
    }
        
});



//Methode insert in question collection 
function insertRecord(req, res) {

    var question = new Question();
 
    question.name = req.body.name;
    question.gameName = req.body.gameName;
    
    question.save((err, doc) => {
        if (!err)
           {
            res.redirect('/user/admin/list/'+userName);}  
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("addOrEdit", {
                    viewTitle: "Insert Question",
                    question: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

var listQuestion;


function initListQuestion(req, res) {
console.log("listQuestion  1 : " + listQuestion);


    Question.find((err, docs) => {
       
       
        if (!err) {
            listQuestion = JSON.parse(JSON.stringify(docs));
            console.log("listQuestion 3 : " + listQuestion);

            res.render("question/createSessionGame", {
                question: listQuestion[index],
                displayDivForm: "display",
                displayDivScore: "none",
                displayMenu: "display",

            });

        }
        else {
            console.log('Error in retrieving quesion list :' + err);
        }
    }).lean();

    console.log("listQuestion 2 : " + listQuestion);
    return listQuestion;

}



// show all questions to admin
router.get('/admin/list/:username', (req, res) => {
console.log('/admin/list/:username');
    userName = req.params.username;

    Question.find((err, docs) => {
       
        listQuestion = JSON.parse(JSON.stringify(docs));
       // console.log("listQuestion 1 : " + listQuestion);
        if (!err) {
            res.render("question/list", {
                list: docs,
                username: userName,
            });
        }
        else {
            console.log('Error in retrieving quesion list :' + err);
        }
    }).lean();
});

//get question by id  for editing
router.get('/admin/:id', (req, res) => {
    console.log("aaaaaaaaaaaaa" + req.params.id);
    if(req.params.id!=""){
    Question.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("question/addOrEdit", {
                viewTitle: "Update Game",
                question: doc,
                 username: userName
            });
        }
    }).lean();
} else {
      console.log("req.params.id null " );
}
});

//  delete question by id 
router.get('/admin/delete/:id', (req, res) => {
    Question.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/user/admin/list/'+userName);
        }
        else { console.log('Error in Question delete :' + err); }
    });
});

// methode update 
function updateRecord(req, res) {
    console.log("update game body "+ JSON.stringify(req.body));
    console.log("username :"+userName);

    
    Question.findOneAndUpdate({_id:req.body._id}, req.body,{new : true}, (err, doc) => {
        if (!err) { 
              res.redirect('/user/admin/list/'+userName); }
        else {
            console.log('Error during record update : ' + err);
        }
    });
}

//get top 10 score  res.render('/question/listTopLevelScore', {
              //  listTpoScore: docs
           // });
router.get('/admin/score/topscore', (req, res) => {
 console.log('/admin/score/topscore')
    var mysort = { score: -1 };
    Session.find((err, docs) => {
         if (!err) {
            
              res.render("question/listTopLevelScore", {
                listTpoScore: docs,
                username: userName
            });
        }
        else {
            console.log('Error in retrieving quesion list :' + err);
        }
    }).sort(mysort).limit(10).lean();
});


module.exports = router;