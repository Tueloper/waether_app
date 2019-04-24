const request = require('request')

const forcast = (latitude, longitude, callback) => {
    
    let tempUrl = 'https://api.darksky.net/forecast/46142c7bcb43c7e4cbfdd7273312a1d0/' + latitude + ',' + longitude
    
    request({ url: tempUrl, json: true }, (err, response) => {
        if (response) {
            callback(undefined, {
                summary: response.body.daily.data[0].summary,
                temperature: response.body.currently.temperature,
                precipation: response.body.currently.precipProbability
            })
        } else if (err) {
            callback('unable to connect to the location services', undefined)
        }
    })
}

module.exports = forcast