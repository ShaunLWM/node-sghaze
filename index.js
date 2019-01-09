const request = require('request');
module.exports = callback => {
    let reqOptions = {
        url: 'https://api.data.gov.sg/v1/environment/psi',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
        }
    };

    request(reqOptions, function (error, response, body) {
        if (error) {
            return callback(error);
        }

        if (response.statusCode !== 200) {
            return callback(`request error ${response.statusCode}`);
        }

        return callback(null, JSON.parse(body));
    });
}