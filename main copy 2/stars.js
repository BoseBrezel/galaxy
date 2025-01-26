
// Star Klasse
class Star {
  constructor(x, y) {
    this.x = x ; // Offset vom Mittelpunkt
    this.y = y ;
    
    this.vx = random(-2, 2); 
    this.vy = random(-2, 2); 
    this.r = random(4, 10); 
  }

  update() {
    if (!explosionTriggered)
    {
      let dx = mouseX - this.x;
      let dy = mouseY - this.y;
      let angle = atan2(dy, dx);
      let baseSpeed = 1.5; 
      let speed = mousePressedSpeedBoost ? baseSpeed * 2 : baseSpeed;

      this.vx += cos(angle) * 0.1 * speed + random(-0.5, 0.5); 
      this.vy += sin(angle) * 0.1 * speed + random(-0.5, 0.5);
    }

    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.95;
    this.vy *= 0.95;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  show() {
    noStroke();
    fill(255, 150); 
    ellipse(this.x, this.y, this.r);
    ellipse(this.x + centerX, this.y + centerY, this.r, this.r); // Sterne an der richtigen Position zeichnen

  }

  checkCollision(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    let minDist = this.r / 2 + other.r / 2;

    if (d < minDist) {
      let angle = atan2(this.y - other.y, this.x - other.x);
      let force = 0.5; 

      this.vx += cos(angle) * force;
      this.vy += sin(angle) * force;

      other.vx -= cos(angle) * force;
      other.vy -= sin(angle) * force;
    }
  }
}
