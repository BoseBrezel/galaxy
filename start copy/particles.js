let particles = [];
let angleOffset = 0; // Offset für die Spirale
const numParticles = 30; // Anzahl der Partikel pro Frame
const spiralTurns = 4; // Anzahl der Windungen der Spirale
const maxRadius = 200; // Maximale Entfernung der Spirale von der Mitte

function setup() {
  createCanvas(800, 800);
  noStroke();
}

function draw() {
  background(0); // Ein leichtes Hintergrund-Fading für Nachzieheffekte

  // Neue Partikel erzeugen
  for (let i = 0; i < numParticles; i++) {
    let angle = random(TWO_PI * spiralTurns); // Zufälliger Winkel innerhalb der Spirale
    let radius = (angle / (TWO_PI * spiralTurns)) * maxRadius; // Radius entsprechend dem Winkel berechnen
    let x = width / 2 + cos(angle + angleOffset) * radius;
    let y = height / 2 + sin(angle + angleOffset) * radius;

    particles.push(new Particle(x, y, angle, radius));
  }

  // Partikel aktualisieren und zeichnen
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isFinished()) {
      particles.splice(i, 1); // Partikel entfernen, wenn sie verblasst sind
    }
  }

  angleOffset += 0.01; // Spirale langsam drehen
}

class Particle {
  constructor(x, y, angle, radius) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.radius = radius;
    this.alpha = 255; // Start-Alpha-Wert für die Sichtbarkeit
  }

  update() {
    // Partikel entlang der Spirale bewegen
   this.radius += 1; // Partikel wandern nach außen
    this.angle += 0.05; // Leichte Drehung
    this.x = width / 2 + cos(this.angle) * this.radius;
    this.y = height / 2 + sin(this.angle) * this.radius;

    // Partikel verblassen
    this.alpha -= 2;
  }

  show() {
    fill(255, this.alpha);
    ellipse(this.x, this.y, 1);
  }

  isFinished() {
    return this.alpha <= 0 || this.radius > maxRadius;
  }
}
