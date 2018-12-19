const pg = require('pg');
const conf = require('../controllers/config');

//******************************************//
//OPEN A NEW POOL FOR QUERIES
//******************************************//
function openNewPool() {
    const connectionString =  conf.get('db.url');
    console.log('--- ' + connectionString + '----')
    const pool =new pg.Pool({
        connectionString: connectionString,
    });
    return pool;
}
 function  __connection(){
    let _instance
    return {
        INSTANCE: () => {
            if (!_instance) _instance = openNewPool()
            return _instance
        }
    }
 }
const connection = __connection()
module.exports = {
    connection
}
