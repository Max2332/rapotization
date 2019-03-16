const
    //system
    express = require('express'),
    cors = require('cors'),
    app = express(),
    {createCanvas, loadImage, Image} = require('canvas'),
    GIFEncoder = require('gifencoder'),
    multer = require('./fabrics/multerFabric');

app.use(cors());

app.post('/', (req, res) => {
    // Загрузка файла
    multer('file')(req, res, async (err) => {
        // Если файл не смогли загрузить то ошибка
        if (err) {
            return res.status(500).send('Something broke!');
        }
    })
});

app.listen(3000, () => console.log('server running on port 3000'));