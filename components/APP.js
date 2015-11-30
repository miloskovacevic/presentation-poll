
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var Header = require('./parts/Header');
var io = require('socket.io-client');


var APP = React.createClass({
    getInitialState(){
        return {
            status: 'disconnected',
            title: ''
        }
    },

    componentWillMount() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect);
        this.socket.on('disconnect', this.disconnect);
        this.socket.on('welcome', this.welcome);
    },

    connect(){
        //alert("Connected :" + this.socket.id );
        console.log('Ovo ide u konzolu na browseru ... Connected: ' + this.socket.id);
        this.setState({
            status: 'connected'
        });
    },
    disconnect(){
        console.log('Disconnected');
        this.setState({
            status: 'disconnected'
        });
    },

    welcome(serverState){
        this.setState({
            title: serverState.title
        });
    },

    render() {
        return (
            <div>
                <Header title={this.state.title} status={this.state.status}/>
                <RouteHandler
                        title={this.state.title}
                        status={this.state.status}
                    />
            </div>
        );
    }
});

module.exports = APP;




