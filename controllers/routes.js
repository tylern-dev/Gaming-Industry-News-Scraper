let path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const db = require(path.join(__dirname,'../models/index.js'));



module.exports = function(app){

    app.get('/', (req,res) =>{
        db.Article.find({saved:false})
            .then((result) => res.render('index', {data: result}))
            .catch((error) => res.render('index', {error: error}));
    })

    app.get('/get-articles' , (req, res) => {

        //delete existing non-saved articles first
        db.Article.remove({saved: false})
            .catch((error) => res.send(error))
            // once deleted scrape the page
            .then(() => {
                let newsURL = "http://www.gamespot.com/news/"
                request(newsURL, (error, response, html) => {
                    let $ = cheerio.load(html);
                    let articleArray = [];
                
                    $('article.media-article').each(function(i, element) {
                        let storyID = $(element).children('a').attr('data-event-guid');
                        let href = $(element).children('a').attr('href');
                        let headline = $(element).children('a').attr('data-event-title');
                        let summary = $(element).children('a').children('.media-body').children('p.media-deck').text().trim();
                        let thumbnail = $(element).children('a').children('figure.media-figure').children('.media-img').children('img').attr('src');
                        isValidArticle(storyID, href, headline, summary, thumbnail, articleArray);
                    });
                    // save scrape to the db
                    db.Article.create(articleArray)
                        .catch((error) => res.send(error))
                        .then((result) => res.redirect('/'))
                });
            });  
    });
    // route for the saved articles page
    app.get('/saved-articles', (req, res) =>{
        db.Article.find({saved: true}, (err, articles) =>{
            if(err){
                console.log('Error finding articles ', err);
            } else {
                res.render('saved', {data: articles})
                // res.json(articles)
            }
        });
    });

    app.delete('/api/delete/:id', (req, res) =>{
        let articleID = req.params.id;
        console.log(articleID)
        db.Article.remove({_id: articleID})
            .then(()=>res.redirect('/saved-articles'));
    })

    app.post('/api/save-article', (req, res)=>{
        //this needs to just update the article saved property to true. find article by id and then update true
        
        db.Article.create(req.body, (error, result)=>{
            if(error){
                console.log(error)
            } else {
                console.log('Save Complete', result)
            }
        });
    });   
}

function isValidArticle(storyID, href, headline, summary, thumbnail, articleArray){
    if (storyID === undefined || href === undefined || headline === undefined || summary === undefined || thumbnail === undefined){
        console.log('undefined');
    } else {
        articleArray.push({
            storyID: storyID,
            href: `https://www.gamespot.com${href}`,
            headline: headline,
            summary: summary,
            pic: thumbnail,
            saved: false
        });
    }
};