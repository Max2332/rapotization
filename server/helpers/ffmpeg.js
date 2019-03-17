const crypto = require('crypto'),
    spawn = require('child_process').spawn,
    fs = require('fs');

module.exports = {
    glueMp3WithImg: (mp3Path, jpgPath) => {
        new Promise(function (resolve, reject) {
            const fileName = crypto.randomBytes(18).toString('hex');
            const mp4Path = `${__dirname}/../upload/${fileName}.mp4`;
            let ffmpeg = spawn(`ffmpeg -i ${mp3Path} -ignore_loop 0 -i ${jpgPath} -vf setpts=0.3*PTS -shortest -strict -2 ${mp4Path}`);
            ffmpeg.on('exit', (statusCode) => {
                if (statusCode === 0) {
                    resolve(mp4Path)
                }
            });
        });
        
    },
    glueMovWithGif: (mp4Path, gifPath, secondes) => {
        new Promise(function (resolve, reject) {
            const fileName = crypto.randomBytes(18).toString('hex');
            const mp4Path = `${__dirname}/../upload/${fileName}.mp4`;
            let pointBetween = '';
            for (var i = 0; i < secondes.length; i++) {
                pointBetween += `between(t,${secondes[i]},${secondes[i] + 2})`;
                if (i + 1 < secondes.length) {
                    pointBetween += ' + ';
                }
            }
            let command = `ffmpeg -y -i ${mp4Path} -ignore_loop 0 -i ${gifPath} -filter_complex "overlay=shortest=1:enable='${pointBetween}'" -vcodec mpeg2video -strict -2 ${mp4Path}`;
            let ffmpeg = spawn(command);
            ffmpeg.on('exit', (statusCode) => {
                if (statusCode === 0) {
                    resolve(mp4Path)
                }
            });
        });
        
    }
}