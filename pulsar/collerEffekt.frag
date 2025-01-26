precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Normale und Position normalisieren
  vec3 normal = normalize(vNormal);
  vec3 position = normalize(vPosition);

  // Strahlen basierend auf der Nähe zu den Polen
  float polarEffect = abs(normal.z); // Nähe zur Z-Achse (Pol)

  // Erzeuge pulsierende Strahlen
  float timeEffect = sin(uTime * 5.0 + polarEffect * 20.0) * 0.5 + 0.5;

  // Verstärke den Polar-Effekt
  float intensity = polarEffect * timeEffect * 2.0; // Strahlenstärke verstärken

  // Basisfarbe
  vec3 baseColor = vec3(0.2, 0.5, 1.0);

  // Finaler Strahleneffekt
  vec3 glowColor = baseColor * intensity;

  // Begrenze die maximale Leuchtkraft auf 1.0
  glowColor = min(glowColor, vec3(1.0));

  gl_FragColor = vec4(glowColor, 1.0);
}
