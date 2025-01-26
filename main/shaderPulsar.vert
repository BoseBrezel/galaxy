#version 300 es
precision highp float;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

in vec3 aPosition;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}