let express = require('express');
let exphbs = require('express-handlebars');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cheerio = require('cheerio');
let request = require('request');

let port = process.env.PORT || 3000;

let app = express();

// Setup the Mongoose connections and DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(err, result){
    if(err){
        console.log("DB Error: ", err);
    } else {
        console.log('You are connected to the DB');
    }
});




//start the server and listen
app.listen(port, function(err, result){
    if(err){
        console.log('Server Error: ', err);
    } else {
        console.log(`you are connected on port ${port}`)
    }
})
