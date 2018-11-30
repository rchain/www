const request = require('request');

function createDiscount(obtainedInfo) {
    let balanceDue = ((obtainedInfo.numGeneral * 700) + (obtainedInfo.numStudent * 50));
    let quantity = obtainedInfo.numGeneral + obtainedInfo.numStudent;
        const options = {
        'url': 'https://www.eventbriteapi.com/v3/discounts/?discount.code=' + obtainedInfo.discountCode + '&discount.type=coded&discount.amount_off=' + balanceDue + '&discount.event_id=46303100821&discount.quantity_available=' + quantity,
        'headers': {
            Authorization: 'Bearer YQNKVHHTFWBBZ35HOFIV',
            Accept: 'application/json'
        },
        'json': true
    };

    request.post(options, function (err, res, body) {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports.createDiscount = createDiscount;