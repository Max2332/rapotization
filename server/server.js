const
    express = require('express'),
    cors = require('cors'),
    request = require('request'),
    http = require('http'),
    crypto = require('crypto'),
    fs = require('fs'),

    ffmpegHelper = require('./helpers/ffmpeg'),
    imgHelper = require('./helpers/img'),
    util = require('util'),
    app = express();


app.use(cors());

app.get('/', (req, res) => {

    const fileName = crypto.randomBytes(18).toString('hex')+".jpg";
    const uploadFolder = __dirname + "/../upload";
    const pathFoFile = uploadFolder + '/' + fileName;
    const file = fs.createWriteStream(pathFoFile);

    request.get({url: req.query.url}).pipe(file).on('finish', async () => {

        let gifPath;
        let mp4WithoutGif ;
        let promises = [];

        let generateGifPromise = imgHelper.generateGif(pathFoFile);
        let glueImgMp3Promise = ffmpegHelper.glueMp3WithImg(
            '/var/www/photolab_v2/upload/test.mp3',
            pathFoFile
        );
        promises.push(generateGifPromise);
        promises.push(glueImgMp3Promise);

        generateGifPromise.then((pathToGif) => {
            gifPath = pathToGif;
        });

        glueImgMp3Promise.then((pathToMp4) => {
            mp4WithoutGif = pathToMp4;
        });

        await Promise.all(promises);

        const mp4WithGif = await ffmpegHelper.glueMovWithGif(
            mp4WithoutGif,
            gifPath,
            [1, 5, 10]
        );

        res.json('success')
    });
});

app.get('/test', (req, res) => {
    var fileName = 'upload/voice-' + Date.now() + '.ogg';
    var stream = request.post(
        {
            url: 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer CggaATEVAgAAABKABGAJ3oiNo2TERHNNLqbw-qpc9c_htv91FZzBIa5HBUPbWiQ1s4Gbp1Gpbu5UZsnpwOmegPYEwzaxzLC8_1LnS65jcA8B19La-daeD4RDbFrx9JODaHa2YGsaFDP7xzX7teYlkopST3rukEtahgvobsn5QOvJq9C7b_yk7NMUGrEk4KPXPwyPkhoWzvP5FHXotZm3kV2os-84lhhjdWozmJWDkZP9AW9bmt8MskzzAllTbISy1e44Sp6oPDdbtBCRr6C96Sy_lq4zeL_gTfaYDNcjno0yXx0RwvFGsS0KxWG0NeEBPQxJkycD8CcWKCsoO6bSAp_KMsOs1Wmt_pK4V54FZbxrFjJeiVwJRPuVX8Z7m9uymDWJx0MUnQgr86qQNPGNPnrbPnpic68d1autmMCPA1ktxTyY4cKtgS_xe4-IHOBHEaYsyfw1V9ph8ZVGwlkXSAB1-7YgDWaWllEcBuQqPrKgcxuTER471bOjtzzta09EelxCg6RCYVM72CeNKE7_Z7tqZMQiM1S6gdZEgaGG6LTfCDULHj65yAxUv084Iq0dHausVFoAB9q3KOv2o8jo4XRVnnSFF2biBGeaIk8H639reaPW-TKICpqZOpfDgcGHDFToiQgZ_PrMTwsN4EnX93i_sm2IEmYd_rk2yNQ86NlFHE6aRkaLmnyHiTjxGmYKIGJkMzhhYjNmZmRlZDQ3MGFiYzA0ZDY1Y2VlNDZjZmU2ELTnt-QFGPS4uuQFIiQKFGFqZTZlMW0ydWtzMm92bzlkYWQ1EgxldG92bGFkaXNsYXZaADACOAFKCBoBMRUCAAAAUAEg9QQ`
            },
            form: {
                text: req.query.text,
                lang: 'ru-RU',
                voice: 'alyss',
                folderId: 'b1gl9fhqp75jm4c90v2p',
                emotion: 'evil'
            }
        }, function (error, response, body) {
            console.log(response);
        }
    ).pipe(fs.createWriteStream(fileName));

    stream.on('finish', async function () {
        let path = await ffmepgHelper.overlayTwoSounds('/Applications/PhpStorm.app/Contents/bin/projects/rapotization2/server/' + fileName, '/Applications/PhpStorm.app/Contents/bin/projects/rapotization2/server/upload/1.mp3', 1);
        var stat = fs.statSync(path);
        res.writeHead(200, {
            'Content-Type': 'audio/mp3',
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(path);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
    });


});

app.listen(3000, () => console.log('server running on port 3000'));