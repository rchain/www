const convict = require ('convict')

const conf  = convict( {
    db: {
        url: {
            env: 'DB_URL',
            default: 'postgresql://dbuser:secretpassword@database.server.com:5432/mydb'
        }
    }
});
conf.validate({
    allowed: 'strict'
});

module.exports = conf;
