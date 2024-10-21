export declare class Color {
    red: number;
    green: number;
    blue: number;
    constructor(red: number, green: number, blue: number);
    get_rgb(): string;
    rgbToHex(): string;
}
export declare function random_color(): Color;
export declare function hexToRgb(hex: string): Color | null;
