const nodemailer = require('nodemailer');
const emailSent = require('./emailSent');


let transporter = nodemailer.createTransport({
        host: 'smtp-relay.gmail.com',
        port: 465,
        secure: true
    });



function invoiceEmail(orderDetails) {
    let email = orderDetails.email;
    var address = orderDetails.pubKey;
    var generalAdmission = orderDetails.numGeneral;
    var generalAdmissionLine = "";
    if (!(generalAdmission == 0)) {
        var total = generalAdmission * .75;
        generalAdmissionLine = "<p style='line-height:1.3;margin:0;font-size:.9rem'>RCon3 Ticket: General Admission 0.75 ETH x " + generalAdmission + "&nbsp;&nbsp;&nbsp;&nbsp;" + "<span style=''>" + total + "&nbsp;ETH</span></p>";
    }
    var student = orderDetails.numStudent;
    var studentLine = "";
    if (!(student == 0)) {
        var total = student * .06;
        studentLine = "<p style='line-height:1.3;margin:0;font-size:.9rem'>RCon3 Ticket: Student 0.06 ETH x " + student + "&nbsp;&nbsp;&nbsp;&nbsp;" + "<span style=''>" + total + "&nbsp;ETH</span></p>";
    }
    var grandTotal = (generalAdmission * .75) + (student * .06);
    var mailOptions = {
        from: 'payments@pyrofex.net',
        to: email,
        //to: 'payments@pyrofex.net',
        subject: 'Please submit payment for your RCon3 ticket order',
        html: "<p style='line-height:1.5'>Thank you for your order. If you already paid following the instructions on the web site, no further action is required.</p><p>If you have not already paid, please submit your ETH payment to the account address below.</p><p>Upon receipt of payment you will receive a promo code to redeem for your RCon3 ticket order. Look for the promo code in an message sent this email.</p>" + 
        "<p style='margin-top:1rem;font-size:1.2rem'>Ethereum Address: <b style='color:green'>" + address + "</b></p>" +
        "<p><br></p>" +
        "<div style='width:22rem;background:#f8f8fa;padding:.7rem'><p style='line-height:1.3;margin:0 0 .6rem 0;font-size:1.1rem;border-bottom: 1px solid black'>Invoice</p>" + generalAdmissionLine + studentLine + "<p style='line-height:1.3;font-size:1.2rem;margin:.3rem 0 0 0;border-top:2px solid black'><b>Total<span style='margin-left:13rem'>" + grandTotal + "&nbsp;ETH</span></b></p></div>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function discountEmail(orderDetails, uid) {
    let email = orderDetails.email;
    let discountCode = orderDetails.discountCode;
    var mailOptions = {
        from: 'payments@pyrofex.net',
        to: email,
        subject: 'Your RCon3 registration promo code',
        html: "<p>Your Ethereum payment has been processed! Please redeem the promo code below on <a href='https://www.eventbrite.com/e/rcon-3-rchain-developers-conference-tickets-46303100821#tickets'>Eventbrite</a> to receive your RCon3 ticket.</p><p style='margin-bottom:.5rem;margin-top:1rem;font-size:1.2rem'>RCon3 registration promo code: <b style='color:green'>" + discountCode + "</b></p><a href='https://www.eventbrite.com/e/rcon-3-rchain-developers-conference-tickets-46303100821#tickets' style='font-size:1.2rem'>Register on Eventbrite</a><p>If you need support, please contact payments@pyrofex.net.</p>" 
    }
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            emailSent.updateEmailSent(uid);
        }
    });
}

module.exports.invoiceEmail = invoiceEmail;
module.exports.discountEmail = discountEmail;