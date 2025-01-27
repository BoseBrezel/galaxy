var start = false;
const MAX_PARTICLE_COUNT = 70;
const MAX_TRAIL_COUNT = 30;

var colorScheme = ["#48A3FA", "#230A59", "#91225B"];
var shaded = false;
var theShader;
var shaderTexture;
var trail = [];
var stars = [];
var explosionTriggered = false; 
var allParticlesGone = false; 

let angleOffset = 0; // Offset für die Spirale

var startgate = false;
let exclusionRadius = 20;

var startgate_back_bool = false;

var big_crunch = false;

var big_rip_bool = false;

var pulsar = true;
var rotation = 0.0;
let shaderDistance = 30.0;
let radius = 200; 
let centerX = 0;
 centerY = 0; 
let distanceFactor = 2; 
let x1, y1, z1; 
let x2, y2, z2;
let x3, y3, z3; 
let x4, y4, z4; 
let x5, y5, z7; 
let numCurves = 12; 
let time = 0; 
let pulsarDistance = -6000; 
let pulsarApproachSpeed = 7; 

let y3Base = 0; 
let y3Offset = 0;
let x3Base = 0;
let x3Offset = 0; 
let z3Base = 0; 
let z3Offset = 0;
let yBase = 0; 
let yOffset = 0;
let xBase = 0; 
let xOffset = 0; 
let zBase = 0; 
let zOffset = 0; 

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
    // Laden der Shader
    pulsarShader = loadShader("shaderPulsar.vert","shaderPulsar.frag");
    glowShader = loadShader("shaderGlow.vert","shaderGlow.frag");
    // Laden der Noise-Textur
    noiseTextureImg = loadImage("rgb_noise_med.png");
    starsTexturImg = loadImage("stars.jpg");
  
  atmosMP3 = loadSound('music/atmosphere-sound-effect.mp3');
  explosionMP3 = loadSound('music/explosion.mp3');
  darknessMp3 = loadSound('music/Darkness-1.mp3');

} 

function setupShader()
{
  // Erstellen der Grapfik-Buffer
  pulsarShaderTexture = createGraphics(width,height,WEBGL);
  pulsarShaderTexture.noStroke();

  glowShaderTexture = createGraphics(width,height,WEBGL);
  glowShaderTexture.noStroke();
  
  filterShad = createFilterShader(filterShadS);
  
}
function drawShader(){
  // Shader anzeigen
  pulsarShaderTexture.shader(pulsarShader);
  // Uniforms in Shader laden
  pulsarShader.setUniform('iResolution', [width, height, 0.2]);
  pulsarShader.setUniform('iTime', millis() / 1000.0);
  pulsarShader.setUniform("iRot1",0);
  pulsarShader.setUniform("iChannel0", noiseTextureImg);
  pulsarShader.setUniform("iMouse",[0,0,mouseX,mouseY]);
  
  // In der Textur muss etwas gemalt werden, damit sie sichtbarist
  // Keine Ahnung warum, aber ich mach die regeln auch nicht
  pulsarShaderTexture.rect(0,0);

  glowShaderTexture.shader(glowShader);

  glowShader.setUniform('iResolution', [width, height, 0.2]);
  glowShader.setUniform('iTime', millis() / 1000.0);
  glowShader.setUniform("iRot1",0);
  glowShader.setUniform("iChannel0", starsTexturImg);
  glowShader.setUniform("iMouse",[0,0,mouseX,mouseY]);

  glowShaderTexture.rect(0,0);

  filterShad.setUniform('iResolution', [width, height, 0.2]);
  filterShad.setUniform('iTime', frameCount/100.0);
  filterShad.setUniform("iPitch",rotation);
  filterShad.setUniform("iYaw",rotation);
  shaderDistance = pulsarDistance/-800;
  filterShad.setUniform("iDistance", shaderDistance);

  filterShad.setUniform("iRadii",[0.880,0.900,0.910,0.915,0.920,0.925,0.930,0.935,0.940,0.945,0.960,0.970])

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
  
    x2 = centerX;
    y2 = centerY + radius;
    z2 = 0;

  //starGate
  for (let i = 0; i < 500; i++) {
    flying_stars.push(new FylingStar());
  }
  //starGate_back
  for (let i = 0; i < 500; i++) {
    flying_stars_back.push(new FylingStar_back());
  }
  setupShader();
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
    startgate_start();
  }
  if(pulsar)
  {
    pulsarSzene();
  }
  if (startgate_back_bool)
  {
    startgate = false; 
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
    if (elapsedTime < 10)
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
          pulsar = true;
        }
        if(allParticlesGone)
        {
          shader = false;
          startgate = true;
          start = false;
          return;
        }
      
        // Move and render particles
        for (let i = stars.length - 1; i >= 0; i--) {
          stars[i].move();
        }
      
        if (shaded)
        {
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
function keyPressed()
{
  if (key === 'm') {
    if (pulsarDistance > -301)
    { 
      startgate = false; 
      startgate_back_bool = true; 
      let pulsarShrinkInterval = setInterval(() =>
      {
        if(pulsarDistance >= -8000 )
        {
          pulsarDistance -= 15;
          if(exclusionRadius >= 0){
            exclusionRadius -= 0.9;
          }
        }
        else
        {
          pulsar = false;          
        }
      }, 16); // Aktualisierung mit 60 FPS
    }
  }
  if (key === 'r') { // 'r' für Big Rip
    big_rip_bool = true;
  }
}

function startgate_start()
{
  push();
  translate(-width / 2, -height / 2);

  if(exclusionRadius < 30)
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

  //Shader Malen
  drawShader();
  
  rotation = frameCount * 0.01;
  // Kamera-Einstellung für Entfernung
  push();

  translate(0, 0, pulsarDistance);

  // Kugel rotieren lassen
  rotateX(rotation);
  rotateY(rotation);
  rotateZ(rotation);
 
  // Kugel
  noStroke();
  normalMaterial();
  texture(pulsarShaderTexture);
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

  //y3Noise
  y3Base += 0.004; // Fortschritt für noise
  y3Offset = map(noise(y3Base), 0, 1, -50, 100); // Rauschwert skalieren

  z3Base += 0.004; // Fortschritt für noise
  z3Offset = map(noise(y3Base), 0, 1, -50, 100); // Rauschwert skalieren

  x3Base += 0.004; // Fortschritt für noise
  x3Offset = map(noise(y3Base), 0, 1, -50, 100); // Rauschwert skalieren
  
  //y4 Noise
  yBase += 0.008; // Fortschritt für noise
  yOffset = map(noise(yBase), 0, 1, -50, 50); // Rauschwert skalieren

  zBase += 0.008; // Fortschritt für noise
  zOffset = map(noise(yBase), 0, 1, -50, 50); // Rauschwert skalieren

  xBase += 0.008; // Fortschritt für noise
  xOffset = map(noise(yBase), 0, 1, -50, 50); // Rauschwert skalieren

  y3 = (y2 + y1) / 2 + y3Offset; // Dynamischer y3-Wert
  y4 = centerY - radius + yOffset;
  y5 = centerY + radius - yOffset;

  for (let i = 0; i < numCurves; i++)
  {
    let angleOffset = (TWO_PI / numCurves) * i;
    let x3 = centerX + radius * distanceFactor * cos(angleOffset) + x3Offset / 60 ;
    let z3 = radius * distanceFactor * sin(angleOffset) + z3Offset / 60;

    let x4 = (x1 + x3) / 2 + xOffset;
    let z4 = (z1 + z3) / 2 + zOffset; 
    let x5 = (x3 + x2) / 2 - xOffset;
    let z7 = (z3 + z2) / 2 - zOffset;

    beginShape();
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    curveVertex(0, 0, 0);
    curveVertex(x1, y1, z1);
    curveVertex(x4, y4, z4);
    curveVertex(x3, y3, z3); // Dynamischer Punkt
    curveVertex(x5, y5, z7);
    curveVertex(x2, y2, z2);
    curveVertex(0, 0, 0);
    endShape();
  }

  time += 0.01;
  pop();
  if (pulsarDistance> -6000 )
    filter(filterShad);
}

function startgate_back()
{
  let allStopped = true; // Annahme: alle Sterne stehen still

  push(); // Speichert den aktuellen Transformationszustand
  translate(-width / 2, -height / 2);

  for (let i = 0; i < flying_stars_back.length; i++) {
    flying_stars_back[i].display(exclusionRadius);
    flying_stars_back[i].update();

    // Prüfen, ob mindestens ein Stern sich noch bewegt
    if (flying_stars_back[i].m > 0) {
      allStopped = false;
    }
  }

  pop();
}

function big_rip()
{
  // Aktualisiere die Position aller Sterne im Big Rip
  let allGone = true;
  for (let i = 0; i < flying_stars_back.length; i++)
  {
    flying_stars_back[i].bigRipUpdate();
    // Wenn mindestens ein Stern noch angezeigt wird, ist allGone false
    if(flying_stars_back[i].toDraw)
    {
      allGone = false;
    }
}
  // Wenn alle Sterne verschwunden sind, setze `start` zurück
  if (allGone)
  {
    big_rip_bool = false; // Beende den Big Rip
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

let filterShadS = `
precision highp float;
// x,y coordinates, given from the vertex shader
varying vec2 vTexCoord;

// the canvas contents, given from filter()
uniform sampler2D tex0;
// other useful information from the canvas
uniform vec2 texelSize;
uniform vec2 canvasSize;
// a custom variable from this sketch

uniform vec3 iResolution;
uniform float iTime;
uniform float iPitch;
uniform float iYaw;
uniform float iDistance;
uniform float iRadii[12];
  
float noisySine(float angle)
{
  float total = 0.0;
  for (int i = 3; i < 10; i++)
  {
      float randomValue = fract(tan(100.0*float(i) + 10.2));
      total += pow(1.14,-float(i))*sin(angle*float(i) + 6.28*randomValue + iTime*0.6);
      total += pow(1.14,-float(i))*sin(angle*float(i) - 6.28*randomValue - iTime*0.6);
  }
  total = pow(total, 2.0);
  return total;
}

vec3 dither(vec2 p)
{
  p += vec2(10.0*iTime, 25.0*iTime);
  p += vec2(14.23245, 6.876543);
  p *= vec2(2.43563,  2.786543);
  vec2 s  = vec2(p.y, p.x);
  vec2 r  = p * p;
  r += s;
  r  = fract(100.43*sin(r));
  r += sin(s*3.245);
  r += cos(p*1.24532);
  r  = fract(r);
  vec3 q = vec3(1.0) + 0.1*(2.0*vec3(r.r, (r.g + r.r)/2.0, r.g) - vec3(1));
  return q;
}

vec3 tanh(vec3 x)
{
  vec3 ret = 1.0-(2.0/(exp(2.0*x) +1.0));
  return ret;
}

mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, -s,
        0.0, s, c
    );
}

mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        c, 0.0, s,
        0.0, 1.0, 0.0,
        -s, 0.0, c
    );
}

mat3 rotateZ(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        c, -s, 0.0,
        s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

vec4 glowyMcGlowFace(vec2 fragCoord)
{
  float returnBool = 0.0;
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = fragCoord/1.0;
  
  float m = max(iDistance,2.0);
  
  vec3 position      = vec3(0,0,-1.0* max(iDistance,2.0));
  vec3 viewDirection = vec3(0,0,1) + vec3(fragCoord.x - iResolution.x/2.0, fragCoord.y - iResolution.y/2.0, 0)/iResolution.x * m;
  viewDirection      = normalize(viewDirection);
  
vec3 baseDirection = vec3(0.0, 0.0, 1.0); // Beam pointing along Z by default
mat3 rotationMatrix = rotateZ(iPitch) * rotateY(iPitch) * rotateX(iPitch);
vec3 directionRealSpace = normalize(rotationMatrix * baseDirection);
  vec3 cameraRightRealSpace = vec3(1,0,0);
  vec3 cameraUpRealSpace    = -normalize(vec3(0,1,1));
  vec3 cameraFwdRealSpace   = normalize(vec3(0,1,-1));
  
  vec3 direction = vec3(dot(cameraRightRealSpace, directionRealSpace), dot(cameraUpRealSpace, directionRealSpace), dot(cameraFwdRealSpace, directionRealSpace));
  
  // Star
  vec3 col = vec3(0,0,0);
  col += vec3(1.0,1.0,1)  * exp((-1.0-dot(viewDirection, normalize(position)))*1000.0) * 10.0;
  col += vec3(0.6,0.75,1) * exp((-1.0-dot(viewDirection, normalize(position)))*110.0) * (1.0 + 0.9*pow(dot(direction, -normalize(position)),6.0));
  col += vec3(0.3,0.5,1)  * exp((-1.0-dot(viewDirection, normalize(position)))*16.0 ) * (1.0 + 1.3*pow(dot(direction, -normalize(position)),6.0)) * 0.8 * (1.0 + 0.03*noisySine(atan(viewDirection.y,viewDirection.x)));
  col += vec3(0.1,0.3,1)  * exp((-1.0-dot(viewDirection, normalize(position)))*1.0  ) * (1.0 + 1.5*pow(dot(direction, -normalize(position)),6.0)) * 0.1;
  
  // Jets
  vec3 jetColor = vec3(0.4, 0.6, 1.0) * 0.1;
   
  
  float vd = dot(viewDirection, direction);
  float vr = dot(viewDirection, position);
  float vv = dot(viewDirection, viewDirection);
  float rd = dot(position, direction);
  float rr = dot(position, position);
  
  for (int i = 0; i < 12; i++)
  {
      float a = iRadii[i];
      float intensity = 1.0;
      
      float inSqrt = (2.0*(vd*rd - vr*a*a))*(2.0*(vd*rd - vr*a*a))-4.0*(vd*vd-a*a*vv)*(rd*rd-a*a*rr);
      if (inSqrt > 0.0)
      {
          float distA = (-(2.0*(vd*rd - vr*a*a))-sqrt(inSqrt))/(2.0*(vd*vd-a*a*vv));
          float distB = (-(2.0*(vd*rd - vr*a*a))+sqrt(inSqrt))/(2.0*(vd*vd-a*a*vv));
          bool amInsideJet = rd*rd/rr > a*a;
          bool lookingAlongJet = vd*vd > a*a;
          bool jetIsBackwards = distA < 0.0;

          if (!amInsideJet && !lookingAlongJet && !jetIsBackwards)
          {
              float pos1 = pow(dot(distA*viewDirection + position, direction),2.0);
              float pos2 = pow(dot(distB*viewDirection + position, direction),2.0);
              
              intensity = -dot(normalize((distA + distB)*viewDirection/2.0 + position), viewDirection)+1.3;

              col += abs((1.0/pos1 - 1.0/pos2)/vd)*jetColor*intensity;
          }
          if (amInsideJet && !lookingAlongJet)
          {
              distB = 0.0;
              returnBool = 1.0;
              float pos1 = pow(dot(distA*viewDirection + position, direction),2.0);
              float pos2 = pow(dot(distB*viewDirection + position, direction),2.0);
              
              intensity = -dot(normalize((distA + distB)*viewDirection/2.0 + position), viewDirection)+1.3;

              col += abs((1.0/pos1 - 1.0/pos2)/vd)*jetColor*intensity;
          }
          if (!amInsideJet && lookingAlongJet)
          {
              returnBool =-1.0;
              float pos1 = pow(dot(distB*viewDirection + position, direction),2.0);
              
              intensity = -dot(normalize((1000.0 + distB)*viewDirection/2.0 + position), viewDirection)+1.3;

              col += abs((1.0/pos1)/vd)*jetColor*intensity;
          }
          if (amInsideJet && lookingAlongJet)
          {       

            returnBool = 2.0;     
              float pos1 = pow(dot(distA*viewDirection + position, direction),2.0);
              float pos2 = pow(dot(  0.0*viewDirection + position, direction),2.0);
              
              intensity = -dot(normalize((distA + 0.0)*viewDirection/2.0 + position), viewDirection)+1.3;


              col += abs((1.0/pos1 - 1.0/pos2)/vd)*jetColor*intensity;

              if (vr < 0.0)
              {
                  float pos1 = pow(dot(distB*viewDirection + position, direction),2.0);
                  intensity = -dot(normalize((1000.0 + distB)*viewDirection/2.0 + position), viewDirection)+1.3;


                  col += abs((1.0/pos1)/vd)*jetColor*intensity;
              }
          }
      }
  }
  
  col*= dither(fragCoord);
  
  col = tanh(2.5*col);
  return vec4(col,returnBool);
}
void main() {
  // get the color at current pixel
  vec4 color = texture2D(tex0, vTexCoord);
  // set the output color
   vec2 fragCoord = gl_FragCoord.xy;
  vec4 returnVec = glowyMcGlowFace(fragCoord);
 if(color.rgb == vec3(0.,0.,0.)){
      color.rgb = returnVec.rgb;
  }
  if(returnVec.a > 1.0){
    // we are looking inside the jet
    color.r *= 1.5;
    color.g *= 1.5;
    color.b *= 1.5;
  }else{
    if(returnVec.a > 0.0){
    //we are looking along the jet

      color.g *= 1.2;
      color.b *= 1.2;
    }else{
      if(returnVec.a < 0.0){
      //we are looking at the jet
        color.r *= 1.1;
        color.g *= 1.1;
        color.b *= 1.1;
      }
    }
  }
  if(distance(fragCoord.xy,canvasSize*0.5)< 280.0*(1.0/iDistance)){
    color.rgb += returnVec.rgb *100.0/(distance(fragCoord.xy,canvasSize*0.5)*distance(fragCoord.xy,canvasSize*0.5)) ; 
  }
  gl_FragColor = vec4(color.rgb, 1.0);
}
`;