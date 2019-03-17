const
    request = require('request'),
    ffmpegHelper = require('./ffmpeg'),
    fs = require('fs'),
    crypto = require('crypto');

module.exports = {
    
    getSpeech: (text) => {
        return new Promise((resolve, reject) => {
            const fileName = crypto.randomBytes(18).toString('hex');
            const uploadFolder = __dirname + "/../../upload";
            const pathFoFile = uploadFolder + '/' + fileName + ".ogg";
            var stream = request.post(
                {
                    url: 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer CggaATEVAgAAABKABH0c4bsM3ebKywvXxwkiR7-MV4Ojd8_q2eC7qYY69HGYNWHN05UwDicnlPbL34Y-HYGy-rdpuiPHL5meVFg_XvT4-eW1Iw2twIzGDSLC5ozYYKXsqCOwfuijIhT6JHUc96JF2zk-jZZzmqTys5eq_49TJQXjHAqsXI-XNWUqKcCOHNZYqHDCJFIbs4dHyyUk2H_Rs7Y152eY6XCfLXZZFpPEW8vE1t3RUMMS8LvRAwZBzTvPLGEDnWvJDgDhFfpdn6eL0zNCOtxfasphNZpECywHDPYPWC9tY2cxgGgCJhl_LjbkKCZ2DlyEWoemuLnRNuQRfOfeh_ihA3d3VNiBg-TRycBQMHoKWHIgktBoWiXkblCWHuhBEN3N1DBOJmAlpm7B57Db1jjmK82ZI1tnfZGZ6UjYJaCxO8Gr_ytEUjOYh5wI2ciA5XsgDlfjQD7dxZw4koawav9T0hfP4HlS4r3Vj8Ajphc6cj4fNtBkPjBlzSOPPK-VWTH51Iwk0cBaSpHHMaMCHB08SmLqxWbC1A2aD2k3RqCHUmvU4ar-aXapWtiv3O6A_iWkE8OuYEdBXK6q0UELHBl-ARGEfZm4a9Dsa2xrvViFTp1QgkhVXv5lj0FaXA4dj7srqwO5E7HjvH0mlp3qaXfmMle8yPBlBDU9cPGvezvpxdGggoX7DJbbGmYKIDg1YTllMzE1ZmU3NjRjN2FhM2VkY2FkMDA3M2IzYzliEITrueQFGMS8vOQFIiQKFGFqZTZlMW0ydWtzMm92bzlkYWQ1EgxldG92bGFkaXNsYXZaADACOAFKCBoBMRUCAAAAUAEg9QQ`
                    },
                    form: {
                        text: text,
                        lang: 'ru-RU',
                        voice: 'alyss',
                        folderId: 'b1gl9fhqp75jm4c90v2p',
                        emotion: 'evil'
                    }
                }, function (error, response, body) {
                }
            ).pipe(fs.createWriteStream(pathFoFile));
            
            stream.on('finish', async function () {
                let beatPath = `${__dirname}/../beat.mp3`;
                let path = await ffmpegHelper.overlayTwoSounds(pathFoFile,beatPath, 2);
                resolve(path);
            });
        });
    }
}