let radius = 200; // Radius der Kugel
let centerX = 0, centerY = 0; // Mittelpunkt der Kugel im WebGL-Canvas
let distanceFactor = 1.5; // Abstandsfaktor für den blauen Punkt und türkise Punkte

let x1, y1, z1; // Oben auf der Kugel
let x4, y4, z4; // Unten auf der Kugel
let x5, y5, z5; // Punkt außerhalb der Kugel
let x6, y6, z6; // Erster Kontrollpunkt zwischen rot und blau
let x7, y7, z7; // Zweiter Kontrollpunkt zwischen blau und grün

let numCurves = 8; // Anzahl der Kurven
let time = 0; // Zeit für Animation

function setup() {
  createCanvas(600, 600, WEBGL);

  // Initialisiere feste Punkte
  x1 = centerX;
  y1 = centerY - radius;
  z1 = 0;

  x4 = centerX;
  y4 = centerY + radius;
  z4 = 0;
}

function draw() {
  background(200, 220, 255);

  // Aktiviert die Maussteuerung für die Drehung
  orbitControl();

  // Licht und Kamera
  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  ambientLight(100);

  // Zeichne die Kugel
  noStroke();
  fill(150, 150, 255, 150);
  push();
  translate(centerX, centerY, 0);
  sphere(radius);
  pop();


  // Berechne den beweglichen Punkt (x5, y5, z5)
  let angle = time * 0.1; // Langsame Bewegung der Punkte
  let zAngle = time * 0.05; // Langsame vertikale Bewegung
  x5 = centerX + radius * distanceFactor * cos(angle) * cos(zAngle);
  y5 = (y4 + y1) / 2;  // Mittelwert für y5
  z5 = radius * distanceFactor * sin(zAngle);

  // Kontrollpunkte berechnen
  x6 = (x1 + x5) / 2; // Mittelwert zwischen rot und blau
  y6 = centerY - radius;
  z6 = (z1 + z5) / 2;

  x7 = (x5 + x4) / 2; // Mittelwert zwischen blau und grün
  y7 = centerY + radius;
  z7 = (z5 + z4) / 2;



  // Zeichne die 8 Kurven gleichmäßig verteilt
  for (let i = 0; i < numCurves; i++) {
    let angleOffset = (TWO_PI / numCurves) * i; // Winkelverschiebung für jede Kurve
    let newX5 = centerX + radius * distanceFactor * cos(angleOffset + time * 0.1); // Berechne die neue Position für x5
    let newZ5 = radius * distanceFactor * sin(angleOffset + time * 0.1); // Berechne die neue Z-Position für x5

    // Berechne die neuen Kontrollpunkte
    let newX6 = (x1 + newX5) / 2;
    let newZ6 = (z1 + newZ5) / 2;
    let newX7 = (newX5 + x4) / 2;
    let newZ7 = (newZ5 + z4) / 2;

    // Zeichne die Kurve
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

  // Erhöhe die Zeit für die Animation
  time += 0.01;
}
