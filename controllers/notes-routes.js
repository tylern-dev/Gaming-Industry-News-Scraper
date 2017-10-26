let db = require('../models/index')

module.exports = function(app){

    app.get('/notes', (req, res) =>{
        res.render('notes');
    });

}