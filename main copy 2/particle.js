class Particle
{
  constructor(x, y, vx, vy){
    this.pos = new p5.Vector(x, y);
    this.vel = new p5.Vector(vx, vy);
    this.vel.mult(random(3));
    this.mass = random(10, 30);
    this.airDrag = random(0.001, 0.2);
    this.colorIndex = int(random(colorScheme.length));
    this.exploding = false;
  
  }


  move()
  {
    if (this.exploding)
    {
      // Explosion: Partikel bewegen sich nach außen
      this.pos.add(this.vel);
    }
    else
    {
      if(mouseIsPressed)
      {
        this.vel.x = mouseX - this.pos.x ;
        this.vel.y = mouseY - this.pos.y ;
        this.vel.normalize();
        this.vel.mult(6);
        this.pos.add(this.vel);
      }
      else
      {
        this.vel.x = mouseX - this.pos.x;
        this.vel.y = mouseY - this.pos.y;
        this.vel.normalize();
        this.vel.mult(1);
        this.pos.add(this.vel);
      }  
    }
  
  }

  // Prüfen, ob der Partikel die Mausposition erreicht hat
  reached(mx, my)
  {
    return dist(this.pos.x, this.pos.y, mx, my) < 10;
  }

  // Prüfen, ob der Partikel das Sichtfeld verlassen hat
  isOutOfView()
  {
    return (
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    );
  }

  // Explosion auslösen
  explode()
  {
    this.exploding = true;
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(10, 25));
  }
}