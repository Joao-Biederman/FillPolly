"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
class Polygon {
    constructor(dot, id, color) {
        this.id = id;
        this.color = color;
        this.vertex = [];
        this.minY = Number.POSITIVE_INFINITY;
        this.maxY = Number.NEGATIVE_INFINITY;
        this.add_dot(dot);
        this.intersection = new Map();
    }
    add_dot(dot) {
        this.vertex.push(dot);
    }
}
exports.Polygon = Polygon;
