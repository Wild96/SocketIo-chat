// requiring express
var express = require('express');
//initailizing app to express
var app = express();
//creating server var and passing app to it
var server = require('http').createServer(app);
//initializing soxket.io and passing server var to  it 
var io = require('socket.io').listen(server);
//2 arrays
users = [];
connections = [];
//running server .making it listen to port 3000 
server.listen(process.env.PORT || 3000);
console.log('Server is running');
//creating route and giving response as html file
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//opening socket connection
io.sockets.on('connection', function (socket) {
    //emit events 
    connections.push(socket);
    console.log('Connected:%s sockets connected', connections.length);
    //disconnect 
    socket.on('disconnect',function(data){
       
    //removing username if he closes tab before
    users.splice(users.indexOf(socket.username), 1 );
    updateUsernames();

    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected:%s sockets connected', connections.length)
    });
    //Send Message(on pressing submit button)
    socket.on('send message',function(data){
    //emit new messages
    io.sockets.emit('new message', {msg:data, user: socket.username});

    });
    //New user code
    socket.on('new user',function(data,callback){
        callback(true);
        //assigning the username create to var username
        socket.username = data;
        //push the username into users array
        users.push(socket.username);
        //update the usernames
        updateUsernames();
    });
    function updateUsernames(){
        io.sockets.emit('get users',users);
    }
});

