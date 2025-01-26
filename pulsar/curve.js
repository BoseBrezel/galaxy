class Curve {
  constructor(centerX, centerY, radius, distanceFactor, numCurves) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.distanceFactor = distanceFactor;
    this.numCurves = numCurves;
    this.time = 0;

    // Feste Punkte der Kugel
    this.x1 = centerX;
    this.y1 = centerY - radius;
    this.z1 = 0;

    this.x4 = centerX;
    this.y4 = centerY + radius;
    this.z4 = 0;
  }

  calculatePoints(angleOffset) {
    // Berechnung der dynamischen Punkte
    const angle = this.time * 0.1 + angleOffset;
    const zAngle = this.time * 0.05 + angleOffset; // Versatz für die vertikale Bewegung

    const x5 = this.centerX + this.radius * this.distanceFactor * cos(angle) * cos(zAngle);
    const y5 = (this.y4 + this.y1) / 2;
    const z5 = this.radius * this.distanceFactor * sin(zAngle);

    const x6 = (this.x1 + x5) / 2;
    const z6 = (this.z1 + z5) / 2;

    const x7 = (x5 + this.x4) / 2;
    const z7 = (z5 + this.z4) / 2;

    return { x5, y5, z5, x6, z6, x7, z7 };
  }

  drawCurve(angleOffset) {
    const { x5, y5, z5, x6, z6, x7, z7 } = this.calculatePoints(angleOffset);

    beginShape();
    stroke(255, 0, 0);
    noFill();
    curveVertex(0, 0, 0);
    curveVertex(this.x1, this.y1, this.z1);
    curveVertex(x6, this.y1, z6);
    curveVertex(x5, y5, z5);
    curveVertex(x7, this.y4, z7);
    curveVertex(this.x4, this.y4, this.z4);
    curveVertex(0, 0, 0);
    endShape();
  }

  draw() {
    for (let i = 0; i < this.numCurves; i++) {
      const angleOffset = (TWO_PI / this.numCurves) * i;
      this.drawCurve(angleOffset);
    }
    this.time += 0.01; // Zeit für Animation erhöhen
  }
}