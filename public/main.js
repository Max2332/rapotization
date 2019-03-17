const url = 'http://localhost:900';
$(document).ready(function() {
  $('#loadForm').submit(function (e) {
    e.preventDefault();
    let $input = $(this).find('[name="file"]');
    let fd = new FormData;
    fd.append('file', $input[0].files[0]);

    let data = {
      name: $(this).find('[name="message"]').val(),
      file: fd,
    };
    sendData(data);
  });

  function sendData(data) {
    $.ajax({
      url: url + '/get',
      data: data,
      processData: false,
      contentType: false,
      type: 'GET',
      success: function (result) {
        if (result) {
          $('#video').attr('src', result)
        }
      }
    });
  }
});
