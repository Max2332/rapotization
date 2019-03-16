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


function setup() {
  let width = 1000;
  createCanvas(width, 1000);
  pixelDensity(1);
  background(100);

  let map = getMap();

  loadPixels();

  map.forEach(pixel => {
    let index = (pixel.x + pixel.y * width) * 4;
    pixels[index] = 0;
    pixels[index + 1] = 0;
    pixels[index + 2] = 0;
    pixels[index + 3] = 255;
  });

  // вычисляемое свойство
  let downCounter = 10;
  for (let j = 0; j < downCounter; j++) {
    map.forEach(pixel => pixel.y = pixel.y + (j === 0 ? 0 : 1));

    let yPixels = map
      .map(item => item.y)
      .filter((item, i, ar) => ar.indexOf(item) === i)
      .sort((a, b) => b - a);

    yPixels.forEach(y => {
      let xPixels = map
        .map(item => item.y === y ? item.x : null)
        .filter(item => item !== null);

      xPixels.forEach(x => {
        let newY = y + 1;
        let index = (x + y * width) * 4;
        let newIndex = (x + newY * width) * 4;

        let oldPixelData = {
          r: pixels[index],
          g: pixels[index + 1],
          b: pixels[index + 2],
          a: pixels[index + 3],
        };

        pixels[index] = 30;
        pixels[index + 1] = 30;
        pixels[index + 2] = 30;
        pixels[index + 3] = 255;

        pixels[newIndex] = oldPixelData.r;
        pixels[newIndex + 1] = oldPixelData.g;
        pixels[newIndex + 2] = oldPixelData.b;
        pixels[newIndex + 3] = oldPixelData.a;
      })
    });
  }

  updatePixels();
}

function getMap(area) {
  let lips = [
    {"y": 296, "x": 288},
    {"y": 308, "x": 307},
    {"y": 313, "x": 323},
    {"y": 315, "x": 336},
    {"y": 313, "x": 349},
    {"y": 308, "x": 365},
    {"y": 293, "x": 382},
    {"y": 293, "x": 377},
    {"y": 303, "x": 348},
    {"y": 304, "x": 335},
    {"y": 303, "x": 323},
    {"y": 295, "x": 295}
  ];
  let downLipX = lips.map(pixel => pixel.x);
  let downLipY = lips.map(pixel => pixel.y);
  let downLipMinX = Math.min(...downLipX);
  let downLipMaxX = Math.max(...downLipX);
  let downLipMinY = Math.min(...downLipY);
  let downLipMaxY = Math.max(...downLipY);
  let polygon = lips.map(item => [item.x, item.y]);
  let map = [];
  for (let y = downLipMinY; y <= downLipMaxY; y++) {
    for (let x = downLipMinX; x <= downLipMaxX; x++) {
      if (inside([x, y], polygon)) {
        map.push({x: x, y: y});
      }
    }
  }

  return map;
}

function inside(point, vs) {
  let x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i][0], yi = vs[i][1];
    let xj = vs[j][0], yj = vs[j][1];
    let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}
