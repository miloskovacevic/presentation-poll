
var React = require('react');
var Header = require('./parts/Header');
var io = require('socket.io-client');

var APP = React.createClass({
    getInitialState(){
        return {
            status: 'disconnected'
        }
    },

    componentWillMount() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect);
        this.socket.on('disconnect', this.disconnect);
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

    render() {
        var njak = 'New header';
        return (
            <div>
                <Header title={njak} status={this.state.status}/>

            </div>
        );
    }
});

module.exports = APP;
