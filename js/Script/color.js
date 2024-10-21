"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
exports.random_color = random_color;
class Color {
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    get_rgb() {
        return `rgb(${this.red},${this.green},${this.blue})`;
    }
    rgbToHex() {
        return `#${this.red}${this.green}${this.blue}`;
    }
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? new Color(Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)) : null;
    }
}
exports.Color = Color;
function random_color() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return new Color(r, g, b);
}
