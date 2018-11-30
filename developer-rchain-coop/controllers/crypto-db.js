const pg = require('pg');
const db = require('../controllers/db')
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io")); //Connect to the rinkeby test server, with web3.
var CronJob = require('cron').CronJob;
const cryptoEmail = require('../controllers/cryptoEmail');
const eventbrite = require('../controllers/eventbrite');
const conf = require('../controllers/config');

//******************************************//
//WEB3 CREATE ACCOUNT
//******************************************//
function createAccount() {
    var account = web3.eth.accounts.create();
    return account;
}


//*************************************************//
//GENERATE RANDOM NUMBER (NEED TO REPLACE WITH HASH)
//*************************************************//
function randomGen() {
    return Math.random().toString(36).substr(2);
}

//***************************************************//
//UPDATE THE ACCOUNT BALANCES OF THE ETHEREUM ACCOUNTS
//***************************************************//
function updateAccountBalance() {
    let pool = db.connection.INSTANCE();
    let sql = "SELECT pub_key, eth_id FROM eth_data;";

    //Will need to change it to store in wei, accordingly.
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, res) => {
            let count = res.rows.length;
            for (var i = 0; i < res.rows.length; i++) {
                let pubKey = res.rows[i].pub_key;
                let eid = res.rows[i].eth_id;
                web3.eth.getBalance(pubKey).then((wei) => {
                    let currentBalance = web3.utils.fromWei(wei, 'ether');
                        let updatesql = "UPDATE eth_data SET account_balance = " + currentBalance + " WHERE eth_id = " + eid + ";";
                        pool.query(updatesql, (err, res) => {
                            count--;
                            if (count == 0) {
                                resolve(null);
                            }
                        })
                }).catch((err) => {
                    count--;
                    reject(err);
                    return;
                });
            }
        });
    });
};

//***************************************************//
//RETURN UIDS OF DISCOUNT EMAILS THAT NEED TO BE SENT
//***************************************************//
function getIsActiveEmailSent() {
    let pool = db.connection.INSTANCE();
    let sql = "SELECT uid FROM invoices WHERE active = true AND discount_sent = false;";
    let discountedEmailSentInfo = [];


    return new Promise((resolve, reject) => {
        pool.query(sql, (err, res) => {
            if (err) {
                reject(err);
            } else {
                for (var i = 0; i < res.rows.length; i++) {
                    console.log("WE GOT ROWS: \n" + res.rows[i].uid);
                    discountedEmailSentInfo.push(res.rows[i].uid);
                }
            }
            console.log("INFORMATION (UIDS): " + discountedEmailSentInfo);
            resolve(discountedEmailSentInfo);
        });
    });
};



//******************************************//
//CRON JOB (RUNS EVERY 5 MINUTES)
//******************************************//
new CronJob('*/20 * * * * * ', function () {
    updateAccountBalance();
    let pool = db.connection.INSTANCE();
    let sql = "UPDATE invoices SET active = true FROM eth_data WHERE invoices.balance_due <= eth_data.account_balance AND invoices.eth_id = eth_data.eth_id AND invoices.active = false;";
    //for (var i = 0; i < emailNeeded.length; i++) {
    //cryptoEmail.discountEmail(emailNeeded[i]);
    //}
    pool.query(sql, (err, res) => {
        getIsActiveEmailSent().then((emailNeeded) => {
            for (var i = 0; i < emailNeeded.length; i++) {
                let index = i;
                module.exports.obtainUserInfo(emailNeeded[index]).then((obtainedInfo) => {
                    console.log(emailNeeded[index]);
                    console.log("###EMAIL NEEDED####");
                    cryptoEmail.discountEmail(obtainedInfo, emailNeeded[index]);
                    eventbrite.createDiscount(obtainedInfo);
                });
            }
        });
    });
}, null, true);


//******************************************//
//EXPORTED METHODS FOR FRONTEND FUNCTIONALITY
//******************************************//
module.exports = {
    //******************************************//
    //SAVE ETHEREUM ACCOUNT INFORMATION
    //******************************************//
    saveEthAccountInfo(req, eid, callBack) {
        var pool = db.connection.INSTANCE();
        var newEthAccount = createAccount();

        var name = [newEthAccount.address, newEthAccount.privateKey, eid];
        var sql = "INSERT INTO eth_data(pub_key, priv_key, eth_id) VALUES($1, $2, $3);";

        pool.query(sql, name, (err, res) => {
            console.log(err, res);
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, newEthAccount.address);
            }
        });

        return;
    },

    //******************************************//
    //INSERT INTO INVOICE ITEMS
    //******************************************//
    saveInvoiceItems(req, invID, callBack) {
        let pool = db.connection.INSTANCE();
        let name = [req.body.generalAdmission, req.body.student, invID];
        //let name = [1, 1, 1, invID];
        let sql = "INSERT INTO inv_items(general, student, invoice_id) VALUES($1, $2, $3);";

        pool.query(sql, name, (err, res) => {
            if (err) {
                console.log(err);
                callBack(err);
            } else {
                console.log(res);
                callBack(null);
            }

        })
        return;
    },


    //******************************************//
    //SAVE INVOICE INFORMATION
    //******************************************//
    saveInvoiceInfo(req, callBack) {
        var pool = db.connection.INSTANCE();
        var uidRand = randomGen();
        var dis = randomGen(); //Will be replaced once we move from Demo.

        var name = [req.body.email, uidRand, dis];
        var sql = "INSERT INTO invoices(email, uid, discount_code) VALUES($1, $2, $3) RETURNING eth_id, invoice_id;"; //Inserts the email into the invoices table. (Will need to be modified later)

        pool.query(sql, name, (err, res) => {
            console.log(err, res);
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, res.rows[0].eth_id, uidRand, res.rows[0].invoice_id);
            }
        });

        return;
    },

    //***********************************************//
    //SET USER AS PAID, MANUALLY. COULD REMOVE I THINK
    //***********************************************//
    setUserAsPaid(uid) {
        var pool = db.connection.INSTANCE();

        var sql = "UPDATE invoices SET active = true WHERE uid = '" + uid + "';";

        pool.query(sql, (err, res) => {
            if (err) {
                console.log(err, res)
            } else {
                console.log("User Paid");
            }

        });

        return;
    },

    //******************************************//
    //OBTAIN USER INFORMATION
    //*******************************************/
    obtainUserInfo(uid) {
        console.log("Trying to gain information!")
        let pool = db.connection.INSTANCE();
        let obtainedInfo = {};

        let selectStatment = "invoices.email, invoices.balance_due, invoices.discount_code, invoices.active, eth_data.pub_key,inv_items.general, inv_items.student";

        let sql = "SELECT " + selectStatment + " FROM invoices INNER JOIN eth_data ON invoices.eth_id = eth_data.eth_id LEFT JOIN inv_items ON invoices.invoice_id = inv_items.invoice_id WHERE uid = '" + uid + "';";

        return new Promise((resolve, reject) => {
            pool.query(sql, (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    obtainedInfo.email = res.rows[0].email;
                    obtainedInfo.balanceDue = res.rows[0].balance_due;
                    obtainedInfo.pubKey = res.rows[0].pub_key;
                    obtainedInfo.numGeneral = res.rows[0].general;
                    obtainedInfo.numStudent = res.rows[0].student;
                    obtainedInfo.isPaid = res.rows[0].active;
                    if (obtainedInfo.isPaid) {
                        obtainedInfo.discountCode = res.rows[0].discount_code;
                    }
                }
                resolve(obtainedInfo);
            });
        })
    },

   

    //******************************************//
    //UPDATING INV_ITEMS
    //******************************************//
    updateInvItemsPrice(callBack) {
        let pool = db.connection.INSTANCE();
        let priceString = "((inv_items.general * sku_details.general) + (inv_items.student * sku_details.student))";
        let sql = "UPDATE inv_items SET price = " + priceString + "FROM sku_details WHERE inv_items.price IS NULL OR (inv_items.price != " + priceString + ");";

        pool.query(sql, (err, res) => {
            if (err) {
                console.log(err);
                callBack(err);
            } else {
                callBack(null);
            }

        })

        return;
    },


    //******************************************//
    //UPDATING INVOICES BALANCE_DUE
    //******************************************//
    updateInvoicesBalanceDue(callBack) {
        let pool = db.connection.INSTANCE();
        let sql = "UPDATE invoices SET balance_due = (select SUM(inv_items.price) FROM inv_items WHERE inv_items.invoice_id = invoices.invoice_id) FROM inv_items WHERE inv_items.invoice_id = invoices.invoice_id;";

        pool.query(sql, (err, res) => {
            if (err) {
                console.log(err);
                callBack(err);
            } else {
                callBack(null);
            }

        })

        return;

    },

    //******************************************//
    //CREATIION, NEED TO REFACTOR
    //******************************************//
    create(req) {
        return new Promise((resolve, reject) => {
            this.saveInvoiceInfo(req, (err, eid, uid, invID) => {
                if (err) {
                    reject(err);
                } else {
                    this.saveInvoiceItems(req, invID, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            this.updateInvItemsPrice((err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    this.updateInvoicesBalanceDue((err) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            this.saveEthAccountInfo(req, eid, (err, address) => {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    var obtainedInfo = this.obtainUserInfo(uid).then((obtainedInfo) => {
                                                        cryptoEmail.invoiceEmail(obtainedInfo);
                                                    });
                                                    resolve(uid);
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        });
    },
    
    //******************************************//
    // REQUEST REFUND
    //******************************************//
    requestRefund(uid){
        let pool = db.connection.INSTANCE();
        let sql = "UPDATE invoices SET refund_requested = true WHERE uid = '" + uid + "';";

        pool.query(sql, (err, res) => {
            if(err) {
                console.log(err);
            } else {
                console.log(res);
                console.log("Refund Request Sent");
            }
        });

        return;
    },

    //******************************************//
    // REQUEST REFUND
    //******************************************//        
    logRefund(pubKey){
        let pool = db.connection.INSTANCE();
        let sql = "INSERT INTO refund_data(uid, email, balance_returned, user_pub_key) SELECT uid, email, balance_due, " + pubKey + " FROM invoices, eth_data WHERE invoices.refund_requested = true;";

        pool.query(sql, (err, res) => {
            if(err){
                console.log(err);
            } else{
                console.log(res);
                //console.log("###DETAILS###\n" + details.pubKey + "\n###DETAILS###");
                console.log("======REFUND INFORMATION STORED======");
            }
        });
        return;
    },

}

/*
module.exports.saveEthAccountInfo = saveEthAccountInfo;
module.exports.saveInvoiceInfo = saveInvoiceInfo;
module.exports.createAccount = createAccount;
*/
