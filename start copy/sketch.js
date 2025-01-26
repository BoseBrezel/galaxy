let stars = [];
let numStars = 100;
const MAX_PARTICLE_COUNT = 200;
const MAX_TRAIL_COUNT = 30;

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
  createCanvas(windowWidth, windowHeight, WEBGL);

  for (let i = 0; i < numStars; i++) {
    stars.push(new Star(random(width), random(height)));
  }

  shaderTexture = createGraphics(width, height, WEBGL);
  shaderTexture.noStroke();
}

function draw() {
  background(0);

  // Update und zeichne Sterne
  for (let star of stars) {
    star.update();
    star.show();
  }

  if (shaded) {
    // Shader vorbereiten
    shaderTexture.shader(theShader);

    let starData = serializeStars();

    theShader.setUniform("resolution", [width, height]);
    theShader.setUniform("starCount", stars.length);
    theShader.setUniform("stars", starData.stars);
    theShader.setUniform("colors", starData.colors);

    shaderTexture.rect(0, 0, width, height);
    texture(shaderTexture);

    rect(0, 0, width, height);
  } else {
    for (let star of stars) {
      star.show();
    }
  }
}

function serializeStars() {
  let data = {
    stars: [],
    colors: [],
  };

  for (let star of stars) {
    data.stars.push(
      map(star.x, 0, width, 0.0, 1.0),
      map(star.y, 0, height, 1.0, 0.0),
      star.r / 10.0 // Normalisierter Radius
    );

    let colorIndex = int(random(colorScheme.length));
    let starColor = colorScheme[colorIndex];

    data.colors.push(red(starColor) / 255.0, green(starColor) / 255.0, blue(starColor) / 255.0);
  }

  return data;
}



function Particle(x, y, vx, vy) {
  this.pos = new p5.Vector(x, y);       // Startposition
  this.vel = new p5.Vector(vx, vy);     // Geschwindigkeit
  this.vel.mult(random(3));            // Zufällige anfängliche Geschwindigkeit
  this.mass = random(10, 30);          // Masse des Partikels
  this.airDrag = 0.98;                 // Luftwiderstand
  this.colorIndex = int(random(colorScheme.length)); // Zufällige Farbwahl

  this.move = function() {
    this.vel.mult(this.airDrag);       // Geschwindigkeit durch Luftwiderstand reduzieren
    this.pos.add(this.vel);            // Position aktualisieren
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