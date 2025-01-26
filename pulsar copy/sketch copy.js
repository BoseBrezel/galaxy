function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  describe('A 3D rotating sphere with long glowing poles emitting rays.');
}

function draw() {
  background(30);

  // Licht hinzufügen
  directionalLight(255, 255, 255, 0, 0, -1); // Weißes Licht von vorne
  ambientLight(50); // Schwaches Umgebungslicht

  // Kugel rotieren lassen
  rotateY(frameCount * 0.01);
  rotateX(frameCount * 0.01);

  // Kugel
  noStroke();
  normalMaterial();
  sphere(150);

  // Strahlen aus den Polen
  push();
  // Position Nordpol
  translate(0, -150, 0); // Oberhalb der Kugel
  fill(255, 200, 0); // Gelbe Strahlen
  cylinder(10, 8000); // Langer Zylinder für den Strahl
  pop();

  push();
  // Position Südpol
  translate(0, 150, 0); // Unterhalb der Kugel
  fill(255, 200, 0); // Gelbe Strahlen
  cylinder(10, 800); // Langer Zylinder für den Strahl
  pop();
}
