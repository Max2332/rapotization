canvasHelper = require('./canvas'),
    GIFEncoder = require('gifencoder'),
    faceHelper = require('./face'),
    fr = require('face-recognition'),
    {createCanvas, loadImage, Image} = require('canvas');


module.exports = {
    generateGif: (pathFoFile) => {
        
        const faceImg = fr.loadImage(pathFoFile);
        const predictor = fr.FaceLandmark68Predictor();
        const detector = new fr.FrontalFaceDetector();
        const faceRect = detector.detect(faceImg).pop();
        let facePoints = predictor.predict(faceImg, faceRect).getParts();
        facePoints.unshift({}); // ! очень важно
        const facePart = faceHelper.foramt(facePoints);
        
        let canvasImg = await
        loadImage(pathFoFile);
        const canvas = createCanvas(canvasImg.width, canvasImg.height);
        const ctx = canvas.getContext('2d');
        const encoder = new GIFEncoder(canvasImg.width, canvasImg.height);
        const lipPixels = canvasHelper.getMap(facePart.downLip);
        const frames = [];
        
        const gifFileName = crypto.randomBytes(18).toString('hex') + '.gif';
        const uploadFolder = __dirname + "/../../upload";
        const pathFoGifFile = uploadFolder + '/' + gifFileName;
        
        encoder.createReadStream().pipe(fs.createWriteStream(pathFoGifFile));
        encoder.start();
        encoder.setQuality(5);
        encoder.setRepeat(0);
        encoder.setDelay(10);
        
        ctx.clearRect(0, 0, canvasImg.width, canvasImg.height);
        ctx.drawImage(canvasImg, 0, 0);
        
        for (var j = 0; j < 20; j++) {
            
            lipPixels.forEach(pixel => pixel.y = pixel.y + (j === 0 ? 0 : 1));
            let yPixels = lipPixels
                .map(item => item.y)
                .filter((item, i, ar) => ar.indexOf(item) === i)
                .sort((a, b) => b - a);
            
            yPixels.forEach(y => {
                let xPixels = lipPixels
                    .map(item => item.y === y ? item.x : null)
                    .filter(item => item !== null);
                
                xPixels.forEach(x => {
                    
                    let oldPixelData = ctx.getImageData(x, y, 1, 1).data;
                    ctx.fillStyle = `rgba(${oldPixelData[0]},${oldPixelData[1]},${oldPixelData[2]},${255})`;
                    ctx.fillRect(x, y + 1, 1, 1);
                    
                    ctx.fillStyle = `rgba(${0},${0},${0},${255})`;
                    ctx.fillRect(x, y, 1, 1);
                })
            });
            frames.push(canvasHelper.cloneCanvas(canvas));
        }
        
        /** Открываем рот */
        for (var i = 0; i < frames.length; i += 3) {
            let canvas = frames[i];
            let ctx = canvas.getContext('2d');
            encoder.addFrame(ctx);
        }
        
        /** Закрываем рот */
        for (var i = frames.length - 1; i > 0; i -= 3) {
            let canvas = frames[i];
            let ctx = canvas.getContext('2d');
            encoder.addFrame(ctx);
        }
        
        encoder.finish();
        return pathFoGifFile;
    }
}