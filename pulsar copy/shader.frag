#version 300 es
precision highp float;

uniform vec2 resolution;
uniform int particleCount;
uniform vec3 particles[500];
uniform vec3 colors[500];

out vec4 fragColor;

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;  // Skalierung der Pixel-Koordinaten

  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

  // Partikel berechnen
  float mult = 0.00005;  // Stärkerer Effekt für das Leuchten
  for (int i = 0; i < particleCount; i++) {
    vec3 particle = particles[i];
    vec2 pos = particle.xy;
    float mass = particle.z;  // Die z-Komponente (Kugelradius) als "Masse"
    vec3 color = colors[i];

    // Berechne die Distanz vom aktuellen Fragment zu jedem Partikel
    float distanceToParticle = distance(st, pos.xy / resolution.xy);

    // Berechne die Leuchtkraft basierend auf der Entfernung
    r += color.r / distanceToParticle * mult * mass;
    g += color.g / distanceToParticle * mult * mass;
    b += color.b / distanceToParticle * mult * mass;
  }

  // Stärkere Farben für den Leuchteffekt
  fragColor = vec4(min(r, 1.0), min(g, 1.0), min(b, 1.0), 1.0);
}
