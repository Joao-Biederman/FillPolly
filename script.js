const getTheme = () => {
  const theme = localStorage.getItem('theme');
  theme && setTheme(theme);
}

const setTheme = (theme) => {
  document.documentElement.className = theme;
  localStorage.setItem('theme', theme);
}

const changeTheme = () => {
  
  if (localStorage.getItem('theme') === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

getTheme();

const getDots = () => {
  return JSON.parse(localStorage.getItem('dots'));
}

const setDots = (dots) => {
  localStorage.setItem('dots', JSON.stringify(dots));
}

function deleteFirst() {
  var dotList = getDots();
  for (let i = 0; i < 3; i++) {
    if (dotList.length < 1) {
      break;
    }
    dotList.shift();
  }
  setDots(dotList);
  
  var canvas = document.getElementById('fill_polly_canvas');
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  dotList.forEach(dot => {
    drawDot(context, dot.x, dot.y, dot.color)
  });

  
  if (dotList.length >= 3) {
    drawTriangles(context, dotList);
  }
}

const deleteAll = () => {
  let dotList = [];
  setDots(dotList);

  var canvas = document.getElementById('fill_polly_canvas');
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const drawDot = (context, x, y, color) => {
  context.fillStyle = color;

  context.beginPath();
  context.arc(x, y, 4, 0, 2 * Math.PI);
  context.fill();
}

const drawTriangles = (context, points) => {
  context.lineWidth = 4;
  
  for (var i = 0; i < points.length - 2; i += 3) {
    let gradient = context.createLinearGradient(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
    gradient.addColorStop(0.5, points[i].color);
    gradient.addColorStop(1, points[i+1].color);
    drawLine(context, points[i], points[i+1], gradient)

    gradient = context.createLinearGradient(points[i+1].x, points[i+1].y, points[i+2].x, points[i+2].y);
    gradient.addColorStop(0.5, points[i+1].color);
    gradient.addColorStop(1, points[i+2].color);
    drawLine(context, points[i+1], points[i+2], gradient)

    gradient = context.createLinearGradient(points[i].x, points[i].y, points[i+2].x, points[i+2].y);
    gradient.addColorStop(0.5, points[i].color);
    gradient.addColorStop(1, points[i+2].color);
    drawLine(context, points[i], points[i+2], gradient)
  }
  
  // context.lineWidth = 1;
}

const drawLine = (context, point1, point2, color) => {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(point1.x, point1.y);
  context.lineTo(point2.x, point2.y);
  context.stroke();
}

const mixColors = (color1, color2) => {
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

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById('fill_polly_canvas');
            
  var ctx = canvas.getContext("2d");

  function Dot(x, y){
    this.x = x;
    this.y = y;
  };

  canvas.addEventListener("click", function (event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;
    var color = getRandomColor();
    var dotList = getDots();

    dotList.push({x:x, y:y, color: color});

    drawDot(ctx, x, y, color);

    setDots(dotList);
    
    if (dotList.length >= 3) {
      drawTriangles(ctx, dotList);
    }
  });

  function getRandomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    
    var rgbColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    
    return rgbColor;
  }
});