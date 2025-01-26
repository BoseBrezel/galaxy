let galaxies = [];
let numGalaxies = 5; // Anzahl der Galaxien
let starsPerGalaxy = 200; // Sterne pro Galaxie
let isDispersed = false; // Status: Sind die Galaxien zerstreut?

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  for (let i = 0; i < numGalaxies; i++) {
    let galaxy = [];
    let centerX = random(-width / 2, width / 2);
    let centerY = random(-height / 2, height / 2);
    let centerZ = random(-500, 500);

    for (let j = 0; j < starsPerGalaxy; j++) {
      let angle = random(TWO_PI);
      let distance = random(50, 150); // Abstand vom Zentrum
      let speed = random(0.01, 0.05) / (distance * 0.1); // Sterne weiter weg bewegen sich langsamer

      galaxy.push({
        x: centerX,
        y: centerY,
        z: centerZ,
        angle,
        distance,
        speed,
        isMoving: false, // Ist der Stern zerstreut?
        vx: random(-2, 2), // zufällige Geschwindigkeit in x
        vy: random(-2, 2), // zufällige Geschwindigkeit in y
        vz: random(-2, 2), // zufällige Geschwindigkeit in z
      });
    }
    galaxies.push(galaxy);
  }
}

function draw() {
  background(0);
  orbitControl(); // Kamera steuern
  noStroke();

  for (let galaxy of galaxies) {
    for (let star of galaxy) {
      if (!isDispersed) {
        // Stern um das Zentrum rotieren lassen
        star.angle += star.speed;
        let starX = star.x + cos(star.angle) * star.distance;
        let starY = star.y + sin(star.angle) * star.distance;
        let starZ = star.z + sin(frameCount * 0.01) * 10; // leichte vertikale Schwingung

        // Stern zeichnen
        push();
        translate(starX, starY, starZ);
        fill(255, random(150, 255), random(200, 255)); // Blau-weiße Sterne
        sphere(2);
        pop();
      } else {
        // Sterne zerstreuen
        star.x += star.vx;
        star.y += star.vy;
        star.z += star.vz;

        push();
        translate(star.x, star.y, star.z);
        fill(255, 200, 200); // Rote Farbe für zerstreute Sterne
        sphere(2);
        pop();
      }
    }
  }
}

function mousePressed() {
  if (!isDispersed) {
    isDispersed = true; // Wechsel in den Zerstreuungsmodus
    for (let galaxy of galaxies) {
      for (let star of galaxy) {
        star.isMoving = true; // Alle Sterne zerstreuen
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
