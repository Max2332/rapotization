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
    },
    overlayTwoSounds: (voice, beat, voiceStartDelay) => {
        return new Promise((resolve, reject) => {
            
            const pathTuUpload = `${__dirname}/../../upload/`;
            const spawn = require('child_process').spawn;
            if (voiceStartDelay == 0) {
                var nowDate = Date.now();
                var fileName = pathTuUpload + nowDate + '.mp3';
                let ffmpeg = spawn('ffmpeg', ['-i', `${ voice }`, '-i', `${ beat }`,
                    '-filter_complex', 'amerge', '-ac', '2', '-c:a', 'libmp3lame', '-q:a', '4', fileName]);
                ffmpeg.on('exit', (statusCode) => {
                    if (statusCode === 0) {
                        resolve(fileName)
                    }
                });
                ffmpeg.stderr.on('data', function (data) {
                    console.log('grep stderr: ' + data);
                });
            } else {
                var blankAudioFileName = pathTuUpload + Date.now() + '.mp3';
                let ffmpeg = spawn('ffmpeg', ['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-t', '60',
                    '-q:a', '9', '-acodec', 'libmp3lame', blankAudioFileName]);
                
                ffmpeg.on('exit', (statusCode) => {
                    if (statusCode === 0) {
                        var blankAudioMergedWithVoiceFileName = pathTuUpload + Date.now() + '.mp3';
                        let ffmpeg2 = spawn('ffmpeg', ['-i', `${blankAudioFileName}`, '-i', `${voice}`,
                            '-filter_complex', 'aevalsrc=0:d=' + voiceStartDelay + ' [s1];[s1][1:a]concat=n=2:v=0:a=1[aout]', '-c:v', 'copy',
                            '-map', '0:v:?', '-map', '[aout]', blankAudioMergedWithVoiceFileName]);
                        ffmpeg2.stderr.on('data', function (data) {
                            console.log('grep stderr: ' + data);
                        });
                        ffmpeg2.on('exit', (statusCode, err) => {
                            if (statusCode === 0) {
                                var finalAudioName = pathTuUpload + Date.now() + '.mp3';
                                let ffmpeg3 = spawn('ffmpeg', ['-i', `${blankAudioMergedWithVoiceFileName}`, '-i', `${beat}`,
                                    '-filter_complex', 'amix=inputs=2:duration=shortest:dropout_transition=0', finalAudioName]);
                                ffmpeg3.stderr.on('data', function (data) {
                                    console.log('grep stderr: ' + data);
                                });
                                ffmpeg3.on('exit', (statusCode, err) => {
                                    if (statusCode === 0) {
                                        resolve(finalAudioName)
                                    }
                                });
                            }
                        });
                        
                    }
                });
                
            }
        });
    }
}