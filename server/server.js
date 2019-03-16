const
    express = require('express'),
    cors = require('cors'),
    request = require('request'),
    http = require('http'),
    crypto = require('crypto'),
    fs = require('fs'),
    
    GIFEncoder = require('gifencoder'),
    faceHelper = require('./helpers/face'),
    fr = require('face-recognition'),
    {createCanvas, loadImage, Image} = require('canvas'),
    
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
            facePoints.unshift({}); // ! очень важно
            const facePart = faceHelper.foramt(facePoints);
            
            const canvas = createCanvas(500, 800);
            const ctx = canvas.getContext('2d');
            const encoder = new GIFEncoder(500, 800);
            
            encoder.createReadStream().pipe(fs.createWriteStream('1.gif'));
            encoder.start();
            encoder.setTransparent(0xFF00FF);
            encoder.setRepeat(0);
            encoder.setDelay(20);
            
            let frames = 0;
            while (frames < 10) {
                let image = await loadImage(pathFoFile);
                ctx.clearRect(0, 0, image.width, image.height);
                ctx.drawImage(image, 0, 0);
                encoder.addFrame(ctx);
                frames++;
            }
            
            encoder.finish();
            res.json('success')
        });
    });
});

app.listen(3000, () => console.log('server running on port 3000'));