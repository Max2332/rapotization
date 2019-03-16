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
    ffmepgHelper = require('./helpers/ffmpeg'),
    app = express();

app.use(cors());

app.get('/', (req, res) => {
    const image2 = fr.loadImage('path/to/image2.jpg')
});

app.listen(3000, () => console.log('server running on port 3000'));