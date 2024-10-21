import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import { Dot } from "./dot.ts";
import { Polygon } from "./polygon.ts";
import type { Color } from "./color.ts";
import { hexToRgb } from "./color.ts";

const canvas = document.getElementById('fill_polly_canvas');
const context = canvas.getContext("2d");

const polygon_list = document.getElementById('polygons');

const delete_all_button = document.getElementById('delete-all-btn');
const creat_poly_btn = document.getElementById("creat-poly-btn");

let polygon_count = 0;
let dots_count = 0;
let polygons: Polygon[];
let new_polygon: Polygon;

function clear_canvas() {
context.clearRect(0, 0, canvas.width, canvas.height)
}

function draw_polygons() {
  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];
    polygon.fill_polly();
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

function delete_all_polygons() {
  polygon_list.innerHTML = "";
  polygons = [];
  polygon_count = 0;
  dots_count = 0;
  clear_canvas();
}

function add_to_polygon_list(polygon: Polygon) {
  polygons.push(polygon);

  const li_polygon = document.createElement("li");
  const delete_button = document.createElement("button");

  delete_button.innerText = "Delete";

  delete_button.addEventListener("click", (event) => {
    const closest_li = event.target.closest('li');
    remove_polygon(closest_li.id);
    polygon_list.removeChild(closest_li);
    redraw_canvas();
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

function paint(x:number, y:number, color:Color) {
  context.fillStyle = color.get_rgb();
  context.fillRect(x, y, 1, 1);
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const new_dot = new Dot(x, y);
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

delete_all_button.addEventListener("click", (event) => {
  delete_all_polygons();
  return
})

creat_poly_btn?.addEventListener("click", (event) => {
  if (dots_count > 3) {
    toastr.warning('Insuficient Dots!', 'Warning');
  } else {
    add_to_polygon_list(new_polygon);
  }
  return;
})