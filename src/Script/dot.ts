export class Dot {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(context: any) {
    context.fillStyle = 'rgb(0, 0, 0)';

    context.beginPath();
    context.arc(this.x, this.y, 4, 0, 2 * Math.PI);
    context.fill();
  }
}