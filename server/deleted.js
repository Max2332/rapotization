app.get('/', (req, res) => {
    
    
    request.post('http://api-soft.photolab.me/template_process.php',
        {
            form: {
                image_url: "https://peopletalk.ru/wp-content/uploads/2017/08/selfi.jpg",
                template_name: "2162"
            }
        },
        async function (error, response, body) {
            
            /** Даем обработать фотку фотолабу **/
            sleep.sleep(2);
            const fileName = crypto.randomBytes(18).toString('hex') + ".mp4";
            const uploadPath = __dirname + "/../upload/";
            const file = fs.createWriteStream(uploadPath + fileName);
            
            await http.get(body, async (response) => {
                
                /** После того как файл сохранился на сервер **/
                response.pipe(file).on('finish', () => {
                    ffmepgHelper.part(fileName, uploadPath);
                    res.json(fileName);
                });
            });
        }
    );
});