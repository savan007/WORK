var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
const { request } = require('http')

mongoose.Promise = Promise

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
//     {name: 'demo', message: 'message from demo'},
//     {name: 'demo2', message: 'message from demo 2'}
// ]

// get all the messages from the MongoDB
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) => {
    
    try{
        //throw 'message from'
        //store messages into MongoDB
        var message = new Message(req.body)

        var savedMessage = await message.save()

        console.log('saved')
        var censored = await Message.findOne({message: 'bad'}) // promise --> result use in next chain call

            if(censored){
                await Message.remove({_id: censored.id})
            }
            else{
        //  messages.push(req.body)
                io.emit('message', req.body)
            }
            res.sendStatus(200)

    } catch(error){
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('message from finally')
    }
    
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