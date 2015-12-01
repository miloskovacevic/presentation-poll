
var express = require('express');
var app = express();
var _ = require('underscore');

// here we'll store our connections...
var connections = [];
var title = 'Untitled presentation';
var audience = [];

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
            name: payload.name
        };

        audience.push(newMember);
        console.log('Audience joined %s', payload.name);
        //now we need to emit message to that client that we recieved payload with name of audience member...
        this.emit('joined', newMember);
        //now we emit message to ALL audience members that new member is in... BROADCASTING EVENT
        io.sockets.emit('audience', audience);

    });

    // when user connects send him title variable content...
    // sending him an object with prop title wich have title variable as content...
    socket.emit('welcome', {
        title : title
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
        }

        connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        console.log('Disconnected! %s sockets remaining', connections.length);



    });

});


console.log('Polling server is running at localhost:3000/ ');
