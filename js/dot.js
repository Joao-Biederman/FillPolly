"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dot = void 0;
class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    draw(context) {
        context.fillStyle = 'rgb(0, 0, 0)';
        context.beginPath();
        context.arc(this.x, this.y, 4, 0, 2 * Math.PI);
        context.fill();
    }
}
exports.Dot = Dot;
