const
    express = require('express'),
    cors = require('cors'),
    request = require('request'),
    http = require('http'),
    crypto = require('crypto'),
    fs = require('fs'),
    
    ffmpegHelper = require('./helpers/ffmpeg'),
    cognetiveHelper = require('./helpers/cognetive'),
    yandexHelper = require('./helpers/yandex'),
    imgHelper = require('./helpers/img'),
    util = require('util'),
    app = express();


app.use(cors());

app.get('/', (req, res) => {
    
    const fileName = crypto.randomBytes(18).toString('hex') + ".jpg";
    const uploadFolder = __dirname + "/../upload";
    const pathFoFile = uploadFolder + '/' + fileName;
    const file = fs.createWriteStream(pathFoFile);
    
    request.get({url: req.query.url}).pipe(file).on('finish', async () => {
        
        let textData = await cognetiveHelper.getTexData(req.query.text);
        let pathToMp3 = await yandexHelper.getSpeech(req.query.text);
        let pathToMp4WithoutGif = await ffmpegHelper.glueMp3WithImg(
            pathToMp3,
            pathFoFile
        );
        let gifName = await imgHelper.generateGif(pathFoFile);
        
        const mp4WithGif = await ffmpegHelper.glueMovWithGif(
            pathToMp4WithoutGif,
            gifName,
        );
        
        res.json('success')
    });
});

app.get('/test', (req, res) => {

});

app.listen(3000, () => console.log('server running on port 3000'));