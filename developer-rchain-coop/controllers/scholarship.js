const pg = require('pg');

//Scholarship Form Validation
function formValidation(req) {
    var errors = [];

    req.check('firstName', 'First Name').isAlpha().isLength({
        min: 2
    });
    req.check('lastName', 'Last Name').isAlpha().isLength({
        min: 2
    });
    req.check('email', 'Email').isEmail({
        min: 2
    });
    req.check('streetAddress1', 'Street Address Line 1').isLength({
        min: 5
    });
    req.check('city', 'City').isAlpha().isLength({
        min: 2
    });
    req.check('postal', 'Postal').isLength({
        min: 2
    });
    req.check('country', 'Country').isAlpha().isLength({
        min: 2
    });
    req.check('phone', 'Phone').isLength({
        min: 2
    });
    req.check('Hope_to_Gain', 'What do you hope to gain by attending RCon3?').isLength({
        min: 2
    });
    req.check('Hope_to_Contribute', 'What do you hope to contribute to the RChain community by attending RCon3?').isLength({
        min: 1
    });
    req.check('contribute', 'Contribution Amount').isLength({
        min: 1
    });
    req.check('background', 'Please briefly describe your educational and professional background.').isLength({
        min: 1
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

    var name = [req.body.firstName, req.body.lastName, req.body.email, req.body.streetAddress1, req.body.streetAddress2, req.body.streetAddress3, req.body.city, req.body.region, req.body.postal, req.body.country, req.body.phone, req.body.member, req.body.interest, req.body.Hope_to_Gain, req.body.Hope_to_Contribute, req.body.reimbursment, req.body.contribute, req.body.age, req.body.background];
    var sql = "INSERT INTO scholarship2(firstname, lastname, email, streetaddress1, streetaddress2, streetaddress3, city, region, postal, country, phone, member, interest, hope_to_gain, hope_to_contribute, reimbursment, contribute, age, background) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)";

    pool.query(sql, name, (err, res) => {
        console.log(err, res);
        pool.end();
    });

    return;

/*
CREATE TABLE scholarship2(
firstname VARCHAR,
lastname VARCHAR,
email VARCHAR,
streetaddress1 VARCHAR,
streetaddress2 VARCHAR,
streetaddress3 VARCHAR,
city VARCHAR,
region VARCHAR,
postal VARCHAR,
country VARCHAR,
phone VARCHAR,
member VARCHAR,
interest VARCHAR,
hope_to_gain VARCHAR,
hope_to_contribute VARCHAR,
reimbursment VARCHAR,
contribute VARCHAR,
age VARCHAR,
background VARCHAR
);
*/
}

module.exports.formValidation = formValidation;
module.exports.saveSubmission = saveSubmission;
