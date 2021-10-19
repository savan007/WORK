var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// MongoDB location
var dbUrl = 'mongodb+srv://username:savangj1@learning-node.qpwlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// create model and define schema into mongoDB
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

// var messages = [
//     {name: 'savan', message: 'hello from savan'},
//     {name: 'ritu', message: 'hello from ritu'}
// ]

// get all the messages from the MongoDB
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    //store messages into MongoDB
    var message = new Message(req.body)

    message.save((err) => {
        if (err)
            sendStatus(500)

    //    messages.push(req.body)
        io.emit('message', req.body)
        res.sendStatus(200)
    })
    
})

io.on('connection', (socekt) => {
    console.log('a user connected')
})

// connect to MongoDB
mongoose.connect(dbUrl, (err) => {
    console.log('connection to mongoDB', err)
})

var server = http.listen(3000, () => {
    console.log('server is running', server.address().port)
})