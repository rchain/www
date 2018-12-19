const db = require('../controllers/db')

//***************************************************//
//UPDATE DATABASE ONCE DISCOUNT EMAIL IS SENT
//***************************************************//
function updateEmailSent(uid) {
    let pool = db.connection.INSTANCE();
    let sql = "UPDATE invoices SET discount_sent = true WHERE uid = '" + uid + "';";

    pool.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log("DISCOUNT EMAIL SENT, UPDATING DB");
        }
    });
}


module.exports.updateEmailSent = updateEmailSent;
