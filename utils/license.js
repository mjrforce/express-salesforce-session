
const SoftwareLicenseKey = require('software-license-key');
const certs =require('./certs')

module.exports = function () {
    var license = {


        validate: (uuid, key, lic) => {
            return new Promise(function(resolve, reject){
            var validator = new SoftwareLicenseKey(certs.PUBLIC_KEY);
            console.log(key);
            var data = validator.validateLicense(lic);
            console.log(data);

            var exp = new Date(data.expiration);
            var now = new Date();
            var response = {status: 200, message: 'OK'};
            //if expiration is before today (ie: is expired)
            try {
                if (exp.getTime() < now.getTime()) {
                    response = { status: 401, message: "License is expired." };
                }
                else if (data.data.apiKey !== key) {
                    response = { status: 402, message: "API Key is not valid." }
                }
                else if (data.data.uuid !== uuid) {
                    response = { status: 403, message: "UUID is not valid." };
                }
                else {
                    //valid, non expired license key
                    resposne = { status: 200, message: "Valid License" };
                }
            } catch (e) {
                response = { status: 400, message: e.message };
            }

            resolve(response);
        });

        },

        generate: (data) => {
            var generator = new SoftwareLicenseKey(certs.PRIVATE_KEY);
            var dt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
            var licenseKeyData = { expiration: dt.toISOString(), data: data || {} }
            var license = generator.generateLicense(licenseKeyData);
            return { license: license, data: licenseKeyData };
        }
    };

    return license;
};
