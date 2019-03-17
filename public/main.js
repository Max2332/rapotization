//const url = 'http://localhost:900';
/*$(document).ready(function() {
  $('#loadForm').submit(function (e) {
    e.preventDefault();
    let $input = $(this).find('[name="file"]');
    let fd = new FormData;
    fd.append('file', $input[0].files[0]);

    let data = {
      name: $(this).find('[name="message"]').val(),
      file: fd,
    };
    console.log(data);
  });

  function sendData(data) {
    $.ajax({
      url: url + '/get',
      data: data,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (result) {
        console.log(result);
      }
    });
  }
  setup();
  draw();
});*/

let map = [
  {
    value: 'anger',
    key: 2085,
    ourKey: 10000201,
  },
  {
    value: 'fear',
    key: 2088,
    ourKey: 10000207,
    googleScore: [2, 9],
  },
  {
    value: 'afraid',
    key: 10000200,
  },
  {
    value: 'confused',
    key: 10000203,
    googleScore: [15, 35],
  },
  {
    value: 'desire',
    key: 10000204,
  },
  {
    value: 'disgust',
    key: 2087,
    ourKey: 10000205,
  },
  {
    value: 'excitement',
    key: 10000206,
  },
  {
    value: 'flirting',
    key: 10000208,
  },
  {
    value: 'frown',
    key: 10000209,
  },
  {
    value: 'glare',
    key: 10000210,
  },
  {
    value: 'happy',
    key: 10000211,
    googleScore: [65, 100],
  },
  {
    value: 'pain',
    key: 10000212,
  },
  {
    value: 'sad',
    key: 2090,
    ourKey: 10000198,
    googleScore: [1, 10],
  },
  {
    value: 'scream',
    key: 10000196,
  },
  {
    value: 'shock',
    key: 10000195,
  },
  {
    value: 'concentrate',
    key: 10000202
  }
];

curl -v -X POST "http://upload-soft.photolab.me/upload.php" \
  -F file1=@./girl.jpg \
  -F no_resize=1


curl -v -X POST "http://api-soft.photolab.me/template_process.php" \
    -F image_url[1]=http://soft.photolab.me/samples/girl.jpg \
-F rotate[1]=0 \
    -F flip[1]=0 \
    -F crop[1]=0,0,1,1 \
    -F template_name="SOME_TEMPLATE_NAME"