const
    express = require('express'),
    cors = require('cors'),
    exec = require('await-exec'),
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
        // let score = textData.documents.pop().detectedLanguages.pop().score * 100;
        // score = parseInt(score);
        
        let pathToMp3 = await yandexHelper.getSpeech(req.query.text);
        let pathToMp4WithoutGif = await ffmpegHelper.glueMp3WithImg(
            pathToMp3,
            pathFoFile
        );
        let gifName = await imgHelper.generateGif(pathFoFile);
        
        const wordTiming = await ffmpegHelper.getWordTiming(pathToMp3, req.query.text);
        const mp4WithGif = await ffmpegHelper.glueMovWithGif(
            pathToMp4WithoutGif,
            gifName,
            wordTiming
        );
        
        // const movWithGif = await ffmpegHelper.mp4ToMov(uploadFolder + '/' + mp4WithGif);
        res.json(mp4WithGif)
    });
});

app.get('/video', function (req, res) {
    const path = __dirname + "/../upload/" + req.query.name;
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});
app.listen(3000, () => console.log('server running on port 3000'));