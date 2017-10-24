
const cheerio = require('cheerio');
const request = require('request');
const articleDB = require("../models/articlesSchema.js");
const notesDB = require("../models/notesSchema.js");


module.exports = function(app){

    // app.get('/', (req, res) => {
    //     res.render('index');
    // });

   
    
    // checks the data for undefined values. Defined values are pushed to the db
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


}