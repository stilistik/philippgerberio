import { Path, Color, Point } from "paper";
import { lerp } from "./math";

export class Blob {
  private x: number;
  private y: number;
  private radius: number;
  public path: paper.Path;
  private originalPos: paper.Point;
  private translateDirectionX: number;
  private translateDirectionY: number;
  private translationSpeed: number;
  private originalSegmentPoints: paper.Point[];
  private velocities: paper.Point[];
  private t = 0;

  public amplitude = 10;
  public changeInterval = 1;
  public intensity = 0.5;
  public attenutation = 0.05;

  constructor(
    x: number,
    y: number,
    radius: number,
    color1: string,
    color2: string,
    isMobile: boolean
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.path = new Path({ segments: this.generatePoints() });
    this.path.fillColor = {
      gradient: {
        stops: [color1, color2],
      },
      origin: this.path.bounds.topLeft,
      destination: this.path.bounds.bottomRight,
    } as any;
    this.path.shadowBlur = isMobile ? 20 : 100;
    const shadowColor = new Color("white");
    shadowColor.alpha = 0.5;
    this.path.shadowColor = shadowColor;
    this.path.closed = true;
    this.path.smooth();
    this.originalPos = this.path.position.clone();
    this.originalSegmentPoints = this.path.segments.map((s) => s.point.clone());
    this.velocities = this.path.segments.map(() =>
      new Point(Math.random() * 2 - 1, Math.random() * 2 - 1).normalize()
    );

    this.translateDirectionX = (Math.random() - 0.5) * 2;
    this.translateDirectionY = (Math.random() - 0.5) * 2;
    this.translationSpeed = 500 + Math.random() * 2000;
  }

  generatePoints() {
    const numPoints = 8;
    const angleStep = (Math.PI * 2) / numPoints;
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const point = {
        angle: angle,
        x: this.x + this.radius * Math.cos(angle),
        y: this.y + this.radius * Math.sin(angle),
      };
      points.push(point);
    }
    return points;
  }

  wobble(t: number) {
    const MAX_D = this.radius / this.amplitude;
    this.path.segments.forEach((s, i) => {
      if (t - this.t > this.changeInterval) {
        this.velocities[i] = this.velocities[i]
          .add(
            new Point(Math.random() * 2 - 1, Math.random() * 2 - 1).multiply(
              this.attenutation
            )
          )
          .normalize();
        this.t = t;
      }
      const velocity = this.velocities[i];
      const newPoint = s.point.add(velocity.multiply(this.intensity));

      if (this.originalSegmentPoints[i].subtract(newPoint).length > MAX_D) {
        this.velocities[i] = velocity.add(
          this.originalSegmentPoints[i]
            .subtract(newPoint)
            .normalize()
            .multiply(this.attenutation)
        );
      }
      s.point = newPoint;
    });
  }

  animate(value: number) {
    this.path.position.x =
      this.originalPos.x +
      this.translateDirectionX * value * this.translationSpeed;
    this.path.position.y =
      this.originalPos.y +
      this.translateDirectionY * value * this.translationSpeed;

    const scaling = Math.max(1 - lerp(value, 0.6, 1), 0.01);
    this.path.scaling = new Point(scaling, scaling);
    this.path.opacity = 1 - lerp(value, 0.9, 1);
  }

  update(t: number) {
    this.wobble(t);
  }
}
