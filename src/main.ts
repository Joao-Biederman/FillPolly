import './style.css'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
   <div class="workspace">
        <canvas id="fill_polly_canvas" width="600" height="600"></canvas>
        <div class="canvas_options">
            <div class="polygons-table">
                <ul id="polygons">

                </ul>
            </div>
            <div class="btn-div">
                <button id="delete-all-btn" class="btn">Clear canvas</button>
                <button id="creat-poly-btn" class="btn">Create Polygon</button>
            </div>
        </div>
    </div>
`
import { Dot } from "./Script/dot.ts";
import { Polygon } from "./Script/polygon.ts";
import { hexToRgb } from "./Script/color.ts";

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import the Notyf CSS

const notyf = new Notyf();

const canvas = document.getElementById('fill_polly_canvas') as HTMLCanvasElement;

const context = canvas.getContext("2d");

const polygon_list = document.getElementById('polygons') as HTMLUListElement;

const delete_all_button = document.getElementById('delete-all-btn');
const creat_poly_btn = document.getElementById("creat-poly-btn");

let polygon_count = 0;
let dots_count = 0;
let polygons: Polygon[];
let new_polygon: Polygon;

polygons = []

function clear_canvas() {
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function draw_polygons() {
  if (!context) {
    return
  }

  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];
    polygon.fill_polly(context);
  }
}

function delete_all_polygons() {
  polygon_list.innerHTML = "";
  polygons = [];
  polygon_count = 0;
  dots_count = 0;
  clear_canvas();
}

function redraw_canvas() {
  clear_canvas();
  draw_polygons();
}

function remove_polygon(id: number) {
  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];
    if (polygon.id === id) {
      polygons.splice(i, 1)
    }
  }
}

function add_to_polygon_list(polygon: Polygon) {
  polygons.push(polygon);
  
  const li_polygon = document.createElement("li");
  const delete_button = document.createElement("button");

  delete_button.innerText = "Delete";

  delete_button.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target) {
      const closest_li = target.closest('li');
      if (closest_li) {
        remove_polygon(Number(closest_li.id));
        polygon_list.removeChild(closest_li);
        redraw_canvas();
      }
    }
  })

  const polygon_color = document.createElement("input");
  polygon_color.type = "color";
  polygon_color.value = polygon.color.rgbToHex();
  polygon_color.addEventListener("change", change_color)
  polygon_color.id = String(polygon_count);

  const polygon_show_edge = document.createElement("input");
  polygon_show_edge.type = "checkbox";
  polygon_show_edge.addEventListener('change', () => {
    console.log(`${polygon_show_edge.checked ? 'checked' : 'unchecked'}`);
    polygon.update_show_edge(polygon_show_edge.checked)
  });

  li_polygon.setAttribute("id", String(polygon.id));
  li_polygon.innerHTML = `polygon ${polygon.id}`;
  li_polygon.appendChild(polygon_color);
  li_polygon.appendChild(delete_button);
  polygon_list.appendChild(li_polygon);

  polygon_count++;
  dots_count = 0;
  if (context) {
    polygon.fill_polly(context);
  }
}

function change_color(event: any) {
  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];
    if (polygon.id === Number(event.target.id)) {
      const new_color = hexToRgb(event.target.value);
      if (!new_color) {
        return;
      }
      polygon.update_color(new_color);
      return;
    }
  }
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const new_dot = new Dot(x, y);
  if (context) {
    new_dot.draw(context)
  }
  if (dots_count === 0) {
    new_polygon = new Polygon(new_dot, polygon_count);
    dots_count++;
    return;
  }
  
  if (dots_count !== 0) {
    new_polygon.add_dot(new_dot)
    dots_count++;
  }
});

delete_all_button.addEventListener("click", () => {
  delete_all_polygons();
  return
})

creat_poly_btn?.addEventListener("click", () => {
  if (dots_count >= 3) {
    add_to_polygon_list(new_polygon);
  } else {
    notyf.error('Insufficient dots to create a polygon');
  }
  return;
})