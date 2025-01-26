function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  describe('A 3D rotating sphere with long glowing poles emitting rays and a shimmer effect.');
  smooth();  // Aktiviert die Kantenglättung
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

  // Zufällige Schimmerfarbe generieren
  let shimmerColor = color(
    map(sin(frameCount * 0.05), -1, 1, 0, 255), // Rot-Intensität
    map(cos(frameCount * 0.05), -1, 1, 0, 255), // Grün-Intensität
    map(sin(frameCount * 0.05 + PI / 2), -1, 1, 0, 255) // Blau-Intensität
  );

  // Schimmer-Effekt für den Nordpol-Zylinder
  push();
  // Position Nordpol
  translate(0, -150, 0); // Oberhalb der Kugel
  // Schimmer: größerer, halbtransparenter Zylinder mit schwächerer Farbe
  fill(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2], 50); // Halbtransparenter Zylinder
  cylinder(40, 8200, 24, 1); // Großer Zylinder für Schimmer-Effekt, mehr Segmente für glattere Oberfläche
  // Leuchtender Zylinder
  emissiveMaterial(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2]); // Leuchtende Farbe
  cylinder(10, 8000, 24, 1); // Langer Zylinder für den Strahl, auch hier höhere Auflösung
  pop();

  // Schimmer-Effekt für den Südpol-Zylinder
  push();
  // Position Südpol
  translate(0, 150, 0); // Unterhalb der Kugel
  // Schimmer: größerer, halbtransparenter Zylinder mit schwächerer Farbe
  fill(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2], 50); // Halbtransparenter Zylinder
  cylinder(40, 8200, 24, 1); // Großer Zylinder für Schimmer-Effekt, mehr Segmente für glattere Oberfläche
  // Leuchtender Zylinder
  emissiveMaterial(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2]); // Leuchtende Farbe
  cylinder(10, 8000, 24, 1); // Langer Zylinder für den Strahl, auch hier höhere Auflösung
  pop();
}
