'use strict';
const express = require('express');
const router = express.Router();
var Question = require("./models").Question;

router.param("qID", (req, res, next, id) => {
  Question.findById(id, (err, doc) => {
    if (err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    return next();
  });
});

router.param("aID", (req,res,next, id) => {
  req.answer = req.question.answers.id(id);
  if(!req.answer){
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();

})
//GET /questions
// Route for questionns collection
router.get("/", (req, res, next) => {
  Question.find({})
        .sort({createdAt: -1})
        .exec(function (err, questions) {
            if (err)  return next(err);
            res.json(questions);
        });
  });

//POST /questions
// Route for creating question
router.post("/", (req,res, next) => {
  var question = new Question(req.body);
  question.save((err, question) => {
      if(err) return next(err);
      res.status(201);
      res.json(question);
  });
});

//GET /questions/:id
//Route for specific quesiton
router.get("/:qID", (req,res, next) => {
      res.json(req.question);
});


//Post /questions/:id/answers
//route for creating an answer

router.post("/:qID/answers", (req,res) => {
  req.question.answers.push(req.body);
  req.question.save((err, question) => {
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});

//PUT /questions/:qID/answer/:aID
//route for editing an answer
router.put("/:qID/answers/:aID", (req,res) => {
  req.answer.update(req.body, (err, result) => {
    if(err) return next(err);
    res.json(result);
  });
});

//DELETE /questions/:qID/answer/:aID
//route for deleting an answer
router.delete("/:qID/answers/:aID", (req,res) => {
  req.answer.remove((err) => {
    req.question.save((err, question) => {
      if(err) return next(err);
      res.json(question);
    });
  });
});


//POST /questions/:qID/answer/:aID/vote-up
//POST /questions/:qID/answer/:aID/vote-down
//vote on a specific an answer
router.post("/:qID/answers/:aID/vote-:dir",(req,res,next) => {
      if (req.params.dir.search(/^(up|down)$/) === -1) {
        var err = new Error("Not Found");
        err.status = 404;
        next(err);
      } else {
        req.vote = req.params.dir;
        next();
      }
    },
    (req,res, next) => {
      req.answer.vote(req.vote, (err, question) => {
        if(err) return next(err);
        res.json(question);
      });
});



module.exports = router;
