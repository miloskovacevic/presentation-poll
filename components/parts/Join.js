var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Join = React.createClass({

    join(){
        var memberName = this.refs.name.value;
        this.props.emit('join', {
            name: memberName
        });
        this.refs.name.value = '';
    },

    render(){
        return (
            <form action="javascript:void(0)" onSubmit={this.join}>
                <label>Full Name</label>
                <input ref="name" className="form-control"
                       placeholder="enter your full name..."
                       required
                    />
                <button className="btn btn-primary">Join</button>
                <Link to="/speaker">Join as Speaker</Link>
                <Link to="/board">Results Board</Link>
            </form>
        );
    }
});

module.exports = Join;