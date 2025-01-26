const MAX_PARTICLE_COUNT = 2;
const MAX_TRAIL_COUNT = 3;

var colorScheme = ["#48A3FA", "#230A59", "#91225B"];
var shaded = true;
var theShader;
var shaderTexture;
var trail = [];
var particles = [];

function preload() {
  theShader = new p5.Shader(this.renderer, vertShader, fragShader);
}

function setup() {
  pixelDensity(1);

  let canvas = createCanvas(
    min(windowWidth, windowHeight),
    min(windowWidth, windowHeight),
    WEBGL);

  canvas.canvas.oncontextmenu = () => false; // Removes right-click menu.
  noCursor();

  shaderTexture = createGraphics(width, height, WEBGL);
  shaderTexture.noStroke();
}

function draw() {
  background(9);
  noStroke();
  //circleSizeX = map(noise(frameCount*0.003), 0, 1, 300, -200);
  //circleSizeX = map(noise(frameCount*0.005), 0, 1, 500, -500);
  circleSizeX = map(sin(frameCount*0.04), -1, 1, -200, 200);
  circleSizeY = mouseX;
  //circleSizeX = map(cos(frameCount*0.01), -1, 1, 300, -150);
  //circleSizeY = random(0, 300);
  noiseSpeed = 0.006;
  
  countPosition = 0.01;
  
  speed = 10;
  
  var posX = width / 2 + sin(countPosition * speed) * circleSizeX;
  var posY = height / 2 + cos(countPosition * speed) * circleSizeY;

  var posX1 = width / 2 + sin(countPosition * speed + 1) * circleSizeX;
  var posY1 = height / 2 + cos(countPosition * speed + 1) * circleSizeY;

  // Trim end of trail.
  trail.push([posX1, posY1]);

  let removeCount = 1;
  if (mouseIsPressed && mouseButton == CENTER) {
    removeCount++;
  }

  for (let i = 0; i < removeCount; i++) {
    if (trail.length == 0) {
      break;
    }

    if (mouseIsPressed || trail.length > MAX_TRAIL_COUNT) {
      trail.splice(0, 1);
    }
  }

  // Spawn particles.
  if (trail.length > 1 && particles.length < MAX_PARTICLE_COUNT) {


    let mouse = new p5.Vector(posX, posY);
    mouse.sub(posX1, posY1);
    if (mouse.mag() > 10) {
      mouse.normalize();
      particles.push(new Particle(posX1, posY1, mouse.x, mouse.y));
    }
  }

  translate(-width / 2, -height / 2);

  // Move and kill particles.
  for (let i = particles.length - 1; i > -1; i--) {
    particles[i].move();
    if (particles[i].vel.mag() < 0.1) {
      particles.splice(i, 1);
    }
  }

  if (shaded) {
    // Display shader.
    shaderTexture.shader(theShader);

    let data = serializeSketch();

    theShader.setUniform("resolution", [width, height]);
    theShader.setUniform("trailCount", trail.length);
    theShader.setUniform("trail", data.trails);
    theShader.setUniform("particleCount", particles.length);
    theShader.setUniform("particles", data.particles);
    theShader.setUniform("colors", data.colors);

    shaderTexture.rect(0, 0, width, height);
    texture(shaderTexture);

    rect(0, 0, width, height);
  } else {
    // Display points.
    stroke(255, 200, 0);
    for (let i = 0; i < particles.length; i++) {
      point(particles[i].pos.x, particles[i].pos.y);
    }

    stroke(0, 255, 255);
    for (let i = 0; i < trail.length; i++) {
      point(trail[i][0], trail[i][1]);
    }
  }
}

function mousePressed() {
  if (mouseButton == RIGHT) {
    shaded = !shaded;
  }
}

function serializeSketch() {
  data = {
    "trails": [],
    "particles": [],
    "colors": []
  };

  for (let i = 0; i < trail.length; i++) {
    data.trails.push(
      map(trail[i][0], 0, width, 0.0, 1.0),
      map(trail[i][1], 0, height, 1.0, 0.0));
  }

  for (let i = 0; i < particles.length; i++) {
    data.particles.push(
      map(particles[i].pos.x, 0, width, 0.0, 1.0),
      map(particles[i].pos.y, 0, height, 1.0, 0.0),
      particles[i].mass * particles[i].vel.mag() / 100)

    let itsColor = colorScheme[particles[i].colorIndex];
    data.colors.push(red(itsColor), green(itsColor), blue(itsColor));
  }

  return data;
}


function Particle(x, y, vx, vy) {
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(vx, vy);
  this.vel.mult(random(3));
  this.vel.rotate(radians(random(-5, 5)));
  this.mass = random(1000, 3010);
  this.airDrag = 0.98;
  this.colorIndex = int(random(colorScheme.length));

  this.move = function() {
    this.vel.mult(this.airDrag);
    this.pos.add(this.vel);
  }
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
	uniform int particleCount;
	uniform vec3 particles[${MAX_PARTICLE_COUNT}];
	uniform vec3 colors[${MAX_PARTICLE_COUNT}];

	void main() {
			vec2 st = gl_FragCoord.xy / resolution.xy;  // Warning! This is causing non-uniform scaling.

			float r = 0.0;
			float g = 0.0;
			float b = 0.0;

			for (int i = 0; i < ${MAX_TRAIL_COUNT}; i++) {
				if (i < trailCount) {
					vec2 trailPos = trail[i];
					float value = float(i) / distance(st, trailPos.xy) * 0.00015;  // Multiplier may need to be adjusted if max trail count is tweaked.
					g += value * 0.5;
					b += value;
				}
			}

			float mult = 0.00001;
			
			for (int i = 0; i < ${MAX_PARTICLE_COUNT}; i++) {
				if (i < particleCount) {
					vec3 particle = particles[i];
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