const express = require('express')
const app = express()
var fs = require('fs')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var mongoose = require('mongoose')
var cors = require('cors')
const Topic = require('./topicSchema')
const Login = require('./loginSchema')
const TopicData = require('./topicDataSchema')

const uri = "mongodb+srv://dbUser:dbPassword@cluster0-9gekk.mongodb.net/forummgmt?retryWrites=true&w=majority"

//
mongoose.connect(uri, { useNewUrlParser: true })
          .then((client) => console.log("Connection successful"))
          .catch(err => console.log("Error connection: ", err))
//
app.post('/authenticate', cors(), jsonParser, (req,res) => {
  // console.log('Received GET request: ')
  // console.log(req.body.body)
  const query = { id : req.body.body.id, password : req.body.body.password }
  Login.findOne(query)
      .exec()
      .then(docs => {
        let authenticated = false
        if (docs.length !== 0) {
          authenticated = true
        }
        console.log('@Authenticate-docs')
        return res.send(authenticated)
      })
      .catch(err => { error: true })
})
//
app.get('/topics', cors(), (req,res) => {
  // console.log('Received GET request: ')
  // console.log(req.query.subject)
  const query = { subject : req.query.subject }
  Topic.find(query)
      .exec()
      .then(docs => {
        return res.send(docs)
      })
      .catch(err => {
        return { error: true }
      })
})
//
app.get('/topicdata', cors(), (req,res) => {
  // console.log('Received GET request: ')
  // console.log(req.query.subject)
  // console.log(req.query.topicId)
  const query = { subject : req.query.subject,  topic_id : req.query.topicId }
  // const query = { topic_id: req.query.topicId }
  // const query = { $and:[{'topic_id': req.query.topicId},{'subject': req.query.subject}] }
  TopicData.find(query)
          .exec()
          .then(docs => {
            return res.send(docs)
          })
          .catch(err => {
            return { error: true }
          })
})
//
app.post('/register', cors(), jsonParser, (req,res) => {
  // console.log('@register')
  // console.log(req.body.body)
  const query = { id : req.body.body.id }
  const login = new Login({ id : req.body.body.id,  password : req.body.body.password })
  Login.findOne(query)
      .exec()
      .then(docs => {
          // console.log(docs)
          // console.log(docs === null)
          if (docs === null) {
            login.save()
            return res.send({ inserted: true })
          }
          return res.send({ inserted: false })
        }
      )
      .catch(err => {
        return res.send({ inserted: true })
      })
})
//
app.post('/addcomment', cors(), jsonParser, (req,res) => {
  // console.log('Received PUT request: ')
  // console.log(req.query.subject)
  // console.log(req.query.topicId)
  // console.log(req.body.body)
  const query = { topic_id: req.query.topicId, subject : req.query.subject }
  // let topicComment = { $set: { comment: req.body.body } }
  TopicData.findOne(query)
          .exec()
          .then(doc => {
            doc.comments = req.body.body
            // console.log(doc)
            const updatedTopicData = new TopicData(doc)
            updatedTopicData.save()
            return res.send({ updated: true })
          })
  // TopicData.findOneAndUpdate(query, topicComment)
  //     .then(resp => {
  //       return res.send({ inserted: true })
  //     })
  //     .catch(err => {
  //       return { error: true }
  //     })
})
//
app.listen(8081, () => {
  console.log('Forum Management Server listening on port 8081!')
})
//
app.use(function (req, res, next) {
  //Website allowed to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  //Request methods allowed
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  //Request headers allowed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  //Set to TRUE if you expect the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  //Pass to next layer of middleware
  next();
})