export class Color {
  red: number;
  green: number;
  blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  get_rgb() {
    return `rgb(${this.red},${this.green},${this.blue})`;
  }

  rgbToHex() {
    return `#${toTwoDigitHex(this.red)}${toTwoDigitHex(this.green)}${toTwoDigitHex(this.blue)}`;
  }
}

export function random_color() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return new Color(r, g, b);
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? new Color(Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)) : null;
}

function toTwoDigitHex(value: number) {
  const hex = value.toString(16).padStart(2, '0'); // Convert to hex and pad with zeros
  return hex;
};