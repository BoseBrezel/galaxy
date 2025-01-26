class Star {
  constructor() {
     this.pos = createVector(
        random(-width, width),
        random(-height / 2, height / 2),
        random(width * 2.5, width * 3.5) // Start weiter hinten
     );
     this.m = random(4, 8); // Geschwindigkeit positiv
     this.size = random(1, 5); // Zufällige Größe zwischen 1 und 5
     this.toDraw = true;
     this.trail = []; // Spur der Positionen
  }
  
  update() {
     this.pos.z -= this.m * 4; // Bewege den Stern nach vorne (in Richtung Kamera)
     
     // Berechne die aktuelle Bildschirmposition
     let sx = map(this.pos.x / this.pos.z, 0, 1, width / 2, width);
     let sy = map(this.pos.y / this.pos.z, 0, 1, height / 2, height);

     // Füge aktuelle Position zur Spur hinzu
     this.trail.push(createVector(sx, sy));
     if (this.trail.length > 10) { // Begrenze die Länge der Spur
        this.trail.shift();
     }

     // Falls der Stern die Mitte erreicht hat, resette ihn
     if (this.pos.z < 1) {
        this.reset();
     }
  }
  
  reset() {
     this.pos = createVector(
        random(-width, width),
        random(-height / 2, height / 2),
        random(width * 2.5, width * 3.5)
     );
     this.m = random(4, 8);
     this.size = random(1, 5); // Neue Größe beim Zurücksetzen
     this.toDraw = true;
     this.trail = []; // Spur zurücksetzen
  }
  
  display(exclusionRadius) {
     if (this.toDraw) {
        let sx = map(this.pos.x / this.pos.z, 0, 1, width / 2, width);
        let sy = map(this.pos.y / this.pos.z, 0, 1, height / 2, height);

        // Berechne Entfernung zum Mittelpunkt
        let distanceToCenter = dist(sx, sy, width / 2, height / 2);

        // Zeichne nur Sterne außerhalb des Ausschlussradius
        if (distanceToCenter > exclusionRadius) {
           // Zeichne die Spur
           noFill();
           stroke(255);
           beginShape();
           for (let v of this.trail) {
              vertex(v.x, v.y);
           }
           endShape();

           // Zeichne den aktuellen Stern mit zufälliger Größe
           fill(255);
           noStroke();
           ellipse(sx, sy, this.size);
        }
     }
  }
}

var stars = [];
let exclusionRadius = 60; // Radius der Mitte ohne Sterne

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 500; i++) {
     stars.push(new Star());
  }
}

function draw() {
  background(31, 40);
  for (let i = 0; i < stars.length; i++) {
     stars[i].display(exclusionRadius);
     stars[i].update();
  }
}
