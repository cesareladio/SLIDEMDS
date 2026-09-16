export const earthVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPositionW;
varying vec3 vTangentW;
varying vec3 vBitangentW;

void main() {
  vUv = uv;
  vNormalW    = normalize(mat3(modelMatrix) * normal);
  vPositionW  = (modelMatrix * vec4(position, 1.0)).xyz;

  // Build sphere tangent frame (avoid poles by clamping theta singularity)
  vec3 N = normalize(vNormalW);
  vec3 upAxis = abs(N.y) < 0.999 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vTangentW   = normalize(cross(upAxis, N));
  vBitangentW = normalize(cross(N, vTangentW));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const earthFragmentShader = /* glsl */ `
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform sampler2D specularMap;
uniform sampler2D normalMap;
uniform vec3 sunDirection;
uniform float nightIntensity;
uniform float exposure;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPositionW;
varying vec3 vTangentW;
varying vec3 vBitangentW;

vec3 tonemapACES(vec3 x) {
  float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

void main() {
  vec3 N = normalize(vNormalW);
  vec3 T = normalize(vTangentW);
  vec3 B = normalize(vBitangentW);

  // Tangent-space normal mapping
  vec3 nSample = texture2D(normalMap, vUv).rgb * 2.0 - 1.0;
  vec3 mappedNormal = normalize(T * nSample.x + B * nSample.y + N * nSample.z);

  vec3 sunDir   = normalize(sunDirection);
  vec3 viewDir  = normalize(cameraPosition - vPositionW);
  float NDotL   = dot(mappedNormal, sunDir);
  float dayMix  = smoothstep(-0.22, 0.26, NDotL);

  vec3 dayColor   = pow(texture2D(dayMap, vUv).rgb, vec3(2.2));   // linearize sRGB
  vec3 nightColor = pow(texture2D(nightMap, vUv).rgb, vec3(2.2));

  // Specular — Blinn-Phong on ocean, suppressed on land
  float oceanMask  = texture2D(specularMap, vUv).r;
  vec3 halfVec     = normalize(sunDir + viewDir);
  float spec       = pow(max(dot(mappedNormal, halfVec), 0.0), 80.0) * oceanMask * dayMix * 0.55;

  // City lights fade near terminator
  float nightFade  = smoothstep(-0.05, -0.30, NDotL);
  float cityBright = nightColor.r * 0.6 + nightColor.g * 0.3 + nightColor.b * 0.1;
  vec3  cityLights = nightColor * nightIntensity * nightFade;

  // Blend
  vec3 color = mix(cityLights, dayColor, dayMix);
  color += vec3(spec);

  // Very subtle blue scatter near terminator
  float termZone = (1.0 - abs(NDotL)) * 0.045;
  color += vec3(0.20, 0.44, 0.72) * termZone * smoothstep(-0.25, 0.25, NDotL);

  // Exposure + ACES
  color *= exposure;
  color = tonemapACES(color);

  gl_FragColor = vec4(color, 1.0);
}
`

export const atmosphereVertexShader = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPositionW;
void main() {
  vNormalW   = normalize(mat3(modelMatrix) * normal);
  vPositionW = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const atmosphereFragmentShader = /* glsl */ `
uniform vec3 glowColor;
uniform float intensity;
varying vec3 vNormalW;
varying vec3 vPositionW;
void main() {
  vec3  viewDir = normalize(cameraPosition - vPositionW);
  float fresnel = pow(1.0 - max(dot(normalize(vNormalW), viewDir), 0.0), 4.2);
  float rim     = smoothstep(0.28, 1.0, fresnel);
  gl_FragColor  = vec4(glowColor, rim * intensity);
}
`
