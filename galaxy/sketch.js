let galaxies = []; // Array für die Galaxien
const numGalaxies = 5; // Anzahl der Galaxien (kann angepasst werden)
const numParticles = 30; // Anzahl der Partikel pro Frame
const spiralTurns = 5; // Anzahl der Windungen der Spirale
const maxRadius = 200; // Maximale Entfernung der Spirale von der Mitte
const depthFactor = 200; // Tiefe der Spirale für Perspektive

function setup() {
  createCanvas(800, 800);
  noStroke();
  
  // Erstelle mehrere Galaxien mit zufälligen Parametern
  for (let i = 0; i < numGalaxies; i++) {
    let angleOffset = random(TWO_PI); // Zufälliger Winkel für jede Galaxie
    let speed = random(0.01, 0.05); // Zufällige Drehgeschwindigkeit
    galaxies.push(new Galaxy(random(width), random(height), random(2, 5), speed, angleOffset));
  }
}

function draw() {
  background(0); // Ein leichtes Hintergrund-Fading für Nachzieheffekte

  // Für jede Galaxie Partikel erzeugen und aktualisieren
  for (let g of galaxies) {
    g.update();
    g.show();
  }
}

class Galaxy {
  constructor(x, y, turns, speed, angleOffset) {
    this.x = x; // Position der Galaxie
    this.y = y;
    this.turns = turns; // Anzahl der Windungen der Spirale
    this.speed = speed; // Geschwindigkeit der Rotation
    this.angleOffset = angleOffset; // Offset für die Spirale
    this.particles = []; // Partikel dieser Galaxie
  }

  update() {
    // Neue Partikel für diese Galaxie erzeugen
    for (let i = 0; i < numParticles; i++) {
      let angle = random(TWO_PI * this.turns); // Zufälliger Winkel innerhalb der Spirale
      let radius = (angle / (TWO_PI * this.turns)) * maxRadius; // Radius entsprechend dem Winkel berechnen
      let x = this.x + cos(angle + this.angleOffset) * radius;
      let y = this.y + sin(angle + this.angleOffset) * radius;

      // Wir fügen die Z-Achse hinzu, um den "seitlichen" Effekt zu erreichen
      let z = sin(angle + this.angleOffset) * depthFactor;

      this.particles.push(new Particle(x, y, angle, radius, z));
    }

    // Partikel aktualisieren und zeichnen
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.update();
      p.show();
      if (p.isFinished()) {
        this.particles.splice(i, 1); // Partikel entfernen, wenn sie verblasst sind
      }
    }

    this.angleOffset += this.speed; // Spirale langsam drehen
  }

  show() {
    // Die Partikel für diese Galaxie zeichnen
    for (let p of this.particles) {
      p.show();
    }
  }
}

class Particle {
  constructor(x, y, angle, radius, z) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.radius = radius;
    this.z = z; // Z-Achse für Perspektive
    this.alpha = 255; // Start-Alpha-Wert für die Sichtbarkeit
  }

  update() {
    // Partikel entlang der Spirale bewegen
    this.radius += 1; // Partikel wandern nach außen
    this.angle += 0.05; // Leichte Drehung

    // Perspektive auf die Z-Achse anwenden
    this.x = width / 2 + cos(this.angle) * this.radius;
    this.y = height / 2 + sin(this.angle) * this.radius;
    this.z = sin(this.angle) * depthFactor;

    // Partikel verblassen
    this.alpha -= 2;
  }

  show() {
    // Perspektivische Verzerrung basierend auf der Z-Position
    let perspective = map(this.z, -depthFactor, depthFactor, 0.5, 1);
    fill(255, this.alpha);
    ellipse(this.x * perspective, this.y * perspective, 1);
  }

  isFinished() {
    return this.alpha <= 0 || this.radius > maxRadius;
  }
}
