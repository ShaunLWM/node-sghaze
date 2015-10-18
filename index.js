var request = require('request');
var parseString = require('xml2js').parseString;
var moment = require('moment');
var api = 'http://www.nea.gov.sg/api/WebAPI/?dataset=psi_update&keyref=';

var all = [];

function Haze() {
}

Haze.prototype.retrieveData = function(key, callback) {
    if(typeof key != 'undefined') {
        request(api + key, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                parseString(body.toString(), function (err, result) {
                    if (!err) {
                        result.channel.item[0].region.forEach(function(element, index, array) {
                            var data = {};
                            switch (element.id[0]) {
                                case 'rNO':
                                data.name = 'north';
                                break;
                                case 'rCE':
                                data.name = 'central';
                                break;
                                case 'rEA':
                                data.name = 'east';
                                break;
                                case 'rWE':
                                data.name = 'west';
                                break;
                                case 'rSO':
                                data.name = 'south';
                                break;
                                case 'NRS':
                                data.name = 'overall';
                                break;
                                default:
                                data.name = 'unknown';
                            }
                            var timestamp = element.record[0]['$'].timestamp;
                            data.timestamp = moment(timestamp, "YYYYMMDDHHmmss").format();
                            data.value = element.record[0].reading[0]['$'].value;
                            all.push(data);
                        });
                        callback(null, all);
                    } else {
                        callback('Error parsing XML.');
                    }
                });
            } else {
                callback('Error accessing website. Website may be down.');
            }
        });
    } else {
        callback('No key defined.');
    }
}
module.exports = new Haze();
