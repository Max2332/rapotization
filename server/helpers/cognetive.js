let https = require('https');
let accessKey = 'fca3647a5fb84f60b826c82e3904f0c4';

// e2b9729751d34bd4affb3680eb9a7d76

let uri = 'westeurope.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/sentiment';

module.exports = {
    
    getTexData: (text) => {
        
        return new Promise((resolve, reject) => {
            
            let body = JSON.stringify({'documents': [{'id': '1', 'text': text}]});
            let request_params = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };
            
            let req = https.request(request_params, function (response) {
                let body = '';
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    let body_ = JSON.parse(body);
                    resolve(body_);
                });
                response.on('error', function (e) {
                    console.log('Error: ' + e.message);
                });
            });
            
            req.write(body);
            req.end();
        })
    }
}