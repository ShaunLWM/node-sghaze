const haze = require('./index.js'); // replace with node-sghaze
haze((error, results) => {
    if (error) {
        return console.error(error);
    }

    console.log(results);
})
