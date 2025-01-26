var start = false;
const maxStars = 300; // Maximale Anzahl von Stars
let mousePressedSpeedBoost = false; // Flag, ob die Maus gedrückt ist
let mousePressStartTime = 0; // Zeitpunkt, wann die Maus gedrückt wurde
const explosionDelay = 5000; // Zeit in Millisekunden bis zur Explosion
let explosionTriggered = false; // Flag, um Explosion zu markieren


var universebool = false;
let galaxy = [];
const maxGalaxyParticles = 2000;
let angleOffset = 0; // Offset für die Spirale
const numGalaxyStars = 30; // Anzahl der Partikel pro Frame
const spiralTurns = 3; // Anzahl der Windungen der Spirale
const maxRadius = 200; // Maximale Entfernung der Spirale von der Mitte
const depthFactor = 5000; // Tiefe der Spirale für Perspektive

var startgate = false;
let exclusionRadius = 60;

var startgate_back_bool = false;

var big_crunch = false;

var big_rip_bool = false;

var pulsar = true;
let radius = 200; // Radius der Kugel
let centerX = 0, centerY = 0; // Mittelpunkt der Kugel im WebGL-Canvas
let distanceFactor = 1.5; // Abstandsfaktor für den blauen Punkt und türkise Punkte
let x1, y1, z1; // Oben auf der Kugel
let x4, y4, z4; // Unten auf der Kugel
let x5, y5, z5; // Punkt außerhalb der Kugel
let x6, y6, z6; // Erster Kontrollpunkt zwischen rot und blau
let x7, y7, z7; // Zweiter Kontrollpunkt zwischen blau und grün
let numCurves = 12; // Anzahl der Kurven
let time = 0; // Zeit für Animation
let pulsarDistance = 6000; // Startentfernung des Pulsars
let pulsarApproachSpeed = 500; //eig 5  

let stars = []; 
let flying_stars = []; 
let flying_stars_back = []; 


function setup()
{
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  noStroke();

  
  //pulsar
  smooth();  // Aktiviert die Kantenglättung
    // Initialisiere feste Punkte
    x1 = centerX;
    y1 = centerY - radius;
    z1 = 0;
  
    x4 = centerX;
    y4 = centerY + radius;
    z4 = 0;
  //starGate
  for (let i = 0; i < 500; i++) {
    flying_stars.push(new FylingStar());
  }
  for (let i = 0; i < 500; i++) {
    flying_stars_back.push(new FylingStar_back());
  }
// Erstelle 1000 Partikel für die Galaxie
for (let i = 0; i < maxGalaxyParticles; i++) {
  let angle = random(TWO_PI * spiralTurns);
  let radius = (angle / (TWO_PI * spiralTurns)) * maxRadius;
  let x = width / 2 + cos(angle + angleOffset) * radius;
  let y = height / 2 + sin(angle + angleOffset) * radius;
  let z = sin(angle + angleOffset) * depthFactor;
  
  galaxy.push(new Galaxy(x, y, angle, radius, z));
}
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
}

function draw()
{
  background(0); 
  if (start)
  {
    start_explosion();
  }
  if (startgate)
  {
    startgate_start();
  }
  if (pulsar)
  {
    pulsarSzene();
  }
  if (startgate_back_bool)
  {
    startgate_back();
  }

  if (big_rip_bool) {
    big_rip();
  }
  
}

function mousePressed()
{
  if (!explosionTriggered) {
    mousePressedSpeedBoost = true; // Aktivieren des Geschwindigkeitsboosts
    mousePressStartTime = millis(); // Startzeitpunkt speichern
  }
  
}

function mouseReleased()
{
  mousePressedSpeedBoost = false; // Deaktivieren des Geschwindigkeitsboosts

}
function start_explosion() {
  push(); // Speichert den aktuellen Transformationszustand
  translate(-width / 2, -height / 2, 0); // Ursprung auf die Mitte des Bildschirms setzen
  
  // Keine neuen Stars erstellen, wenn Explosion ausgelöst wurde
  if (!explosionTriggered && stars.length < maxStars) {
    let angle = random(TWO_PI);
    let distance = random(radius); // Radius ist die maximale Entfernung vom Mittelpunkt
    let x = cos(angle) * distance;
    let y = sin(angle) * distance;

    stars.push(new Star(x, y));
  }

  // Alle Stars aktualisieren und zeichnen
  for (let star of stars) {
    star.update();
    star.show();
  }

  // Star-Kollisionen behandeln
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      stars[i].checkCollision(stars[j]);
    }
  }

  // Explosion auslösen, wenn Maus lange gedrückt gehalten wurde
  if (!explosionTriggered && mousePressedSpeedBoost && millis() - mousePressStartTime >= explosionDelay) {
    explosionTriggered = true;

    for (let star of stars) {
      let angle = random(TWO_PI);
      let explosionForce = random(5, 15);
      star.vx = cos(angle) * explosionForce;
      star.vy = sin(angle) * explosionForce;
    }

    setTimeout(() => {
      stars = [];
      start = false;
      startgate = true;
      pulsar = true;

    }, 2000);
  }

  pop();
}
function keyPressed() {
  if (key === 'm') {
    if (pulsarDistance <= radius + 100) { // Überprüfen, ob der Pulsar vollständig sichtbar ist
      startgate = false; // Stargate deaktivieren
      startgate_back_bool = true; // Stargate_back aktivieren

      // Pulsar zurückziehen lassen
      let pulsarShrinkInterval = setInterval(() => {
        if (pulsarDistance < 6000) {
          pulsarDistance += pulsarApproachSpeed;
          exclusionRadius -= 0.23;
        } else {
          clearInterval(pulsarShrinkInterval); // Intervall stoppen, wenn Pulsar vollständig zurückgezogen ist
          pulsar = false; // Pulsar deaktivieren
        }
      }, 16); // Aktualisierung mit 60 FPS
    }
  }
  if (key === 'r') { // 'r' für Big Rip
    big_rip_bool = true;
    //universebool = false; // Deaktiviert andere Szenen
  }
}

function startgate_start()
{
  push(); // Speichert den aktuellen Transformationszustand
  translate(-width / 2, -height / 2, 0); // Ursprung auf die Mitte des Bildschirms setzen
  
  for (let i = 0; i < flying_stars.length; i++) {
    flying_stars[i].display(exclusionRadius);
    flying_stars[i].update();
 }
 pop();
}

function pulsarSzene() {
  // Berechnung der Annäherung
  if (pulsarDistance > radius + 100) { // Stoppt, wenn der Pulsar nah genug ist
    pulsarDistance -= pulsarApproachSpeed;
    exclusionRadius += 0.23;

  }

  // Kamera-Einstellung für Entfernung
  push();
  translate(0, 0, -pulsarDistance); // Bewegt die Szene in die Kamera hinein

  // Licht hinzufügen
  directionalLight(255, 255, 255, 0, 0, -1); // Weißes Licht von vorne
  ambientLight(50); // Schwaches Umgebungslicht

  // Kugel rotieren lassen
  rotateY(frameCount * 0.01);
  rotateX(frameCount * 0.01);

  // Kugel
  noStroke();
  normalMaterial();
  sphere(radius);

  // Zufällige Schimmerfarbe generieren
  let shimmerColor = color(
    map(sin(frameCount * 0.05), -1, 1, 0, 255), // Rot-Intensität
    map(cos(frameCount * 0.05), -1, 1, 0, 255), // Grün-Intensität
    map(sin(frameCount * 0.05 + PI / 2), -1, 1, 0, 255) // Blau-Intensität
  );

  // Schimmer-Effekt für den Nordpol-Zylinder
  push();
  translate(0, -150, 0); // Oberhalb der Kugel
  fill(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2], 50); // Halbtransparenter Zylinder
  cylinder(40, 8200, 24, 1); // Großer Zylinder für Schimmer-Effekt
  emissiveMaterial(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2]); // Leuchtende Farbe
  cylinder(10, 8000, 24, 1); // Langer Zylinder für den Strahl
  pop();

  // Schimmer-Effekt für den Südpol-Zylinder
  push();
  translate(0, 150, 0); // Unterhalb der Kugel
  fill(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2], 50); // Halbtransparenter Zylinder
  cylinder(40, 8200, 24, 1); // Großer Zylinder für Schimmer-Effekt
  emissiveMaterial(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2]); // Leuchtende Farbe
  cylinder(10, 8000, 24, 1); // Langer Zylinder für den Strahl
  pop();

  // Kurven zeichnen (bleibt wie in der Originalfunktion)
  let angle = time * 0.1; // Langsame Bewegung der Punkte
  let zAngle = time * 0.05; // Langsame vertikale Bewegung
  x5 = centerX + radius * distanceFactor * cos(angle) * cos(zAngle);
  y5 = (y4 + y1) / 2;  // Mittelwert für y5
  z5 = radius * distanceFactor * sin(zAngle);

  x6 = (x1 + x5) / 2;
  y6 = centerY - radius;
  z6 = (z1 + z5) / 2;

  x7 = (x5 + x4) / 2;
  y7 = centerY + radius;
  z7 = (z5 + z4) / 2;

  for (let i = 0; i < numCurves; i++) {
    let angleOffset = (TWO_PI / numCurves) * i;
    let newX5 = centerX + radius * distanceFactor * cos(angleOffset + time * 0.1);
    let newZ5 = radius * distanceFactor * sin(angleOffset + time * 0.1);

    let newX6 = (x1 + newX5) / 2;
    let newZ6 = (z1 + newZ5) / 2;
    let newX7 = (newX5 + x4) / 2;
    let newZ7 = (newZ5 + z4) / 2;

    beginShape();
    stroke(255, 0, 0);
    noFill();
    curveVertex(0, 0, 0);
    curveVertex(x1, y1, z1);
    curveVertex(newX6, y6, newZ6);
    curveVertex(newX5, y5, newZ5);
    curveVertex(newX7, y7, newZ7);
    curveVertex(x4, y4, z4);
    curveVertex(0, 0, 0);
    endShape();
  }

  time += 0.01;

  pop();
}
function startgate_back() {
  let allStopped = true; // Annahme: alle Sterne stehen still

  push(); // Speichert den aktuellen Transformationszustand
  translate(-width / 2, -height / 2, 0); // Ursprung auf die Mitte des Bildschirms setzen

  for (let i = 0; i < flying_stars_back.length; i++) {
    flying_stars_back[i].display(exclusionRadius);
    flying_stars_back[i].update();

    // Prüfen, ob mindestens ein Stern sich noch bewegt
    if (flying_stars_back[i].m > 0) {
      allStopped = false;
    }
  }

  pop();
  // Wenn alle Sterne gestoppt sind, wechsle zur Galaxie
  if (allStopped) {
    universebool = true; // Aktiviere die Galaxie-Szene
  }
}


function big_crunch()
{
 
}
function big_rip() {
  push();
  translate(-width / 2, -height / 2, 0);

  // Update Galaxy Particles
  for (let particle of galaxy)
  {
    particle.bigRipUpdate();
    particle.show();
  }

  // Update Flying Stars
  for (let star of flying_stars_back)
  {
    star.bigRipUpdate();
    star.display(exclusionRadius);
  }

  pop();
}
