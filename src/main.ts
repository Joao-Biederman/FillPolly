import './style.css'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <button id="toggleWindow" aria-label="Toggle Specs">Alterar Especificações</button>

  <div id="floatingWindow" class="floating-window" style="display: none;">
    <div class="header">
      <h2>Especificações do Trabalho</h2>
    </div>
    <div class="content">
      <p>1. Algoritmo Criado utilizando algoritmo incremental (obrigatório)</p>
      <p>2. Qualquer tipo de poligono pode ser criado</p>
      <p>3. Pode desenhar um ou mais poligonos na tela</p>
      <p>4. Os poligonos podem ser selecionados clickando nos mesmo (não implementado)</p>
      <p>5. O usuário pode selecionar um poligono e trocar sua cor (obrigatório)</p>
      <p>6. Apenas os pixeis presentes na região interna do poligono podem ser pintados (obrigatório)</p>
      <p>7. O usuário pode escolhar pintar ou não as arestas</p>
      <p>8. Poligonos podem ser excluídos</p>
    </div>
    <div class="header">
      <h2>Ajuda</h2>
    </div>
    <div class="content">
      <ul>
        <li>Enter: Alterar especificações e ajuda</li>
        <li>Espaço: Criar poligono</li>
        <li>Delete: Deletar pontos sem poligono</li>
        <li>Shift+Delete: Deletar ùltimo </li>
      </ul>
    </div>
  </div>

  <div class="workspace">
    <canvas id="fill_polly_canvas" width="600" height="600"></canvas>
    <div class="canvas_options">
      <div class="polygons-table">
        <ul id="polygons">

        </ul>
      </div>
    <div class="btn-div">
      <button id="delete-all-btn" class="btn">Limpar Canvas</button>
      <button id="creat-poly-btn" class="btn">Criar Poligonos</button>
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
let new_polygon = new Polygon(polygon_count);

polygons = []

function clear_canvas() {
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function draw_polygons() {
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
  if (new_polygon.vertex.length > 0 && context) {
    new_polygon.draw_dots(context);
  }
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

  console.log(polygon.color.get_rgb(), polygon.color.rgbToHex());

  const polygon_color = document.createElement("input");
  polygon_color.type = "color";
  polygon_color.value = polygon.color.rgbToHex();
  polygon_color.addEventListener("change", (event) => {
    change_color(event);
  })
  polygon_color.id = String(new_polygon.id);

  const polygon_show_edge = document.createElement("input");
  polygon_show_edge.type = "checkbox";
  polygon_show_edge.checked = true;
  polygon_show_edge.addEventListener('change', () => {
    polygon.update_show_edge(polygon_show_edge.checked)
    redraw_canvas();
  });

  li_polygon.setAttribute("id", String(polygon.id));
  li_polygon.innerHTML = `polygon ${polygon.id}`;
  li_polygon.appendChild(polygon_color);
  li_polygon.appendChild(polygon_show_edge);
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
    console.log(polygon.id, Number(event.target.id));
    
    if (polygon.id === Number(event.target.id)) {
      const new_color = hexToRgb(event.target.value);
      console.log(new_color);
      
      if (!new_color) {
        return;
      }
      polygon.update_color(new_color);
      redraw_canvas();
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
    new_polygon.add_dot(new_dot)
    dots_count++;
    return;
  }
  
  if (dots_count !== 0) {
    new_polygon.add_dot(new_dot)
    dots_count++;
  }
});

delete_all_button?.addEventListener("click", () => {
  delete_all_polygons();
  return
})

function check_polygon_creation() {
  if (dots_count >= 3) {
    add_to_polygon_list(new_polygon);
    new_polygon = new Polygon(polygon_count)
  } else {
    notyf.error('Insufficient dots to create a polygon');
  }
  return;
}

function delete_last_polygon() {
  if (polygon_count < 1) {
    return;
  }

  const list = document.getElementById('polygons') as HTMLUListElement;
  if (list?.lastElementChild) {
    list.removeChild(list.lastElementChild);
  }
  polygons.pop();
  redraw_canvas();
}

function delete_dots() {
  dots_count = 0;
  new_polygon = new Polygon(polygon_count);
  redraw_canvas();
}

creat_poly_btn?.addEventListener("click", () => {
  check_polygon_creation()
})

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    check_polygon_creation();
    return;
  }

  if (event.code === "Backspace")
  {
    if (event.shiftKey) {
      delete_last_polygon();
    } else {
      delete_dots();
    }
    return;
  }

  if (event.key === "Enter") {
    toggleVisibility();
  }
})

const floatingWindow = document.getElementById('floatingWindow') as HTMLDivElement;
const toggleButton = document.getElementById('toggleWindow') as HTMLButtonElement;

let isVisible = false;

// Function to toggle visibility
function toggleVisibility() {
    if (isVisible) {
        floatingWindow.style.display = "none";
        isVisible = false;
    } else {
        floatingWindow.style.display = "block";
        isVisible = true;
    }
}

toggleButton.addEventListener('click', () => {
  toggleVisibility();
})