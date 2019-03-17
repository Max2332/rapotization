const
    express = require('express'),
    cors = require('cors'),
    exec = require('await-exec'),
    request = require('request'),
    http = require('http'),
    crypto = require('crypto'),
    fs = require('fs'),
    ffmpegHelper = require('./helpers/ffmpeg'),
    downloadFileSync = require('download-file-sync'),
    cognetiveHelper = require('./helpers/cognetive'),
    yandexHelper = require('./helpers/yandex'),
    imgHelper = require('./helpers/img'),
    util = require('util'),
    app = express();


app.use(cors());

async function process(pathFoFile, req, res) {
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
    res.json(mp4WithGif)
}

app.get('/', (req, res) => {
    
    const fileName = crypto.randomBytes(18).toString('hex') + ".jpg";
    const uploadFolder = __dirname + "/../upload";
    const pathFoFile = uploadFolder + '/' + fileName;
    const file = fs.createWriteStream(pathFoFile);
    
    request.get({url: req.query.url}).pipe(file).on('finish', async () => {
        
        let textData = await cognetiveHelper.getTexData(req.query.text);
        let score = textData.documents.pop().score ? textData.documents.pop().score * 100 : null;
        score = parseInt(score);
        
        let mask = null;
        
        if (score >= 0 && score <= 50) {
            mask = 10000198;
        }
        
        if (score >= 60 && score <= 100) {
            mask = 10000211;
        }
        
        if (mask) {
            let newImgUrl = await exec(`curl -v -X POST "http://upload-soft.photolab.me/upload.php" -F file1=@${pathFoFile} -F no_resize=1`);
            newImgUrl = newImgUrl.stdout;
            newImgUrl = await exec(`curl -v -X POST "http://api-soft.photolab.me/template_process.php" -F image_url[1]=${newImgUrl} -F rotate[1]=0 -F flip[1]=0 -F crop[1]=0,0,1,1 -F template_name="${mask}"`);
            newImgUrl = newImgUrl.stdout;
            
            var download = function (uri, filename, callback) {
                request.head(uri, function (err, res, body) {
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };
            
            download(newImgUrl, pathFoFile, function () {
                process(pathFoFile, req, res);
            });
            return;
        }
        process(pathFoFile, req, res);
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
app.listen(3001, () => console.log('server running on port 3000'));