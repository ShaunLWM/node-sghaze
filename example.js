var haze = require('./index.js');

haze.retrieveData('INSERT KEY HERE', function(error, data) {
    if (!error) {
        console.log(data);
    } else {
        console.log(error);
    }
});
