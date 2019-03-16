const
    express = require('express'),
    cors = require('cors'),
    fr = require('face-recognition'),
    sleep = require('sleep'),
    request = require('request'),
    http = require('http'),
    crypto = require('crypto'),
    fs = require('fs'),
    {createCanvas, loadImage} = require('canvas'),
    app = express();

app.use(cors());

app.get('/', (req, res) => {
    http.get(req.query.url, async (response) => {
    
        const fileName = crypto.randomBytes(18).toString('hex') + ".png";
        const uploadFolder = __dirname + "/../upload/";
        const pathFoFile = uploadFolder + fileName;
        const file = fs.createWriteStream(pathFoFile);
    
        /** После того как файл сохранился на сервер **/
        response.pipe(file).on('finish', () => {
            
            const faceImage = fr.loadImage(pathFoFile);
            const detector = fr.FaceDetector()
            const faceImages = detector.locateFaces(faceImage);
            console.log(faceImages);
            res.json(fileName);
        });
    });
});

app.listen(3000, () => console.log('server running on port 3000'));