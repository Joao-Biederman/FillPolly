"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const color_ts_1 = require("./color.ts");
const color_ts_2 = require("./color.ts");
class Polygon {
    constructor(dot, id) {
        this.id = id;
        this.edge_color = new color_ts_1.Color(255, 255, 0);
        this.color = (0, color_ts_2.random_color)();
        this.vertex = [];
        this.maxY = Number.NEGATIVE_INFINITY;
        this.minY = Number.POSITIVE_INFINITY;
        this.add_dot(dot);
        this.intersection = [];
        this.show_edge = true;
    }
    add_dot(dot) {
        this.vertex.push(dot);
    }
    update_show_edge(state) {
        this.show_edge = state;
    }
    update_color(color) {
        this.color = color;
    }
    define_edges() {
        const vertex_quantity = this.vertex.length;
        for (let i = 0; i < vertex_quantity; i++) {
            let initialY;
            let endY;
            let currentX;
            const next_vertex = this.vertex[(i + 1) % vertex_quantity];
            const y_diference = next_vertex.y - this.vertex[i].y;
            const variation = (next_vertex.x - this.vertex[i].x) / y_diference;
            if (this.vertex[i].y < next_vertex.y) {
                initialY = this.vertex[i].y;
                endY = next_vertex.y;
                currentX = this.vertex[i].x;
            }
            else {
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
    draw_edges(context) {
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
    draw_dots(context) {
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
}
exports.Polygon = Polygon;
