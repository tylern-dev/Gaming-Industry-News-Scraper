
const cheerio = require('cheerio');
const request = require('request');
const db = require('../models/index.js')


module.exports = function(app){
    //
    app.get('/' , (req, res) => {
        let newsURL = "https://www.gamespot.com/news/"
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
            res.render('index', {data: articleArray})
        });  
    });

    app.get('/saved-articles', (req, res) =>{
        db.Article.find({}, (err, articles) =>{
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
        db.Article.remove({_id: articleID}, (err, result)=>{
            if(err){
                console.log("Delete error: ", err)
            }
        }).then(()=>res.redirect('/saved-articles'));
    })

    app.post('/api/save-article', (req, res)=>{
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
            pic: thumbnail
        });
    }
};