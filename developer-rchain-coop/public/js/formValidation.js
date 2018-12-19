//Tokenswap Form Validation
function tokenSwapFormValidation(req) {
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

function saveTokenSwapSubmission(req, pool) {
    var name = [req.body.email];
    var sql = "INSERT INTO tokenswap(email) VALUES($1)";
    pool.query(sql, name, (err, res) => {
        console.log(err, res);
        pool.end();
    });
    return;
}
