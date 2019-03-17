const {createCanvas, loadImage, Image} = require('canvas');

module.exports = {
    cloneCanvas: (oldCanvas) => {
        var newCanvas = createCanvas(oldCanvas.width, oldCanvas.height);
        var context = newCanvas.getContext('2d');
        context.drawImage(oldCanvas, 0, 0);
        return newCanvas;
    },
    inside: function (point, vs) {
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
    },
    getMap: function (lip) {
        
        let downLipX = lip.map(pixel => pixel.x);
        let downLipY = lip.map(pixel => pixel.y);
        let downLipMinX = Math.min(...downLipX);
        let downLipMaxX = Math.max(...downLipX);
        let downLipMinY = Math.min(...downLipY);
        let downLipMaxY = Math.max(...downLipY);
        let polygon = lip.map(item => [item.x, item.y]);
        let map = [];
        for (let y = downLipMinY; y <= downLipMaxY; y++) {
            for (let x = downLipMinX; x <= downLipMaxX; x++) {
                if (this.inside([x, y], polygon)) {
                    map.push({x: x, y: y});
                }
            }
        }
        
        return map;
    }
}