class Galaxy {
   constructor(x, y, angle, radius, z) {
     this.x = x;
     this.y = y;
     this.angle = angle;
     this.radius = radius;
     this.z = z; // Z-Achse für Perspektive
     this.alpha = 255; // Start-Alpha-Wert für die Sichtbarkeit
     this.initialX = x; // Anfangs X-Position speichern
     this.initialY = y; // Anfangs Y-Position speichern
     this.initialRadius = radius; // Anfangs Radius speichern
     this.initialAngle = angle; 
   }
 
   update() {
     // Partikel entlang der Spirale bewegen
     this.radius += 0.03 // Partikel wandern nach außen
     this.angle += 0.02; // Leichte Drehung
 
     // Perspektive auf die Z-Achse anwenden
     this.x = width / 2 + cos(this.angle) * this.radius;
     this.y = height / 2 + sin(this.angle) * this.radius;
     this.z = sin(this.angle) * depthFactor;
      
     // Wenn die Partikel zu alt sind oder zu weit von der Mitte entfernt, zurücksetzen
     if (this.isFinished()) {
       this.reset();
     }
   }
 
   show() {
     // Perspektivische Verzerrung basierend auf der Z-Position
     let perspective = map(this.z, -depthFactor, depthFactor, 0.5, 0.8);
     fill(255, this.alpha);
     ellipse(this.x * perspective, this.y * perspective, 1.2);
   }
 
   isFinished() {
     return this.alpha <= 0 || this.radius > maxRadius;
   }
 
   reset() {
     // Position und Radius zurücksetzen, um Partikel zu recyceln
     this.x = this.initialX;
     this.y = this.initialY;
     this.radius = this.initialRadius;
     this.angle = sin(this.angle) * depthFactor
   }

   bigRipUpdate() {
     // Berechne die Richtung vom Mittelpunkt (width/2, height/2)
    let dirX = this.x - width / 2;
    let dirY = this.y - height / 2;

    // Normalisiere die Richtung und skaliere die Geschwindigkeit
    let magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
    dirX /= magnitude;
    dirY /= magnitude;

    // Erhöhe die Geschwindigkeit der Partikel (Big Rip Effekt)
    this.speedX += dirX * 0.1;
    this.speedY += dirY * 0.1;

    // Aktualisiere die Position basierend auf der Geschwindigkeit
    this.x += this.speedX;
    this.y += this.speedY;

    // Verringere die Sichtbarkeit, um einen Fade-Out-Effekt zu erzielen
    this.alpha -= 5;
  }
    
 }
 