let db = require('../models/index')

module.exports = function(app){

    app.get('/notes/:id', (req, res) =>{
        let articleID = req.params.id

        db.Article.findById({_id: articleID})
            .populate('note')
            .catch((error)=>res.render('notes', {error: error}))
            .then((result)=>{
                console.log(result)
                res.render('notes', {data: result})
            })

    });




    // HOW DO I SUBMIT THE NOTE AND THEN REFRESH THE PAGE WITH THE NOTE DISPLAYED?
    app.post('/api/notes', (req, res)=>{
        let articleID = req.body.id;

        db.Note.create({author: req.body.author, comment:req.body.comment})
            .catch((error) => res.json(error))
            .then((dbNote) =>{

                return db.Article.findOneAndUpdate({ _id: articleID }, {$push: { note: dbNote._id }}, { new: true });
            })
            .then((dbArticle) =>{
                res.send(dbArticle);
            })
            .catch((error)=>{
                res.send(error);
            })
    });
            
    

        
    

}