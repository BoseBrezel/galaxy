class FylingStar {
   constructor() {
      this.pos = createVector(
         randomGaussian(0, width / 2),  // Gaussian distribution for position
         randomGaussian(0, height),
         random(width * 2.5, width * 3.5)  // Set initial z position far away
      );
     
      this.m = random(4, 8); // Speed of the star
      this.size = random(1, 5); // Random size between 1 and 5
      this.toDraw = true;
      this.trail = []; // Trail for the star's path
      this.maxSpeedDuration = 500; // Duration of maximum speed
   }
   
   update(pulsarDistance) {
      if (this.maxSpeedDuration > 0) {
          // Keep maximum speed active for some time
          this.maxSpeedDuration--;
      } else {
          // Slow down the star gradually
          this.m *= 0.99;
      
          // If speed is close to zero, stop the star
          if (this.m < 1.01) {
              this.m = 0;
          }
      }
   
      // Move the star forward based on its speed
      this.pos.z -= this.m * 4;
   
      // Ensure the star stays behind the pulsar
      if (this.pos.z < pulsarDistance + 100) {
          this.pos.z = pulsarDistance + 100;  // Lock the position behind the pulsar
      }
   
      // Map the 3D position to 2D screen space
      let sx = map(this.pos.x / this.pos.z, 0, 1, width / 2, width);
      let sy = map(this.pos.y / this.pos.z, 0, 1, height / 2, height);
   
      // Calculate the trail length based on the speed
      let trailLength = Math.max(0, Math.floor(this.m - 2)); 
   
      // Add the current position to the trail
      this.trail.push(createVector(sx, sy));
      
      // Keep the trail length within the calculated limit
      if (this.trail.length > trailLength) {
          this.trail.shift();
      }
   
      // Reset the star if it gets too close to the camera (pulsar)
      if (this.pos.z < 1) {
          this.reset();
      }
   }
   
   reset() {
      this.pos = createVector(
         randomGaussian(0, width / 8),  // Random position
         randomGaussian(0, height / 2),
         random(width * 2.5, width * 3.5)
      );
      this.m = random(4, 8);
      this.size = random(1, 5);
      this.toDraw = true;
      this.trail = []; // Reset the trail
   }
   
   display(exclusionRadius) {
      if (this.toDraw) {
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
   }
}

