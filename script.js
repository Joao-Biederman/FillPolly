// Get the canvas element
document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById('fill_polly_canvas');
            
    var ctx = canvas.getContext("2d");

    function Dot(x, y){
        this.x = x;
        this.y = y;
    };

    var dotList = [];

    canvas.addEventListener("click", function (event) {
        // Get the click coordinates relative to the canvas
        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;
        var color = getRandomColor();

        dotList.push({x:x, y:y, color: color})

        drawDot(ctx, x, y, color);

        if (dotList.length >= 3) {
            connectDotsInTriangles(ctx, dotList);
        }
    });

    function getRandomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
      
        var rgbColor = 'rgb(' + r + ',' + g + ',' + b + ')';
      
        return rgbColor;
    }

    function drawDot(context, x, y, color){
        context.fillStyle = color;

        context.beginPath();
        context.arc(x, y, 4, 0, 2 * Math.PI);
        context.fill();
    };

    function connectDotsInTriangles(context, points) {
        context.lineWidth = 1;
        
        // Connect dots in triangles
        for (var i = 0; i < points.length - 2; i += 3) {
            colors = mixColors(points[i].color, points[i+1].color)
            connectDots(context, points[i], points[i+1], colors)
            colors = mixColors(points[i+1].color, points[i+2].color)
            connectDots(context, points[i+1], points[i+2], colors)
            colors = mixColors(points[i].color, points[i+2].color)
            connectDots(context, points[i], points[i+2], colors)
        }
    }

    function connectDots(context, point1, point2, color){
        context.lineWidth = 4;
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(point1.x, point1.y);
        context.lineTo(point2.x, point2.y);
        context.stroke();
    }

    function mixColors(color1, color2) {
        // Extract RGB components from color strings
        var rgb1 = color1.match(/\d+/g).map(Number);
        var rgb2 = color2.match(/\d+/g).map(Number);
      
        // Calculate the average of each component
        var mixedColor = 'rgb(' +
          Math.round((rgb1[0] + rgb2[0]) / 2) + ',' +
          Math.round((rgb1[1] + rgb2[1]) / 2) + ',' +
          Math.round((rgb1[2] + rgb2[2]) / 2) +
          ')';
      
        return mixedColor;
      }
});