const ffmpeg = require('fluent-ffmpeg'),
    fs = require('fs');

module.exports = {
    
    /** Получить часть видео **/
    part: (fileName, uploadFolder) => {
        new Promise((resolve, reject) => {
            
            if (!fs.existsSync(uploadFolder + fileName)) {
                throw new Error('Селфи с говоряшим ртом не найдено');
            }
            
            try {
                var newFilename = 'slice' + fileName;
                ffmpeg(uploadFolder + fileName)
                    .outputOptions([
                        '-c copy',
                        '-t 00:00:01.0'
                    ])
                    .save(uploadFolder + newFilename)
                    .on('end', () => resolve(uploadFolder + newFilename));
                
            } catch (e) {
                reject(e);
            }
        })
    }
}