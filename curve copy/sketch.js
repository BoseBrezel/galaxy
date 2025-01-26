let radius = 200; // Radius der Kugel
let centerX = 0, centerY = 0; // Mittelpunkt der Kugel im WebGL-Canvas
let distanceFactor = 1.5; // Abstandsfaktor für den blauen Punkt

let x1, y1, z1; // Oben auf der Kugel
let x4, y4, z4; // Unten auf der Kugel
let x5, y5, z5; // Punkt außerhalb der Kugel
let x6, y6, z6; // Erster Kontrollpunkt zwischen rot und blau
let x7, y7, z7; // Zweiter Kontrollpunkt zwischen blau und grün

function setup() {
  createCanvas(600, 600, WEBGL);

  // Initialisiere feste Punkte
  x1 = centerX;
  y1 = centerY - radius;
  z1 = 0;

  x4 = centerX;
  y4 = centerY + radius;
  z4 = 0;

  // Zufälliger Startpunkt auf der erweiterten Kugel
  let angle = random(TWO_PI);
  let zAngle = random(-HALF_PI, HALF_PI);
  x5 = centerX + radius * distanceFactor * cos(angle) * cos(zAngle);
  y5 = y1 + (y4 - y1) / 2;  // Mittelwert für y5
  z5 = radius * distanceFactor * sin(zAngle);

  // Kontrollpunkte berechnen
  x6 = (x1 + x5) / 2; // Mittelwert zwischen rot und blau
  y6 = centerY - radius;
  z6 = (z1 + z5) / 2;

  x7 = (x5 + x4) / 2; // Mittelwert zwischen blau und grün
  y7 = centerY + radius;
  z7 = (z5 + z4) / 2;
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

  // Zeichne die Punkte
  fill(255, 0, 0);
  push();
  translate(x1, y1, z1);
  sphere(5);
  pop();

  fill(0, 255, 0);
  push();
  translate(x4, y4, z4);
  sphere(5);
  pop();

  fill(0, 0, 255);
  push();
  translate(x5, y5, z5);
  sphere(5);
  pop();

  // Kontrollpunkte zeichnen (optional)
  fill(255, 255, 0);
  push();
  translate(x6, y6, z6);
  sphere(5);
  pop();

  fill(255, 165, 0);
  push();
  translate(x7, y7, z7);
  sphere(5);
  pop();

  
  beginShape();
  stroke(255, 0, 0);
  noFill();
  curveVertex(0, 0, 0);
  curveVertex(x1, y1, z1);
  curveVertex(x6, y6, z6);
  curveVertex(x5, y5, z5);
  curveVertex(x7, y7, z7);
  curveVertex(x4, y4, z4);
  curveVertex(0, 0, 0);
  endShape();


}
