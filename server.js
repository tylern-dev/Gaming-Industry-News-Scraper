let express = require('express');
let exphbs = require('express-handlebars');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cheerio = require('cheerio');
let request = require('request');

//db models
let articles = require('./models/articlesSchema.js')

let port = process.env.PORT || 3000;

let app = express();

// // Setup the Mongoose connections and DB
// // let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect( "mongodb://localhost/mongoHeadlines");

// let db = mongoose.connection;
// db.on("error", function(error) {
//     console.log("Mongoose Error: ", error);
//   });
// db.once('open', function(){
//     console.log('You are connected to the DB');
// });

// require db connection
require('./config/connection.js')(mongoose);

//routes
require('./controllers/routes.js')(app);

/* CHEERIO SCRAPER */
let newsURL = "https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page"
request(newsURL, (error, response, html) => {
    let $ = cheerio.load(html);
    let articleArray = [];

    $('article.story').each(function(i, element) {
        var href = $('.story-body', this).children('a').attr('href');
        
        // var href = $('a', this).attr('href');
        var headline = $('.headline', this).text().trim();
        var summary = $('.summary', this).text().trim();
        var byAuthor = $('.byline', this).text().trim();
        var thumbnail = $('.wide-thumb', this).children('img').attr('src');

        isValidArticle(href, headline, summary, byAuthor, thumbnail, articleArray);
    });
    console.log(articleArray)
});

function isValidArticle(href, headline, summary, byAuthor, thumbnail, articleArray){
    if (headline === undefined || summary === undefined || byAuthor === undefined || thumbnail === undefined){
        console.log('undefined');
    } else {
        articleArray.push({
            href: href,
            headline: headline,
            summary: summary,
            author: byAuthor,
            pic: thumbnail
        });
    }
};

/* *************** */


//start the server and listen
app.listen(port, (err, result) => {
    if(err){
        console.log('Server Error: ', err);
    } else {
        console.log(`you are connected on port ${port}`)
    }
})
