const
    express = require('express'),
    cors = require('cors'),
    request = require('request'),
    http = require('http'),
    crypto = require('crypto'),
    fs = require('fs'),
    
    ffmpegHelper = require('./helpers/ffmpeg'),
    imgHelper = require('./helpers/img'),
    
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

app.listen(3000, () => console.log('server running on port 3000'));

