
var express = require('express');
var app = express();
var _ = require('underscore');

// here we'll store our connections...
var connections = [];
var title = 'Default presentation title';
var audience = [];
var speaker = {};
var questions = require('./app-questions');
var currentQuestion = false;

app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);

// event handler for when a socket connects
io.sockets.on('connection', function (socket) {

    //listening to join event from client side when someone joins presentation...
    socket.on('join', function (payload) {
        var newMember = {
            id: this.id,
            name: payload.name,
            type: 'audience'
        };

        audience.push(newMember);
        console.log('Audience joined %s', payload.name);
        //now we need to emit message to that client that we recieved payload with name of audience member...
        this.emit('joined', newMember);
        //now we emit message to ALL audience members that new member is in... BROADCASTING EVENT
        io.sockets.emit('audience', audience);
    });

    //speaker starts event, info about name title of presentation is in payload
    socket.on('start', function (payload) {
        speaker.name = payload.name;
        speaker.id = this.id;
        speaker.type = 'speaker';
        title = payload.title;

        this.emit('joined', speaker);
        //broadcast app state to all audience members  that are already logged in...
        io.sockets.emit('start', {
            title: title,
            speaker: speaker.name
        });
        console.log("Presentation Started: '%s' by %s", title, speaker.name);
    });
    
    socket.on('ask', function (question) {
        currentQuestion = question;
        io.sockets.emit('ask', currentQuestion);
        console.log('Question asked "%s" ', question.q);
    });
    
    // when new user connects send him title, audience, speaker variable content...
    // sending him an object with prop title,speaker,audience wich have title, speaker, audience variable as content...
    socket.emit('welcome', {
        title : title,
        audience: audience,
        speaker: speaker.name,
        questions: questions,
        currentQuestion: currentQuestion
    });

    // push to connections array...
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);


    // disconnect handler...
    socket.once('disconnect', function () {
        // find a member of an audience that have the same id as currently diisconnecting socket...
        var member = _.findWhere(audience, {
            id: this.id
        });
        //if  member exists, remove it from audience array, broadcast new audience state, and log new data to console...
        if(member){
            audience.splice(audience.indexOf(member), 1);
            io.sockets.emit('audience', audience);
            console.log('Left: %s (%s audience members)', member.name, audience.length);
        }else if(this.id === speaker.id){
            console.log("%s has left. '%s' is over!", speaker.name, title);
            speaker = {};
            title = "Untitled presentation";
            io.sockets.emit('end', {
                title: title,
                speaker : '',
                audience: audience
            });

        }

        connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        console.log('Disconnected! %s sockets remaining', connections.length);
    });

});


console.log('Polling server is running at localhost:3000/ ');
