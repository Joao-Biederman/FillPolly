const canvas = document.getElementById('fill_polly_canvas');
const context = canvas.getContext("2d");

const delete_all_button = document.getElementById('delete-all-btn');
const triangle_list = document.getElementById('triangles');

let triangle_count = 0;
let dots_count = 0;
let triangles = [];

function clear_canvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

function random_color() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return {
    r: r,
    g: g,
    b: b
  };
}

function get_rgb(color) {
  return `rgb(${color.r},${color.g},${color.b})`
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(color) {
  return `#${componentToHex(color.r)}${componentToHex(color.g)}${componentToHex(color.b)}`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16)
  } : null;
}


function draw_triangles() {
  triangles.forEach(triangle => {
    triangle.fill_polly();
  });
}

function remove_triangle(id) {
  let index = 0;
  triangles.forEach((triangle, i) => {
    if (triangle.id == id) {
      index = i;
    }
  });
  triangles.splice(index, 1);
}

function delete_all_triangles() {
  triangle_list.innerHTML = "";
  triangles = [];
  triangle_count = 0;
  dots_count = 0;
  clear_canvas();
}

function redraw_canvas() {
  clear_canvas();
  draw_triangles();
}

function add_to_triangle_list(triangle) {
  triangles.push(triangle);

  const li_triangle = document.createElement("li");
  const delete_button = document.createElement("button");

  delete_button.innerText = "Delete";

  delete_button.addEventListener("click", (event) => {
    const closest_li = event.target.closest('li');
    remove_triangle(closest_li.id);
    triangle_list.removeChild(closest_li);
    redraw_canvas();
  })

  let color0 = document.createElement("input");
  color0.type = "color";
  color0.value = rgbToHex(triangle.vertices[0].color);
  color0.addEventListener("change", change_color)
  color0.id = triangle_count;
  color0.className = 0;

  let color1 = document.createElement("input");
  color1.type = "color";
  color1.value = rgbToHex(triangle.vertices[1].color);
  color1.addEventListener("change", change_color)
  color1.id = triangle_count;
  color1.className = 1;

  let color2 = document.createElement("input");
  color2.type = "color";
  color2.value = rgbToHex(triangle.vertices[2].color);
  color2.addEventListener("change", change_color)
  color2.id = triangle_count;
  color2.className = 2;

  let color3 = document.createElement("input")
  color3.type = "color";
  color3.value = rgbToHex(triangle.edge_color);
  color3.addEventListener("change", change_edge)
  color3.id = triangle_count;

  li_triangle.setAttribute("id", triangle.id);
  li_triangle.innerHTML = `Triangle ${triangle.id}`;
  li_triangle.appendChild(color0);
  li_triangle.appendChild(color1);
  li_triangle.appendChild(color2);
  li_triangle.appendChild(color3);
  li_triangle.appendChild(delete_button);
  triangle_list.appendChild(li_triangle);
}

function change_color(event) {
  triangles.forEach(triangle => {
    if (triangle.id == event.target.id){
      triangle.change_dot(hexToRgb(event.target.value), event.target.className);
      redraw_canvas();
      return
    }
  })
}

function change_edge(event) {
  triangles.forEach(triangle => {
    if (triangle.id == event.target.id){
      triangle.set_edge_color(hexToRgb(event.target.value));
      redraw_canvas();
      return
    }
  })
}

function paint(x, y, color) {
  context.fillStyle = get_rgb(color);
  context.fillRect(x, y, 1, 1);
}

class dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.color = random_color()
  }

  set_color(color) {
    this.color = color;
    this.draw();
  }

  draw() {
    context.fillStyle = get_rgb(this.color);

    context.beginPath();
    context.arc(this.x, this.y, 4, 0, 2 * Math.PI);
    context.fill();
  }
}

class triangle {
  constructor(dot, id) {
    this.id = id;
    this.edge_color = {r: 0, g: 0, b: 0};
    this.vertices = [];
    this.minY = Number.POSITIVE_INFINITY;
    this.maxY = Number.NEGATIVE_INFINITY;
    this.add_dot(dot);
    this.intersection = new Map()
  }

  add_dot(new_dot) {
    this.vertices.push(new_dot);
    if (new_dot.y > this.maxY) this.maxY = new_dot.y;
    if (new_dot.y < this.minY) this.minY = new_dot.y;
    new_dot.draw();

    if (this.vertices.length == 3) this.fill_polly();
  }

  set_edge_color(color) {
    this.edge_color = color;
  }

  change_dot(color, id) {
    this.vertices[id].set_color(color);
  }

  update_triangle(colors) {
    for (let i = 0; i < 3; i++) {
      this.change_dot(colors[i], i);
    }
    this.set_edge_color(colors[3]);
  }

  define_edges() {
    for (let i = 0; i < 3; i++) {
      let initialY, endY;
      let currentX, currentColor;

      const next_vertex = this.vertices[(i + 1) % 3];

      let y_diference = next_vertex.y - this.vertices[i].y;

      const variation = (next_vertex.x - this.vertices[i].x) / y_diference;
      const variationR = (next_vertex.color.r - this.vertices[i].color.r) / y_diference;
      const variationG = (next_vertex.color.g - this.vertices[i].color.g) / y_diference;
      const variationB = (next_vertex.color.b - this.vertices[i].color.b) / y_diference;

      if (this.vertices[i].y < next_vertex.y) {
        initialY = this.vertices[i].y;
        endY = next_vertex.y;
        currentX = this.vertices[i].x;

        currentColor = { r: this.vertices[i].color.r, g: this.vertices[i].color.g, b: this.vertices[i].color.b };
      } else {
        initialY = next_vertex.y;
        endY = this.vertices[i].y;
        currentX = next_vertex.x;

        currentColor = { r: next_vertex.color.r, g: next_vertex.color.g, b: next_vertex.color.b };
      }

      for (let currentY = initialY; currentY < endY; currentY++) {
        this.intersection.get(currentY).push({ x: currentX, color: currentColor });
        currentX += variation;
        let newColor = {
          r: currentColor.r + variationR,
          g: currentColor.g + variationG,
          b: currentColor.b + variationB
        };
        currentColor = newColor;
      }

    }
  }

  draw_edges() {
    context.strokeStyle = get_rgb(this.edge_color);
    context.beginPath();
    context.moveTo(this.vertices[0].x, this.vertices[0].y);
    context.lineTo(this.vertices[1].x, this.vertices[1].y);
    context.lineTo(this.vertices[2].x, this.vertices[2].y);
    context.lineTo(this.vertices[0].x, this.vertices[0].y);
    context.stroke();

  }

  draw_dots() {
    this.vertices.forEach(dot => {
      dot.draw();
    });
  }

  sortIntersectionX() {
    this.intersection.forEach((sortX) => {
      const sortedX = sortX.slice().sort((a, b) => a.x - b.x);

      sortX.splice(0, sortX.length, ...sortedX);
    });
  }

  fill_polly() {
    this.draw_dots();
    this.draw_edges();
    for (let y = this.minY; y < this.maxY; y++) {
      this.intersection.set(y, [])

    }
    this.define_edges();
    this.sortIntersectionX();

    for (let currentY = this.minY; currentY < this.maxY; currentY++) {
      const current_line = this.intersection.get(currentY);
      let k = 0;
      let color = current_line[k].color;

      do {
        let firstX = Math.ceil(current_line[k].x);
        let endX = Math.floor(current_line[k + 1].x);

        const variationR = (current_line[k + 1].color.r - current_line[k].color.r) / (endX - firstX);
        const variationG = (current_line[k + 1].color.g - current_line[k].color.g) / (endX - firstX);
        const variationB = (current_line[k + 1].color.b - current_line[k].color.b) / (endX - firstX);
        for (let currentX = firstX; currentX < endX; currentX++) {
          paint(currentX, currentY, color);
          let newColor = { r: color.r + variationR, g: color.g + variationG, b: color.b + variationB };
          color = newColor;
        }

        k += 2;
      } while (current_line[k]);
    }
  }
}

canvas.addEventListener("click", (event) => {
  let rect = canvas.getBoundingClientRect()
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  let new_dot = new dot(x, y);
  if (dots_count === 0) {
    new_triangle = new triangle(new_dot, triangle_count);

    dots_count++;
    return;
  }
  
  if (dots_count !== 0) {
    new_triangle.add_dot(new_dot)
    
    dots_count++;
  }
  
  if (dots_count == 3) {
    // new_triangle.draw_edges();
    add_to_triangle_list(new_triangle);
    triangle_count++;
    dots_count = 0;
    return
  }

});

delete_all_button.addEventListener("click", (event) => {
  delete_all_triangles();
  return
})