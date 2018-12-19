const pg = require('pg');

//RChain Validation Form Validation
function formValidation(req) {
    var errors = [];

    req.check('firstName', 'First Name').isLength({
        min: 2
    });
    req.check('lastName', 'Last Name').isLength({
        min: 2
    });
    req.check('email', 'Email').isEmail({
        min: 2
    });
    req.check('streetAddress1', 'Street Address Line 1').isLength({
        min: 5
    });
    req.check('city', 'City').isLength({
        min: 2
    });
    req.check('postal', 'Postal').isLength({
        min: 2
    });
    req.check('country', 'Country').isLength({
        min: 2
    });
    req.check('phone', 'Phone').isLength({
        min: 2
    });

    var result = req.validationErrors([true]);
    for (var key in result) {
        errors.push(result[key].msg);
    }

    return errors;
}


function saveSubmission(req) {
    
    var pool = new pg.Pool({
        user: 'admin',
        host: '127.0.0.1',
        database: 'postgres',
        password: '!32admin55',
        port: '5432'
    });
    
    var name = [req.body.firstName, req.body.lastName, req.body.email, req.body.streetAddress1, req.body.streetAddress2, req.body.streetAddress3, req.body.city, req.body.region, req.body.postal, req.body.country, req.body.phone, req.body.dataCentersExp, req.body.engineeringExp, req.body.expYears, req.body.staff, req.body.stakes];
    var sql = "INSERT INTO validation(firstname, lastname, email, streetaddress1, streetaddress2, streetaddress3, city, region, postal, country, phone, dataCentersExp, engineeringExp, expYears, staff, stakes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)";
    
    pool.query(sql, name, (err, res) => {
        console.log(err, res);
        pool.end();
    });
    
    return;
}

module.exports.formValidation = formValidation;
module.exports.saveSubmission = saveSubmission;