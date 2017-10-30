let path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const db = require(path.join(__dirname,'../models/index.js'));



module.exports = function(app){

    app.get('/', (req,res) =>{
        db.Article.find({})
            .then((result) => res.render('index', {data: result}))
            .catch((error) => res.render('index', {error: error})); 
    })

    app.get('/get-articles' , (req, res) => {

        //delete existing non-saved articles first
        db.Article.remove({saved: false})
            .catch((error) => res.send(error))
            // once deleted scrape the page
            .then(() => {
                let newsURL = "http://www.gamesradar.com/news/games/"
                request(newsURL, (error, response, html) => {
                    let $ = cheerio.load(html);
                    let articleArray = [];
                    // console.log(html)
                    

                
                    $('div.listingResult').each(function(i, element) {
                        
                        let href = $(element).children('a').attr('href');
                        let headline = $(element).children('a').children('article.search-result').children('div.content').children('header').children('h3').text().trim();
                        let thumbnail = $(element).children('a').children('article.search-result').children('div.image').children('figure').data('original');
                        let publish_date = $(element).children('a').children('article.search-result').children('div.content').children('header').children('p.byline').children('.published-date').attr('datetime');
                        let author = $(element).children('a').children('article.search-result').children('div.content').children('header').children('p.byline').children('span.by-author').children('span').text().trim();
                        // let thumbnail = $(element).children('div.c-entry-box--compact').children('a').children('.c-entry-box--compact__image').children('noscript').children('img').attr('src')
                        isValidArticle( href, headline, publish_date, thumbnail, author, articleArray);
                    });
                    // save scrape to the db
                    db.Article.create(articleArray)
                        .catch((error) => console.log(error))
                        .then((result) =>{
                            res.redirect('/')
                        })
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


    app.put('/api/delete/:id', (req, res) =>{
        let articleID = req.params.id;
        console.log(articleID)
        db.Article.findByIdAndUpdate(articleID, {$set: {saved: false}})
            .then(()=>res.redirect('/saved-articles'));
    })


    app.put('/api/save-article/:articleid', (req, res) => {
        //*********this needs to just update the article saved property to true. find article by id and then update true
        db.Article.findByIdAndUpdate(req.params.articleid, {$set: {saved: true}})
            .catch((error) => res.send(error))
            .then(() => res.redirect('/'))
    });   
}

function isValidArticle(href, headline, publish_date, thumbnail, author,  articleArray){
    if (href === undefined || headline === undefined || publish_date === undefined || thumbnail === undefined || author === undefined){
        console.log('skipped blank article');
    } else {
        articleArray.push({
            href: href,
            headline: headline,
            publish_date: publish_date,
            pic: thumbnail,
            author: author,
            saved: false
        });
    }
};