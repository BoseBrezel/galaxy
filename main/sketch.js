var start = true;
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

var universebool = false;
let galaxy = [];
const maxGalaxyParticles = 2000;
let angleOffset = 0; // Offset für die Spirale
const numGalaxyStars = 30; // Anzahl der Partikel pro Frame
const spiralTurns = 3; // Anzahl der Windungen der Spirale
const maxRadius = 200; // Maximale Entfernung der Spirale von der Mitte
const depthFactor = 5000; // Tiefe der Spirale für Perspektive

var startgate = false;
let exclusionRadius = 60;

var startgate_back_bool = false;

var big_crunch = false;

var big_rip_bool = false;

var pulsar = false;
let radius = 200; // Radius der Kugel
let centerX = 0, centerY = 0; // Mittelpunkt der Kugel im WebGL-Canvas
let distanceFactor = 2; // Abstandsfaktor für den blauen Punkt und türkise Punkte
let x1, y1, z1; // Oben auf der Kugel
let x4, y4, z4; // Unten auf der Kugel
let x5, y5, z5; // Punkt außerhalb der Kugel
let x6, y6, z6; // Erster Kontrollpunkt zwischen rot und blau
let x7, y7, z7; // Zweiter Kontrollpunkt zwischen blau und grün
let numCurves = 12; // Anzahl der Kurven
let time = 0; // Zeit für Animation
let pulsarDistance = -6000; // Startentfernung des Pulsars
let pulsarApproachSpeed = 5; //eig 5  

let y5Base = 0; // Basis für noise
let y5Offset = 0; // Dynamischer Offset

let x5Base = 0; // Basis für noise
let x5Offset = 0; // Dynamischer Offset

let z5Base = 0; // Basis für noise
let z5Offset = 0; // Dynamischer Offset


let yBase = 0; // Basis für noise
let yOffset = 0; // Dynamischer Offset

let xBase = 0; // Basis für noise
let xOffset = 0; // Dynamischer Offset

let zBase = 0; // Basis für noise
let zOffset = 0; // Dynamischer Offset

let flying_stars = []; 
let flying_stars_back = []; 

let camera;

var startTime;

//Sounds
let explosionMP3;
let explosionPlayed = false;

let atmosMP3;
let atmosmusicPlayed = false;

let darknessMp3;
let darknessMp3Played = false;

function preload() {
  theShader = new p5.Shader(this.renderer, vertShader, fragShader);
  atmosMP3 = loadSound('music/atmosphere-sound-effect.mp3');
  explosionMP3 = loadSound('music/explosion.mp3');
  darknessMp3 = loadSound('music/Darkness-1.mp3');

} 
function setup()
{
  startTime = millis();
  pixelDensity(1);
  noStroke();
  atmosMP3.loop();
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);


  canvas.canvas.oncontextmenu = () => false; // Removes right-click menu.
  noCursor();

  shaderTexture = createGraphics(windowWidth, windowHeight, WEBGL);
  shaderTexture.noStroke();

  // Initialisiere Partikel
  for (let i = 0; i < MAX_PARTICLE_COUNT; i++) {
    let x = random(0, windowWidth);
    let y = random(0, windowHeight);
    stars.push(new Particle(x, y, mouseX, mouseY));
  }

  //pulsar
  smooth();  // Aktiviert die Kantenglättung
    // Initialisiere feste Punkte
    x1 = centerX;
    y1 = centerY - radius;
    z1 = 0;
  
    x4 = centerX;
    y4 = centerY + radius;
    z4 = 0;

  //starGate
  for (let i = 0; i < 500; i++) {
    flying_stars.push(new FylingStar());
  }
  //starGate_back
  for (let i = 0; i < 500; i++) {
    flying_stars_back.push(new FylingStar_back());
  }

// Erstelle 1000 Partikel für die Galaxie
for (let i = 0; i < maxGalaxyParticles; i++) {
  let angle = random(TWO_PI * spiralTurns);
  let radius = (angle / (TWO_PI * spiralTurns)) * maxRadius;
  let x = width / 2 + cos(angle + angleOffset) * radius;
  let y = height / 2 + sin(angle + angleOffset) * radius;
  let z = sin(angle + angleOffset) * depthFactor;
  
  galaxy.push(new Galaxy(x, y, angle, radius, z));
}
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
}

function draw(){

  background(0);
 // Berechnung des Vektors von der Mitte des Bildschirms zur Kugel

  // Andere Szenen
  if (start) {
    start_explosion();
  }
  if (startgate)
  {
    pulsar = true
    startgate_start();
  }
  if (pulsar) {
    pulsarSzene();
  }
  if (startgate_back_bool)
  {
    startgate_back();
  }

  if (big_rip_bool) {
    big_rip();
  }
}



function mousePressed()
{
  if (!explosionTriggered)
  {
    mousePressedSpeedBoost = true; // Aktivieren des Geschwindigkeitsboosts
    mousePressStartTime = millis(); // Startzeitpunkt speichern
  }
  
}

function mouseReleased()
{
  mousePressedSpeedBoost = false; // Deaktivieren des Geschwindigkeitsboosts

}
function start_explosion()
{  
  let elapsedTime = millis() - startTime;
    if (elapsedTime < 10000)
    {
      return;
    }
    else{
      push(); // Speichert den aktuellen Transformationszustand
      if(!darknessMp3Played)
        {
          darknessMp3.play(); 
          darknessMp3Played = true; 
        }
      if (!explosionTriggered)
        {
          // Trim end of trail.
          trail.push([mouseX, mouseY]);
          if (trail.length > MAX_TRAIL_COUNT) {
            trail.splice(0, 1);
          }
        }
        else
        {
          // Entferne den Trail nach der Explosion
          if (trail.length > 0)
          {
            trail.splice(0, 1); // Reduziere die Trail-Länge
          }
        }
      
        translate(-width / 2, -height / 2);
      
        if (!explosionTriggered)
        {
          // Prüfe, ob alle Partikel die Mausposition erreicht haben
          let allReached = true;
          for (let i = 0; i < stars.length; i++) {
            if (!stars[i].reached(mouseX, mouseY)) {
              allReached = false;
              break;
            }
          }
          // Wenn alle angekommen und Maus gedrückt ist, Explosion auslösen
          if (allReached && mouseIsPressed)
          {
            explosionTriggered = true;
            explosionMP3.play(); 

            for (let i = 0; i < stars.length; i++)
            {
              stars[i].explode();
            }
          }
        }
        else if (!allParticlesGone)
        {
          // Prüfe, ob alle Partikel das Sichtfeld verlassen haben
          allParticlesGone = stars.every((particle) => particle.isOutOfView());
        }
        if(allParticlesGone)
        {
          startgate = true;
          shader = false;
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
      
        pop();
    }  
}
function keyPressed() {
  if (key === 'm') {
    if (pulsarDistance > -301)
    { 
      startgate = false; 
      startgate_back_bool = true; 
      let pulsarShrinkInterval = setInterval(() =>
      {
        if(pulsarDistance >= -4000 )
        {
          pulsarDistance -= 15;
          exclusionRadius -= 0.2;
        }
        else
        {
          clearInterval(pulsarShrinkInterval); // Intervall stoppen, wenn Pulsar vollständig zurückgezogen ist
          pulsar = false; // Pulsar deaktivieren
        }
      }, 16); // Aktualisierung mit 60 FPS
    }
  }
  if (key === 'r') { // 'r' für Big Rip
    big_rip_bool = true;
    //universebool = false; // Deaktiviert andere Szenen
  }
}

function startgate_start()
{
  push(); // Speichert den aktuellen Transformationszustand
  if(exclusionRadius > 30)
  {
    exclusionRadius += 0.23;
  } 
  for (let i = 0; i < flying_stars.length; i++) {
    flying_stars[i].display(exclusionRadius);
    flying_stars[i].update();
 }
 pop();
}
function pulsarSzene()
{  
  // Berechnung der Annäherung
  if(!startgate_back_bool)
  {
    if(pulsarDistance < radius - 500) { // Stoppt, wenn der Pulsar nah genug ist
      pulsarDistance += pulsarApproachSpeed;
      exclusionRadius += 0.23;
    }
  }
 
  // Kamera-Einstellung für Entfernung
  push();

  translate(width / 2, height / 2, pulsarDistance);

  // Kugel rotieren lassen
  rotateY(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateZ(frameCount * 0.01);

  // Kugel
  noStroke();
  normalMaterial();
  sphere(radius);

  // Zufällige Schimmerfarbe generieren
  let shimmerColor = color(
    map(sin(frameCount * 0.05), -1, 1, 0, 255), // Rot-Intensität
    map(cos(frameCount * 0.05), -1, 1, 0, 255), // Grün-Intensität
    map(sin(frameCount * 0.05 + PI / 2), -1, 1, 0, 255) // Blau-Intensität
  );
  let northPolePosition = createVector(0, -150, 0); // Nordpol-Zylinder
  let southPolePosition = createVector(0, 150, 0); // Südpol-Zylinder
  
  push();
  fill(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2], 50); // Halbtransparenter Zylinder
  cylinder(40, 8200, 24, 1); // Großer Zylinder für Schimmer-Effekt
  emissiveMaterial(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2]); // Leuchtende Farbe
  cylinder(10, 8000, 24, 1); // Langer Zylinder für den Strahl

  pop();

  // Schimmer-Effekt für den Südpol-Zylinder
  push();
  fill(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2], 50); // Halbtransparenter Zylinder
  cylinder(40, 8200, 24, 1); // Großer Zylinder für Schimmer-Effekt
  emissiveMaterial(shimmerColor.levels[0], shimmerColor.levels[1], shimmerColor.levels[2]); // Leuchtende Farbe
  cylinder(10, 8000, 24, 1); // Langer Zylinder für den Strahl

  pop();

  //y5Noise
  y5Base += 0.004; // Fortschritt für noise
  y5Offset = map(noise(y5Base), 0, 1, -50, 100); // Rauschwert skalieren

  z5Base += 0.004; // Fortschritt für noise
  z5Offset = map(noise(y5Base), 0, 1, -50, 100); // Rauschwert skalieren

  x5Base += 0.004; // Fortschritt für noise
  x5Offset = map(noise(y5Base), 0, 1, -50, 100); // Rauschwert skalieren
  
  //y6 Noise
  yBase += 0.008; // Fortschritt für noise
  yOffset = map(noise(yBase), 0, 1, -50, 50); // Rauschwert skalieren

  zBase += 0.008; // Fortschritt für noise
  zOffset = map(noise(yBase), 0, 1, -50, 50); // Rauschwert skalieren

  xBase += 0.008; // Fortschritt für noise
  xOffset = map(noise(yBase), 0, 1, -50, 50); // Rauschwert skalieren

  y5 = (y4 + y1) / 2 + y5Offset; // Dynamischer y5-Wert
  y6 = centerY - radius + yOffset;
  y7 = centerY + radius - yOffset;

  for (let i = 0; i < numCurves; i++)
  {
    let angleOffset = (TWO_PI / numCurves) * i;
    let x5 = centerX + radius * distanceFactor * cos(angleOffset) + x5Offset / 60 ;
    let z5 = radius * distanceFactor * sin(angleOffset) + z5Offset / 60;

    let x6 = (x1 + x5) / 2 + xOffset;
    let z6 = (z1 + z5) / 2 + zOffset; 
    let x7 = (x5 + x4) / 2 - xOffset;
    let z7 = (z5 + z4) / 2 - zOffset;

    beginShape();
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    curveVertex(0, 0, 0);
    curveVertex(x1, y1, z1);
    curveVertex(x6, y6, z6);
    curveVertex(x5, y5, z5); // Dynamischer Punkt
    curveVertex(x7, y7, z7);
    curveVertex(x4, y4, z4);
    curveVertex(0, 0, 0);
    endShape();
  }

  time += 0.01;
  pop();
}

function startgate_back()
{
  let allStopped = true; // Annahme: alle Sterne stehen still

  push(); // Speichert den aktuellen Transformationszustand

  for (let i = 0; i < flying_stars_back.length; i++) {
    flying_stars_back[i].display(exclusionRadius);
    flying_stars_back[i].update();

    // Prüfen, ob mindestens ein Stern sich noch bewegt
    if (flying_stars_back[i].m > 0) {
      allStopped = false;
    }
  }

  pop();
  // Wenn alle Sterne gestoppt sind, wechsle zur Galaxie
  if (allStopped) {
    universebool = true; // Aktiviere die Galaxie-Szene
  }
}


function big_crunch()
{
 
}
function big_rip() {
  push();

  // Update Galaxy Particles
  for (let particle of galaxy)
  {
    particle.bigRipUpdate();
    particle.show();
  }

  // Update Flying Stars
  for (let star of flying_stars_back)
  {
    star.bigRipUpdate();
    star.display(exclusionRadius);
  }

  pop();
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
