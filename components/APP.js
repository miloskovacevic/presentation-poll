
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var Header = require('./parts/Header');
var io = require('socket.io-client');


var APP = React.createClass({
    getInitialState(){
        return {
            status: 'disconnected',
            title: '',
            member: {},
            audience: [],
            speaker: '',
            questions: [],
            currentQuestion: false,
            results: {}
        }

    },

    componentWillMount() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect);
        this.socket.on('disconnect', this.disconnect);
        this.socket.on('welcome', this.updateState);
        this.socket.on('joined', this.joined);
        this.socket.on('audience', this.updateAudience);
        this.socket.on('start', this.start);
        this.socket.on('end', this.updateState);
        this.socket.on('ask', this.ask);
        this.socket.on('results', this.updateResults);
    },

    joined(member){
        sessionStorage.member = JSON.stringify(member);
        this.setState({
            member: member
        });
    },

    emit(eventName, payload){
        this.socket.emit(eventName, payload);
    },

    connect(){
        var member = (sessionStorage.member) ? JSON.parse(sessionStorage.member) : null;

        //if(member){
        //    if(member.type === 'member'){
        //        this.emit('join', member);
        //    }else if(member.type === 'speaker'){
        //        this.emit('start', member);
        //    }
        //}

        if(member && member.type === 'audience'){
            this.emit('join',member);
        } else if (member && member.type === 'speaker'){
            this.emit('start', {
                name: member.name,
                title: sessionStorage.title
            });
        }

        this.setState({
            status: 'connected'
        });
    },
    disconnect(){
        console.log('Disconnected');
        this.setState({
            status: 'disconnected',
            title: 'disconnected',
            speaker: ''
        });
    },

    updateState(serverState){
        // all our variables in state are covered...(title, audience, speaker now got values from server)
        this.setState(serverState);
    },

    updateAudience(audienceArray){
        this.setState({
            audience: audienceArray
        });
    },

    start(presentation){
        if(this.state.member.type === 'speaker'){
            sessionStorage.title = presentation.title;
        }
        this.setState(presentation);
    },

    ask(question){
        sessionStorage.answer = '';
        this.setState({
            currentQuestion: question,
            results : {a:0, b:0, c:0, d:0}
        });
    },

    updateResults(data){
        this.setState({
            results: data
        });

    },

    render() {
        return (
            <div>
                <Header {...this.state} />
                <RouteHandler emit={this.emit} {...this.state}
                    />
            </div>
        );
    }
});

module.exports = APP;




