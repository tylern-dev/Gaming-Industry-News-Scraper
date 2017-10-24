let express = require('express');
let exphbs = require('express-handlebars');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
// let cheerio = require('cheerio');
// let request = require('request');


const cheerio = require('cheerio');
const request = require('request');
const db = require('./models')





//db models
// let articles = require('./models/articlesSchema.js')

let port = process.env.PORT || 3000;

let app = express();

app.use(express.static('./public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// require db connection
mongoose.connect("mongodb://localhost/mongoHeadlines");

    let dbConnect = mongoose.connection;
    dbConnect.on("error", function (error) {
        console.log("Mongoose Error: ", error);
    });
    dbConnect.once('open', function () {
        console.log('You are connected to the DB');
    });

mongoose.Promise = global.Promise;

//routes
app.get('/' , (req, res) => {
    let newsURL = "https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page"
    request(newsURL, (error, response, html) => {
        let $ = cheerio.load(html);
        let articleArray = [];
    
        $('article.story').each(function(i, element) {
            // let storyID = $('.story').parent().attr('id');
            let href = $('.story-body', this).children('a').attr('href');
            
            // let href = $('a', this).attr('href');
            let headline = $('.headline', this).text().trim();
            let summary = $('.summary', this).text().trim();
            let byAuthor = $('.byline', this).text().trim();
            let thumbnail = $('.wide-thumb', this).children('img').attr('src');
    
            isValidArticle(href, headline, summary, byAuthor, thumbnail, articleArray);
            
            
            db.Article.create(articleArray).then(function(){
                res.send('Scrape Complete')
            }).catch( error => res.json(error))

        });
        console.log(articleArray)
        // res.render('index', {data: articleArray})
    });  
});

function isValidArticle(href, headline, summary, byAuthor, thumbnail, articleArray){
    if (href === undefined || headline === undefined || summary === undefined || byAuthor === undefined || thumbnail === undefined){
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



//start the server and listen
app.listen(port, (err, result) => {
    if(err){
        console.log('Server Error: ', err);
    } else {
        console.log(`you are connected on port ${port}`)
    }
});
