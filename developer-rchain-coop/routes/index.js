const express = require('express');
const router = express.Router();
const request = require('request');
const tokenswap = require('../controllers/tokenswap.js');
const scholarship = require('../controllers/scholarship.js');
const cryptoDb = require('../controllers/crypto-db');
const validation = require('../controllers/validation');
const cryptoEmail = require('../controllers/cryptoEmail');
const eventbrite = require('../controllers/eventbrite');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:3000');
const nodemailer = require('nodemailer');


/* GET Home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'RChain Developer',
        style: 'index',
        ogtitle: 'RChain For Developers',
        ogdescription: "RChain's official source for developers who are looking to get involved with Rholang. Get started and learn about blockchain smart contracting language.",
        ogurl: 'https://developer.rchain.coop/',
        ogimg: 'https://developer.rchain.coop/assets/twitter-img.png'
    });
});

/* GET Documentation page. */
router.get('/documentation', function (req, res) {
    res.render('documentation', {
        title: 'RChain Documentation',
        style: 'documentation',
        ogtitle: 'RChain Documentation',
        ogdescription: "We're building a fundamentally new blockchain platform using Rholang, Casper, and LADL. Learn about what sets us apart from other blockchain platforms.",
        ogurl: 'https://developer.rchain.coop/documentation',
        ogimg: 'https://developer.rchain.coop/assets/twitter-img.png'
    });
});

/* GET FAQ page. */
router.get('/faq', function (req, res) {
    res.render('faq', {
        title: 'RChain FAQ',
        style: 'faq',
        ogtitle: 'RChain FAQ',
        ogdescription: "The RChain Cooperative is a fundamentally new blockchain utilizing Rholang to build and develop smart contracts and distributed decentralized applications.",
        ogurl: 'https://developer.rchain.coop/faq',
        ogimg: 'https://developer.rchain.coop/assets/twitter-img.png'
    });
});

/* GET Conference page. */
router.get('/conference', function (req, res) {
    res.render('conference', {
        title: 'RCon3',
        style: 'conference',
        ogtitle: 'RChain Conference',
        ogdescription: "RCon3 brings together dApp developers from all over the world. RCon3 will take place from Sept 3-6 and will be held in Berlin Germany.",
        ogurl: 'https://developer.rchain.coop/conference',
        ogimg: 'https://developer.rchain.coop/assets/rcon3-img.png',
        scripts: '/js/conferenceBrowser.js'
    });
});

/* GET RCon Program page. */
router.get('/rcon3-program', function (req, res) {
    res.render('rcon3-program', {
        title: 'RCon3 Program',
        style: 'rcon3-program',
        ogtitle: 'RChain Program',
        ogdescription: "RCon3 brings together dApp developers from all over the world. RCon3 will take place from Sept 3-6 and will be held in Berlin Germany.",
        ogurl: 'https://developer.rchain.coop/conference',
        ogimg: 'https://developer.rchain.coop/assets/rcon3-img.png'
    });
});

/* GET RCon Program page. */
router.get('/rcon3-program2', function (req, res) {
    res.render('rcon3-program2', {
        title: 'RCon3 Program',
        style: 'rcon3-program2',
        ogtitle: 'RChain Program',
        ogdescription: "RCon3 brings together dApp developers from all over the world. RCon3 will take place from Sept 3-6 and will be held in Berlin Germany.",
        ogurl: 'https://developer.rchain.coop/conference',
        ogimg: 'https://developer.rchain.coop/assets/rcon3-img.png'
    });
});

/* GET Conference Test page. */
router.get('/conference-test', function (req, res) {
    res.render('conference-test', {
        title: 'RCon3',
        style: 'conference-test',
        ogtitle: 'RChain Conference',
        ogdescription: "RCon3 brings together dApp developers from all over the world. RCon3 will take place from Sept 3-6 and will be held in Berlin Germany.",
        ogurl: 'https://developer.rchain.coop/conference',
        ogimg: 'https://developer.rchain.coop/assets/rcon3-img.png'
    });
});




/* ********GET Order Confirmation page. *************/
router.get('/order-confirmation/:uid', function (req, res, next) {
    var obtainedInfo = cryptoDb.obtainUserInfo(req.params.uid).then((obtainedInfo) => {
        //console.log(obtainedInfo);
        let paymentPaid = "";
        let paymentUnpaid = "";
        let paymentPending = "";
        let paymentReceived = "";
        if (obtainedInfo.isPaid === true) {
            /*** We need to actually call the email methods from the controller ***/
            paymentPaid = obtainedInfo.discountCode;
            paymentReceived = "Your Ethereum payment has been processed! Please use the promo code below to register for RCon3 on Eventbrite. The code will provide you with a 100% ticket discount. Thank you!";
        } else {
            /*** We need to actually call the email methods from the controller ***/
            //cryptoEmail.invoiceEmail(obtainedInfo);
            paymentUnpaid = "Payment Pending";
            paymentPending = "Thank you for your order. Please submit your ETH payment to the account address below. Upon receipt of payment you will receive a promo code to redeem for a RCon3 ticket. Look for the promo code in an message sent to the email shown below, or refresh this page to see the promo code on this page.";
        }
        res.render('order-confirmation', {
            address: obtainedInfo.pubKey,
            paymentPaid: paymentPaid,
            paymentUnpaid: paymentUnpaid,
            paymentReceived: paymentReceived,
            paymentPending: paymentPending,
            email: obtainedInfo.email,
            generalAdmission: obtainedInfo.numGeneral,
            generalAdmissionTotal: obtainedInfo.numGeneral * .75,
            student: obtainedInfo.numStudent,
            studentTotal: obtainedInfo.numStudent * .06,
            total: (obtainedInfo.numGeneral * .75) + (obtainedInfo.numStudent * .06),
            title: 'Order Confirmation',
            style: 'order-confirmation',
            ogtitle: 'RChain Conference',
            ogdescription: "RCon3 brings together dApp developers from all over the world. RCon3 will take place from Sept 3-6 and will be held in Berlin Germany.",
            ogurl: 'https://developer.rchain.coop/conference',
            ogimg: 'https://developer.rchain.coop/assets/rcon3-img.png',
            scripts: "/js/confirmationBrowser.js"
        });
    });
});


/* ********POST Order Confirmation page. *************/
router.post('/order-confirmation/submit', function (req, res, next) {
    var uid = cryptoDb.create(req).then((uid) => {
        res.redirect('/order-confirmation/' + uid);
    });
});

router.get('/crypto-flash/user-info/:uid', function (req, res) {
    console.log("...---Obtaining Information---...")
    var uid = req.params.uid;
    cryptoDb.obtainUserInfo(uid);
});

router.get('/crypto-flash/user-pay/:uid', function (req, res) {
    console.log("...---PAYING---...")
    var uid = req.params.uid;
    cryptoDb.setUserAsPaid(uid);
});

router.get('/crypto-flash/create', function (req, res) {
    cryptoDb.create(req).then(function (address) {}, function (err) {
        console.log(err);
    });

});

router.get('/crypto-flash/refund-request/:uid', (req, res) => {
    console.log("---...REQUESTING REFUND...---");
    var uid = req.params.uid;
    databaseTest.requestRefund(uid);
});

router.get('/crypto-flash/refund-store/:pubKey', (req, res) => {
    console.log("---...STORING REFUND...---");
    var pubKey = "'" + req.params.pubKey + "'";
    databaseTest.logRefund(pubKey);
});

/* GET eth-tuts page. */
router.get('/eth-tuts', function (req, res) {
    res.render('eth-tuts', {
        title: 'Ethereum Tutorials',
        style: 'eth-tuts',
        ogtitle: 'Ethereum Tutorials',
        ogdescription: "",
        ogurl: 'https://developer.rchain.coop/eth-tuts',
        ogimg: 'https://developer.rchain.coop/assets/twitter-img.png'
    });
});


/* GET LADL page. */
router.get('/ladl', function (req, res) {
    res.render('ladl', {
        title: 'LADL',
        style: 'ladl',
        ogtitle: 'LADL Documentation',
        ogdescription: "LADL is a process to create spatial-behaviorial type systems. LADL ensures that contracts are not susceptible to race conditioned attacks.",
        ogurl: 'https://developer.rchain.coop/ladl',
        ogimg: 'https://developer.rchain.coop/assets/twitter-img.png'
    });
});

/* GET Casper page. */
router.get('/casper', function (req, res) {
    res.render('casper', {
        title: 'Casper',
        style: 'casper',
        ogtitle: 'Casper Documentation',
        ogdescription: "Casper is a particular family of proof-of-stake algorithms with strong mathematical foundations that protect networks from scams.",
        ogurl: 'https://developer.rchain.coop/casper',
        ogimg: 'https://developer.rchain.coop/assets/twitter-img.png'
    });
});

/* GET Scholarship Form page. */
router.get('/rcon3-scholarship', function (req, res) {
    res.render('rcon3-scholarship', {
        title: 'RCon3 Scholarship',
        style: 'rcon3-scholarship',
        ogtitle: 'RCon3 Scholarships',
        ogdescription: 'The RChain Cooperative offers scholarships to members who might not otherwise be able to attend RCon3.',
        ogurl: 'https://developer.rchain.coop/rcon3-scholarship',
        ogimg: 'https://developer.rchain.coop/assets/rcon3-img.png',
        scripts: '/js/rcon3-scholarshipBrowser.js'
    });
});

/* POST Scholarship Form page. */
router.post('/scholarship-submission', function (req, res) {
    var success = ["success"];
    var errors = scholarship.formValidation(req);
    if (req.validationErrors()) {
        res.send(errors);
    } else {
        scholarship.saveSubmission(req);
        res.send(success);
    }
});

/* GET Token Swap page. */
router.get('/token-swap', function (req, res) {
    res.render('token-swap', {
        title: 'REV Issuance',
        style: 'token-swap',
        ogtitle: 'REV Issuance',
        ogdescription: 'All RHOC tokens will convert at a 1:1 ratio to REV tokens at the launch of the RChain mainnet (Mercury) in Q1 of 2019.',
        ogurl: 'https://developer.rchain.coop/token-url',
        ogimg: 'https://developer.rchain.coop/assets/twitter-img.png',
        scripts: '/js/tokenSwapBrowser.js'
    });
});

/* POST Token Swap signup. */
router.post('/tokenswap-submission', function (req, res) {
    var success = ["success"];
    var errors = tokenswap.formValidation(req);
    if (req.validationErrors()) {
        res.send(errors);
    } else {
        tokenswap.saveSubmission(req);
        res.send(success);
    }
});

/* GET Validation page. */
router.get('/validation', function (req, res) {
    res.render('validation', {
        title: 'Validation',
        style: 'validation',
        ogtitle: 'Validation',
        ogdescription: '',
        ogurl: 'https://developer.rchain.coop/validation',
        ogimg: 'https://developer.rchain.coop/assets/twitter-img.png',
        scripts: '/js/validatorBrowser.js'
    });
});

/* POST RChain Validator Form */
router.post('/validation-submission', function (req, res) {
    var success = ["success"];
    var errors = validation.formValidation(req);
    if (req.validationErrors()) {
        res.send(errors);
    } else {
        validation.saveSubmission(req);
        res.send(success);
    }
});




module.exports = router;
