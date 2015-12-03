var React = require('react');

var Ask = React.createClass({
    getInitialState(){
        return {
            choices: []
        };
    },

    componentWillMount(){
        this.setUpChoices();
    },

    componentWillReceiveProps(){
        this.setUpChoices();
    },

    setUpChoices(){
        var choices = Object.keys(this.props.question);
        choices.shift();

        this.setState({
            choices: choices
        });
    },

    addChoiceButton(choice, i){
        var buttonTypes = ['primary', 'success', 'warning', 'danger'];
        return (
            <button className={"col-xs-12 col-sm-6 btn btn-" + buttonTypes[i]} key={i}>
                {choice}: {this.props.question[choice]}
            </button>

        );
    },

    render(){

        return (
            <div id="currentQuestion">
                <h2>{this.props.question.q}</h2>

                <div className="row">
                    {this.state.choices.map(this.addChoiceButton)}
                </div>
            </div>
        );
    }
});


module.exports = Ask;





