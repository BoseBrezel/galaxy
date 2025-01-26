class FylingStar_back {
   constructor() {
      this.pos = createVector(
         randomGaussian(0, width / 2), // Gaussian distribution for position
         randomGaussian(0, height),
         random(width * 2.5, width * 3.5) * 0.0000001 // Set initial z position far away
      );

      this.m = 2; // Speed of the star
      this.size = random(1, 5); // Random size between 1 and 5
      this.toDraw = true;
      this.trail = []; // Trail for the star's path
      this.maxSpeedDuration = 100; // Duration of maximum speed
      this.mediumSpeedDuration = 400; // Duration of maximum speed
      this.mediumDecrease = true; // Duration of maximum speed

   }

   update(pulsarDistance) {
      if (this.maxSpeedDuration > 0)
      {
         this.maxSpeedDuration--;
      }
      else
      {
         if(this.mediumDecrease)
         {
            this.m -= 1;
            this.mediumDecrease = false;
         }
         if(this.mediumSpeedDuration > 0)
         {
          this.mediumSpeedDuration--;
         }
         else
         {
            this.m -= 0.4;
            if (this.m < 0.01) { 
               this.m = 0; 
            }
         }
      }

      // Move the star forward based on its speed
      this.pos.z -= this.m * -4;

      // Map the 3D position to 2D screen space
      let sx = map(this.pos.x / this.pos.z, 0, 1, width / 2, width);
      let sy = map(this.pos.y / this.pos.z, 0, 1, height / 2, height);

      // Determine the maximum trail length based on speed
      let maxTrailLength = Math.floor(map(this.m, 0, 4, 0, 2)); // Map speed to trail length (0 to 50)

      // Update the trail only if the speed is above a threshold
      if (this.m > 2) {
         this.trail.push(createVector(sx, sy));
      }

      // Keep the trail length within the calculated limit
      if (this.trail.length > maxTrailLength) {
         this.trail.shift();
      }

      // Reset the star if it gets too close to the camera (pulsar)
      if (this.pos.z > 500) {
         this.reset();
      }
   }

   reset() {
      this.pos = createVector(
         randomGaussian(0, width / 8), // Random position
         randomGaussian(0, height / 2),
         random(width * 2.5, width * 3.5) * 0.0000001
      );
      this.m = random(4, 8);
      this.size = random(1, 5);
      this.toDraw = true;
      this.trail = []; // Reset the trail
   }

   display(exclusionRadius) {
      let sx = map(this.pos.x / this.pos.z, 0, 1, width / 2, width);
      let sy = map(this.pos.y / this.pos.z, 0, 1, height / 2, height);

      // Calculate distance to the center of the screen
      let distanceToCenter = dist(sx, sy, width / 2, height / 2);

      // Only draw stars outside the exclusion radius
      if (distanceToCenter > exclusionRadius) {
         noFill();
         stroke(255);
         beginShape();
         for (let v of this.trail) {
            vertex(v.x, v.y);
         }
         endShape();

         // Draw the current star with its size
         fill(255);
         noStroke();
         ellipse(sx, sy, this.size);
      }
   }

   bigRipUpdate() {
      // Berechne den Vektor von der Mitte des Bildschirms zur aktuellen Position
      let center = createVector(width / 2, height / 2);
      let currentPos = createVector(this.pos.x / this.pos.z, this.pos.y / this.pos.z);
      
      // Richtung von der Mitte berechnen
      let direction = p5.Vector.sub(currentPos, center);
      direction.normalize(); // Normalisieren, um nur die Richtung zu haben
      
      // Aktualisiere die Position in Richtung der Bewegung
      this.pos.x += direction.x * 1; // Multipliziere mit der Geschwindigkeit
      this.pos.y += direction.y * 1;
  }
  
}
