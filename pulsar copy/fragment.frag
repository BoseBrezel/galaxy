precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Berechne die Intensität des Lichts basierend auf der Normalen
  float intensity = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;

  // Verstärke die Intensität für einen stärkeren Glow
  intensity = pow(intensity, 3.0) * 4.0; // Erhöhe den Verstärkungsfaktor und verwende eine größere Potenz

  // Farbänderung basierend auf der Zeit (dynamische Farbe)
  vec3 baseColor = vec3(0.3 + 0.7 * sin(uTime * 0.5), 0.3 + 0.7 * cos(uTime * 0.5), 1.0);
  vec3 glowColor = baseColor * intensity; // Glow-Farbe mit verstärkter Intensität

  // Begrenze die maximale Leuchtkraft auf 1.0
  glowColor = min(glowColor, vec3(1.0));

  gl_FragColor = vec4(glowColor, 1.0); // Endgültige Farbe mit Glow
}
