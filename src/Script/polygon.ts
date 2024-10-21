import type { Dot } from '../dot.ts'
import { Color } from "./color.ts";
import { random_color } from './color.ts';


export class Polygon {
  id: number;
  edge_color: Color;
  color: Color;
  vertex: Dot[];
  maxY: number;
  minY: number;
  intersection: Map<number, {x: number, color: Color}[]>;

  show_edge: boolean;

  constructor(id: number){
    this.id = id;
    this.edge_color = new Color(255, 255, 0)
    this.color = random_color();
    this.vertex = [];
    this.maxY = Number.NEGATIVE_INFINITY;
    this.minY = Number.POSITIVE_INFINITY;
    this.intersection = new Map;
    this.show_edge = true;
  }

  add_dot(dot: Dot){
    this.vertex.push(dot)
    if (dot.y > this.maxY) {
      this.maxY = dot.y;
    }

    if (dot.y < this.minY) {
      this.minY = dot.y;
    }
  }

  update_show_edge(state : boolean) {
    this.show_edge = state;
  }

  update_color(color: Color) {
    this.color = color
  }

  define_edges() {
    const vertex_quantity = this.vertex.length;
    for (let i = 0; i < vertex_quantity; i++) {
      let initialY: number;
      let endY: number;
      let currentX: number;

      const next_vertex = this.vertex[(i + 1) % vertex_quantity];

      const y_diference = next_vertex.y - this.vertex[i].y;

      const variation = (next_vertex.x - this.vertex[i].x) / y_diference;

      if (this.vertex[i].y < next_vertex.y) {
        initialY = this.vertex[i].y;
        endY = next_vertex.y;
        currentX = this.vertex[i].x;
      } else {
        initialY = next_vertex.y;
        endY = this.vertex[i].y;
        currentX = next_vertex.x;
      }

      for (let currentY = initialY; currentY < endY; currentY++) {
        if (!this.intersection.has(currentY)) {
          this.intersection.set(currentY, []);
        }
        const array = this.intersection.get(currentY);

        if (array) {
          array.push({ x: currentX, color: this.color });
        }

        currentX += variation;
      }
    }
  }

  draw_edges(context: CanvasRenderingContext2D) {
    if (this.show_edge === true) {
      const vertex_quantity = this.vertex.length; 
      for (let current_vertex = 0; current_vertex < this.vertex.length; current_vertex++) {
        const next_vertex = (current_vertex + 1) % vertex_quantity;
        
        this.vertex[current_vertex];
        context.strokeStyle = this.edge_color.get_rgb();
        context.beginPath();
        context.moveTo(this.vertex[current_vertex].x, this.vertex[current_vertex].y);
        context.lineTo(this.vertex[next_vertex].x, this.vertex[next_vertex].y);
        context.stroke(); // Draw the line
        context.closePath(); // Close the path (optional)
      }
    }
  }
  
  draw_dots(context: CanvasRenderingContext2D) {
    for (let i = 0; i < this.vertex.length; i++) {
      const dot = this.vertex[i];
      dot.draw(context);
    }
  }

  sortIntersectionX() {
    for (let i = this.minY; i < this.maxY; i++) {
      const sortX = this.intersection.get(i);
      if (sortX) {
        const sorted = sortX.slice().sort((a, b) => a.x - b.x);
        sortX.splice(0, sortX.length, ...sorted);
      }
    }
    // this.intersection.forEach((sortX) => {
    //   const sortedX = sortX.slice().sort((a, b) => a.x - b.x);
    //   sortX.splice(0, sortX.length, ...sortedX);
    // });
  }

  fill_polly(context: CanvasRenderingContext2D) {
    
    this.draw_dots(context);
    this.draw_edges(context);
    for (let y = this.minY; y < this.maxY; y++) {
      this.intersection.set(y, [])
    }

    this.define_edges();
    this.sortIntersectionX();
    
    for (let currentY = this.minY; currentY < this.maxY; currentY++) {
      const current_line = this.intersection.get(currentY);
      if (current_line) {
        let k = 0;
        do {
          
          const firstX = Math.ceil(current_line[k].x);
          const endX = Math.floor(current_line[k + 1].x);
          
          for (let currentX = firstX; currentX < endX; currentX++) {            
            this.polly_draw(context, currentX, currentY);
          }
          
          k += 2;
        } while (current_line[k]);
      }
    }
  }

  polly_draw(context: CanvasRenderingContext2D, x: number, y: number) {   
    context.fillStyle = this.color.get_rgb();
    context.fillRect(x, y, 1, 1);
  }
}