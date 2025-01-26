let particles = []; // Array, um Partikel zu speichern
const maxParticles = 300; // Maximale Anzahl von Partikeln
let mousePressedSpeedBoost = false; // Flag, ob die Maus gedrückt ist
let mousePressStartTime = 0; // Zeitpunkt, wann die Maus gedrückt wurde
const explosionDelay = 5000; // Zeit in Millisekunden bis zur Explosion
let explosionTriggered = false; // Flag, um Explosion zu markieren

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0); // Hintergrund schwarz

  // Keine neuen Partikel erstellen, wenn Explosion ausgelöst wurde
  if (!explosionTriggered && particles.length < maxParticles) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Alle Partikel aktualisieren und zeichnen
  for (let particle of particles) {
    particle.update();
    particle.show();
  }

  // Partikel-Kollisionen behandeln
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      particles[i].checkCollision(particles[j]);
    }
  }

  // Prüfen, ob die Maus lang genug gedrückt gehalten wurde
  if (!explosionTriggered && mousePressedSpeedBoost && millis() - mousePressStartTime >= explosionDelay) {
    triggerExplosion();
  }
}

function mousePressed() {
  if (!explosionTriggered) {
    mousePressedSpeedBoost = true; // Aktivieren des Geschwindigkeitsboosts
    mousePressStartTime = millis(); // Startzeitpunkt speichern
  }
}

function mouseReleased() {
  mousePressedSpeedBoost = false; // Deaktivieren des Geschwindigkeitsboosts
}

function triggerExplosion() {
  explosionTriggered = true; // Explosion markieren

  for (let particle of particles) {
    let angle = random(TWO_PI);
    let explosionForce = random(5, 15);
    particle.vx = cos(angle) * explosionForce;
    particle.vy = sin(angle) * explosionForce;
  }

  // Löschen der Partikel nach einer kurzen Zeit
  setTimeout(() => {
    particles = []; // Alle Partikel entfernen
  }, 2000);
}
