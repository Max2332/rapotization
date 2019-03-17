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
                        'Authorization': `Bearer CggaATEVAgAAABKABGAJ3oiNo2TERHNNLqbw-qpc9c_htv91FZzBIa5HBUPbWiQ1s4Gbp1Gpbu5UZsnpwOmegPYEwzaxzLC8_1LnS65jcA8B19La-daeD4RDbFrx9JODaHa2YGsaFDP7xzX7teYlkopST3rukEtahgvobsn5QOvJq9C7b_yk7NMUGrEk4KPXPwyPkhoWzvP5FHXotZm3kV2os-84lhhjdWozmJWDkZP9AW9bmt8MskzzAllTbISy1e44Sp6oPDdbtBCRr6C96Sy_lq4zeL_gTfaYDNcjno0yXx0RwvFGsS0KxWG0NeEBPQxJkycD8CcWKCsoO6bSAp_KMsOs1Wmt_pK4V54FZbxrFjJeiVwJRPuVX8Z7m9uymDWJx0MUnQgr86qQNPGNPnrbPnpic68d1autmMCPA1ktxTyY4cKtgS_xe4-IHOBHEaYsyfw1V9ph8ZVGwlkXSAB1-7YgDWaWllEcBuQqPrKgcxuTER471bOjtzzta09EelxCg6RCYVM72CeNKE7_Z7tqZMQiM1S6gdZEgaGG6LTfCDULHj65yAxUv084Iq0dHausVFoAB9q3KOv2o8jo4XRVnnSFF2biBGeaIk8H639reaPW-TKICpqZOpfDgcGHDFToiQgZ_PrMTwsN4EnX93i_sm2IEmYd_rk2yNQ86NlFHE6aRkaLmnyHiTjxGmYKIGJkMzhhYjNmZmRlZDQ3MGFiYzA0ZDY1Y2VlNDZjZmU2ELTnt-QFGPS4uuQFIiQKFGFqZTZlMW0ydWtzMm92bzlkYWQ1EgxldG92bGFkaXNsYXZaADACOAFKCBoBMRUCAAAAUAEg9QQ`
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
                let path = await ffmpegHelper.overlayTwoSounds(pathFoFile,beatPath, 1);
                resolve(path);
            });
        });
    }
}