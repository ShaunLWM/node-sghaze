var request = require('request');
var parseString = require('xml2js').parseString;
var moment = require('moment');
var api = 'http://www.nea.gov.sg/api/WebAPI/?dataset=psi_update&keyref=';

function Haze() {
}

Haze.prototype.retrieveDataLegacy = function(callback) {
    var all = [];
    request('http://www.nea.gov.sg/anti-pollution-radiation-protection/air-pollution-control/psi/psi-readings-over-the-last-24-hours', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            getMatches(body.toString(), /<strong style="font-size:14px;">(.*?)<\/strong>/g, 1).forEach(function(element, index, array) {
                var data = {};
                switch (index) {
                    case 0:
                    data.name = 'north';
                    data.value = element;
                    data.timestamp = moment().format();
                    break;
                    case 1:
                    data.name = 'south';
                    data.value = element;
                    data.timestamp = moment().format();
                    break;
                    case 2:
                    data.name = 'east';
                    data.value = element;
                    data.timestamp = moment().format();
                    break;
                    case 3:
                    data.name = 'west';
                    data.value = element;
                    data.timestamp = moment().format();
                    break;
                    case 4:
                    data.name = 'central';
                    data.value = element;
                    data.timestamp = moment().format();
                    break;
                    case 5:
                    data.name = 'overall';
                    var val = element.split('-');
                    data.value = val[0];
                    data.timestamp = moment().format();
                    break;
                }
                if (data.name) {
                    all.push(data);
                }
            });
            callback(null, all);
        } else {
            callback('Error accessing website. Website may be down.');
        }
    });
}

Haze.prototype.retrieveData = function(key, callback) {
    var all = [];
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

function getMatches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

module.exports = new Haze();
