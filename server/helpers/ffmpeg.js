const crypto = require('crypto'),
    exec = require('await-exec'),
    spawn = require('child_process').spawn,
    fs = require('fs');

module.exports = {
    glueMp3WithImg: async (mp3Path, jpgPath) => {
        const fileName = crypto.randomBytes(18).toString('hex');
        const mp4Path = `${__dirname}/../../upload/${fileName}.mp4`;
        console.log(`ffmpeg -loop 1 -i ${jpgPath} -i ${mp3Path} -c:a copy -shortest ${mp4Path}`);
        await exec(`ffmpeg -loop 1 -i ${jpgPath} -i ${mp3Path} -c:a copy -shortest ${mp4Path}`);
        return mp4Path;
    },
    glueMovWithGif: async (mp4PathWithoutGif, gifPath, seconds) => {
        const fileName = crypto.randomBytes(18).toString('hex');
        const mp4Path = `${__dirname}/../../upload/${fileName}.mp4`;
        let pointBetween = '';
        for (var i = 0; i < seconds.length; i++) {
            pointBetween += `between(t,${seconds[i]},${seconds[i] + 2})`;
            if (i + 1 < seconds.length) {
                pointBetween += ' + ';
            }
        }
        let command = `ffmpeg -y -i ${mp4PathWithoutGif} -ignore_loop 0 -i ${gifPath} -filter_complex "overlay=shortest=1:enable='${pointBetween}'" -vcodec mpeg2video -strict -2 ${mp4Path}`;
        console.log(command);
        await exec(command);
        return mp4Path
    }
}