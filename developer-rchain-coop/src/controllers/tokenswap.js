const pg = require('pg');
const db = require('../controllers/db')

//Tokenswap Form Validation
function formValidation (req) {
    var errors = [];

    //email
    req.check('email').isEmail({
        min: 2
    });
    var errorcheck = req.validationErrors();
    if (errorcheck) {
        errors.push("Please enter a valid email address");
    }
    console.log(errors);
    return errors;
}

//Save email submission to DB
function saveSubmission  (req) {
    //open DB connection
    const pool = db.connection.INSTANCE();
    
    var name = [req.body.email];
    var sql = "INSERT INTO tokenswap(email) VALUES($1)";
    //Save to DB and close connection
    pool.query(sql, name, (err, res) => {
        console.log(err, res);
    });
    return;
}

module.exports.formValidation = formValidation;
module.exports.saveSubmission = saveSubmission;
