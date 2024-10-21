import type { Dot } from '../dot.ts';
import { Color } from "./color.ts";
export declare class Polygon {
    id: number;
    edge_color: Color;
    color: Color;
    vertex: Dot[];
    maxY: number;
    minY: number;
    intersection: number[][];
    show_edge: boolean;
    constructor(dot: Dot, id: number);
    add_dot(dot: Dot): void;
    update_show_edge(state: boolean): void;
    update_color(color: Color): void;
    define_edges(): void;
    draw_edges(context: any): void;
    draw_dots(context: any): void;
    sortIntersectionX(): void;
    fill_polly(): void;
}
