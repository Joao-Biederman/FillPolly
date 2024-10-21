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
  intersection: number[][];

  show_edge: boolean;

  constructor(dot: Dot, id: number){
    this.id = id;
    this.edge_color = new Color(255, 255, 0)
    this.color = random_color();
    this.vertex = [];
    this.maxY = Number.NEGATIVE_INFINITY;
    this.minY = Number.POSITIVE_INFINITY;
    this.add_dot(dot);
    this.intersection = [];
    this.show_edge = true;
  }

  add_dot(dot: Dot){
    this.vertex.push(dot)
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
        this.intersection[currentY].push(currentX);
        currentX += variation;
      }
    }
  }

  draw_edges(context: any) {
    if (this.show_edge === true) {
      const vertex_quantity = this.vertex.length; 
      for (let current_vertex = 0; current_vertex < this.vertex.length; current_vertex++) {
        const next_vertex = (current_vertex + 1) % vertex_quantity;
        
        this.vertex[current_vertex];
        context.strokeStyle = this.edge_color.get_rgb();
        context.beginPath();
        context.moveTo(this.vertex[current_vertex].x, this.vertex[current_vertex].y);
        context.lineTo(this.vertex[next_vertex].x, this.vertex[next_vertex].y);
      }
    }
  }
  
  draw_dots(context: any) {
    for (let i = 0; i < this.vertex.length; i++) {
      const dot = this.vertex[i];
      dot.draw(context);
    }
  }

  sortIntersectionX() {
    this.intersection.forEach((sortX) => {
      const sortedX = sortX.slice().sort((a, b) => a.x - b.x);

      sortX.splice(0, sortX.length, ...sortedX);
    });
  }

  fill_polly() {
    // this.draw_dots();
    // this.draw_edges();
    // for (let y = this.minY; y < this.maxY; y++) {
    //   this.intersection.set(y, [])

    // }
    // this.define_edges();
    // this.sortIntersectionX();

    // for (let currentY = this.minY; currentY < this.maxY; currentY++) {
    //   const current_line = this.intersection.get(currentY);
    //   let k = 0;
    //   let color = current_line[k].color;

    //   do {
    //     let firstX = Math.ceil(current_line[k].x);
    //     let endX = Math.floor(current_line[k + 1].x);

    //     const variationR = (current_line[k + 1].color.r - current_line[k].color.r) / (endX - firstX);
    //     const variationG = (current_line[k + 1].color.g - current_line[k].color.g) / (endX - firstX);
    //     const variationB = (current_line[k + 1].color.b - current_line[k].color.b) / (endX - firstX);
    //     for (let currentX = firstX; currentX < endX; currentX++) {
    //       paint(currentX, currentY, color);
    //       let newColor = { r: color.r + variationR, g: color.g + variationG, b: color.b + variationB };
    //       color = newColor;
    //     }

    //     k += 2;
    //   } while (current_line[k]);
    // }
  }
}