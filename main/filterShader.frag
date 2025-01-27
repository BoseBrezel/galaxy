
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