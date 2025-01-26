const MAX_PARTICLE_COUNT = 100;
const MAX_TRAIL_COUNT = 30;

var colorScheme = ["#48A3FA", "#230A59", "#91225B"];
var shaded = true;
var theShader;
var shaderTexture;
var trail = [];
var stars = [];
var explosionTriggered = false; // Zustand für die Explosion
var allParticlesGone = false; // Zustand für das Verschwinden der Partikel

function preload() {
  theShader = new p5.Shader(this.renderer, vertShader, fragShader);
}

function setup() {
  pixelDensity(1);

  let canvas = createCanvas(
    min(windowWidth, windowHeight),
    min(windowWidth, windowHeight),
    WEBGL
  );

  canvas.canvas.oncontextmenu = () => false; // Removes right-click menu.
  noCursor();

  shaderTexture = createGraphics(width, height, WEBGL);
  shaderTexture.noStroke();

  // Initialisiere Partikel
  for (let i = 0; i < MAX_PARTICLE_COUNT; i++) {
    let x = random(0, windowWidth);
    let y = random(0, windowHeight);
    stars.push(new Particle(x, y, mouseX, mouseY));
  }
}

function draw() {
  background(0);

  if (!explosionTriggered) {
    // Trim end of trail.
    trail.push([mouseX, mouseY]);
    if (trail.length > MAX_TRAIL_COUNT) {
      trail.splice(0, 1);
    }
  } else {
    // Entferne den Trail nach der Explosion
    if (trail.length > 0) {
      trail.splice(0, 1); // Reduziere die Trail-Länge
    }
  }

  translate(-width / 2, -height / 2);

  if (!explosionTriggered) {
    // Prüfe, ob alle Partikel die Mausposition erreicht haben
    let allReached = true;
    for (let i = 0; i < stars.length; i++) {
      if (!stars[i].reached(mouseX, mouseY)) {
        allReached = false;
        break;
      }
    }

    // Wenn alle angekommen und Maus gedrückt ist, Explosion auslösen
    if (allReached && mouseIsPressed) {
      explosionTriggered = true;
      for (let i = 0; i < stars.length; i++) {
        stars[i].explode();
      }
    }
  } else if (!allParticlesGone) {
    // Prüfe, ob alle Partikel das Sichtfeld verlassen haben
    allParticlesGone = stars.every((particle) => particle.isOutOfView());
  }

  if (allParticlesGone) {
    // Bild wird schwarz, wenn alle Partikel weg sind
    noLoop(); // Stoppt die Animation
    return;
  }

  // Move and render particles
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].move();
  }

  if (shaded) {
    // Display shader.
    shaderTexture.shader(theShader);
    let data = serializeSketch();
    theShader.setUniform("resolution", [width, height]);
    theShader.setUniform("trailCount", trail.length);
    theShader.setUniform("trail", data.trails);
    theShader.setUniform("starsCount", stars.length);
    theShader.setUniform("stars", data.stars);
    theShader.setUniform("colors", data.colors);
    shaderTexture.rect(0, 0, width, height);
    texture(shaderTexture);
    rect(0, 0, width, height);
  } else {
    stroke(0, 255, 255);
    for (let i = 0; i < trail.length; i++) {
      point(trail[i][0], trail[i][1]);
    }
  }
}

function serializeSketch() {
  let data = {
    trails: [],
    stars: [],
    colors: []
  };

  for (let i = 0; i < trail.length; i++) {
    data.trails.push(
      map(trail[i][0], 0, width, 0.0, 1.0),
      map(trail[i][1], 0, height, 1.0, 0.0)
    );
  }

  for (let i = 0; i < stars.length; i++) {
    data.stars.push(
      map(stars[i].pos.x, 0, width, 0.0, 1.0),
      map(stars[i].pos.y, 0, height, 1.0, 0.0),
      stars[i].mass * stars[i].vel.mag() / 100
    );

    let itsColor = colorScheme[stars[i].colorIndex];
    data.colors.push(red(itsColor), green(itsColor), blue(itsColor));
  }

  return data;
}

function Particle(x, y, vx, vy) {
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(vx, vy);
  this.vel.mult(random(3));
  this.mass = random(10, 30);
  this.airDrag = random(0.001, 0.2);
  this.colorIndex = int(random(colorScheme.length));
  this.exploding = false;

  // Bewegung und Explosion
  this.move = function()
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
        this.vel.mult(2);
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
  
  };

  // Prüfen, ob der Partikel die Mausposition erreicht hat
  this.reached = function(mx, my) {
    return dist(this.pos.x, this.pos.y, mx, my) < 10;
  };

  // Prüfen, ob der Partikel das Sichtfeld verlassen hat
  this.isOutOfView = function() {
    return (
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    );
  };

  // Explosion auslösen
  this.explode = function() {
    this.exploding = true;
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(10, 25));
  };
}


let vertShader = `
  precision highp float;

  attribute vec3 aPosition;

  void main() {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
  }
`;

let fragShader = `
  precision highp float;

  uniform vec2 resolution;
  uniform int trailCount;
  uniform vec2 trail[${MAX_TRAIL_COUNT}];
  uniform int starsCount;
  uniform vec3 stars[${MAX_PARTICLE_COUNT}];
  uniform vec3 colors[${MAX_PARTICLE_COUNT}];

  void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;

    float r = 0.0;
    float g = 0.0;
    float b = 0.0;

    for (int i = 0; i < ${MAX_TRAIL_COUNT}; i++) {
      if (i < trailCount) {
        vec2 trailPos = trail[i];
        float value = float(i) / distance(st, trailPos.xy) * 0.00015; 
        g += value * 0.3;
        b += value;
      }
    }

    float mult = 0.00001;

    for (int i = 0; i < ${MAX_PARTICLE_COUNT}; i++) {
      if (i < starsCount) {
        vec3 particle = stars[i];
        vec2 pos = particle.xy;
        float mass = particle.z;
        vec3 color = colors[i];

        r += color.r / distance(st, pos) * mult * mass;
        g += color.g / distance(st, pos) * mult * mass;
        b += color.b / distance(st, pos) * mult * mass;
      }
    }

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;
