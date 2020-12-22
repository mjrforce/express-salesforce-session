
const uuidAPIKey = require('uuid-apikey');


module.exports = function (pool) {
    var apikey = {

        generate: () => {
            var  license = require('./license')(pool);
           
            var apikey = uuidAPIKey.create();
            console.log(apikey);
          
            var lic = license.generate(apikey);
            apikey.license = lic.license;
            console.log(lic);
            var qstring = "INSERT INTO license(uuid, apikey, expire, license) " +
                          "VALUES('" + apikey.uuid + "', '" + apikey.apiKey + "', '" + lic.data.expiration + "', '" + apikey.license + "')"; 
           
            console.log(qstring);              
            pool.query(
               qstring,
                (err, res) => {
                  console.log(err, res);
                  pool.end();
                }
              );
            return apikey;
        },

        validate: (apikey) => {
            var  license = require('./license')(pool);
            var uuid = uuidAPIKey.toUUID(apikey);
            const query = {
                // give the query a unique name
                name: 'fetch-license',
                text: 'SELECT license FROM license WHERE uuid = $1',
                values: [uuid]
              }
            return pool.query(query).then(function(res){
               return license.validate(uuid, apikey, res.rows[0].license);
            });

        }
    }

    return apikey;
};

