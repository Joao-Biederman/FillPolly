"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dot = void 0;
class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = random_color();
    }
    set_color(color) {
        this.color = color;
        this.draw();
    }
    draw(context) {
        context.fillStyle = get_rgb(this.color);
        context.beginPath();
        context.arc(this.x, this.y, 4, 0, 2 * Math.PI);
        context.fill();
    }
}
exports.Dot = Dot;
