let express = require('express');
let exphbs = require('express-handlebars');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let methodOverride = require('method-override')
let port = process.env.PORT || 8080;

let app = express();



app.use(express.static('./public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Sets up the Express app to handle data parsing - MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// require db connection
require('./config/connection')(mongoose);


//routes
require('./controllers/routes.js')(app);
require('./controllers/notes-routes')(app);


//start the server and listen
app.listen(port, (err, result) => {
    if(err){
        console.log('Server Error: ', err);
    } else {
        console.log(`you are connected on port ${port}`)
    }
});
