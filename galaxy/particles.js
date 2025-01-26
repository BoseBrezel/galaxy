
// Partikelklasse
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2); // Zufällige Geschwindigkeit in x-Richtung
    this.vy = random(-2, 2); // Zufällige Geschwindigkeit in y-Richtung
    this.r = random(4, 10); // Zufällige Größe
  }

  update() {
    if (!explosionTriggered) {
      // Bewegung in Richtung der Maus mit leichtem Rauschen
      let dx = mouseX - this.x;
      let dy = mouseY - this.y;
      let angle = atan2(dy, dx);
      let baseSpeed = 1.5; // Basisgeschwindigkeit
      let speed = mousePressedSpeedBoost ? baseSpeed * 2 : baseSpeed; // Verdoppelte Geschwindigkeit bei gedrückter Maus

      this.vx += cos(angle) * 0.1 * speed + random(-0.5, 0.5); // Leichter Noise hinzugefügt
      this.vy += sin(angle) * 0.1 * speed + random(-0.5, 0.5);
    }

    this.x += this.vx;
    this.y += this.vy;

    // Geschwindigkeit dämpfen
    this.vx *= 0.95;
    this.vy *= 0.95;

    // Partikel am Rand umkehren lassen
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  show() {
    noStroke();
    fill(255, 150); // Weiß mit Transparenz
    ellipse(this.x, this.y, this.r);
  }

  checkCollision(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    let minDist = this.r / 2 + other.r / 2;

    if (d < minDist) {
      // Einfache Abstoßung basierend auf dem Abstand
      let angle = atan2(this.y - other.y, this.x - other.x);
      let force = 0.5; // Stärke der Abstoßung

      this.vx += cos(angle) * force;
      this.vy += sin(angle) * force;

      other.vx -= cos(angle) * force;
      other.vy -= sin(angle) * force;
    }
  }
}
