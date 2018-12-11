const convict = require ('convict')

const conf  = convict( {
        url: {
            self: {
                doc: 'rchain coop self. this is a bad idea and needs to be removed post migration',
                env:  'RCHAIN_COOP_URL' ,
                default: 'https://rchain.coop'
            },
            blog: {
                doc: 'rchain blog url',
                env:  'BLOG_URL' ,
                default: 'https://blog.rchain.coop' 
            } ,
            developer: {
                doc: 'developer rchain coop url',
                env: 'DEVELOPER_URL',
                default: 'https://developer.rchain.coop'
            }
        }
});
conf.validate({
    allowed: 'strict'
});

module.exports = conf;
