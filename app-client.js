var React = require('react');

var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var APP = require('./components/APP');
var Audience = require('./components/Audience');
var Board = require('./components/Board');
var Speaker = require('./components/Speaker');
var Whoops404 = require('./components/Whoops404');

//main component that will include and render all other componennts is APP!
var routes = (
    <Route handler={APP}>
        <DefaultRoute handler={Audience} />
        <Route name="speaker" path="speaker" handler={Speaker}></Route>
        <Route name="board" path="board" handler={Board}></Route>
        <NotFoundRoute handler={Whoops404} />
    </Route>
);

//now that we have routes configured, lets render components...
Router.run(routes, function (Handler) {
    React.render(
        <Handler />,
        document.getElementById('react-container')
    );
});



