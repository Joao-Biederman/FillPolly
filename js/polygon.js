"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const color_ts_1 = require("./color.ts");
class Polygon {
    constructor(dot, id) {
        this.id = id;
        this.edge_color = new color_ts_1.Color(255, 255, 0);
        this.color = color_ts_1.random_color;
        this.vertex = [];
        this.maxY = Number.NEGATIVE_INFINITY;
        this.minY = Number.POSITIVE_INFINITY;
        this.add_dot(dot);
        this.intersection = new Map();
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
}
exports.Polygon = Polygon;
