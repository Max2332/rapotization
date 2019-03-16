const
    express = require('express'),
    cors = require('cors'),
    request = require('request'),
    fr = require('face-recognition'),
    http = require('http'),
    faceHelper = require('./helpers/face'),
    crypto = require('crypto'),
    fs = require('fs'),
    {canvas} = require('canvas'),
    app = express();


app.use(cors());

app.get('/', (req, res) => {
    http.get(req.query.url, async (response) => {
        
        const fileName = crypto.randomBytes(18).toString('hex') + ".jpg";
        const uploadFolder = __dirname + "/../upload/";
        const pathFoFile = uploadFolder + fileName;
        const file = fs.createWriteStream(pathFoFile);
        
        /** После того как файл сохранился на сервер **/
        response.pipe(file).on('finish', async () => {
            const faceImg = fr.loadImage(pathFoFile);
            const predictor = fr.FaceLandmark68Predictor();
            const detector = new fr.FrontalFaceDetector();
            const faceRect = detector.detect(faceImg).pop();
            let facePoints = predictor.predict(faceImg, faceRect).getParts();
            res.json(faceHelper.foramt(facePoints))
        });
    });
});

app.listen(3000, () => console.log('server running on port 3000'));