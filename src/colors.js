export function random_color() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return {
    r: r,
    g: g,
    b: b
  };
}

export function get_rgb(color) {
  return `rgb(${color.r},${color.g},${color.b})`
}

export function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(color) {
  return `#${componentToHex(color.r)}${componentToHex(color.g)}${componentToHex(color.b)}`;
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16)
  } : null;
}