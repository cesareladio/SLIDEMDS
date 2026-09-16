export const earthVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPositionW;
void main() {
  vUv = uv;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vPositionW = (modelMatrix * vec4(position, 1.0)).xyz;
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
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPositionW;

void main() {
  vec3 normal = normalize(vNormalW);
  vec3 relief = texture2D(normalMap, vUv).rgb - 0.5;
  float reliefShade = dot(relief, vec3(0.3, 0.3, 0.9)) * 0.16;
  float sunFacing = dot(normal, normalize(sunDirection)) + reliefShade;
  float dayMix = smoothstep(-0.18, 0.22, sunFacing);

  vec3 dayColor = texture2D(dayMap, vUv).rgb;
  vec3 nightColor = texture2D(nightMap, vUv).rgb * nightIntensity;
  float specularMask = texture2D(specularMap, vUv).r;

  vec3 viewDir = normalize(cameraPosition - vPositionW);
  vec3 halfVector = normalize(normalize(sunDirection) + viewDir);
  float specular = pow(max(dot(normal, halfVector), 0.0), 46.0) * specularMask * dayMix;

  vec3 color = mix(nightColor, dayColor, dayMix);
  color += specular * 0.55;

  float terminatorGlow = (1.0 - abs(sunFacing)) * 0.06 * smoothstep(0.35, -0.1, sunFacing) * smoothstep(-0.35, 0.1, sunFacing);
  color += vec3(0.25, 0.55, 0.85) * terminatorGlow;

  gl_FragColor = vec4(color, 1.0);
}
`

export const atmosphereVertexShader = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPositionW;
void main() {
  vNormalW = normalize(mat3(modelMatrix) * normal);
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
  vec3 viewDir = normalize(cameraPosition - vPositionW);
  float fresnel = pow(1.0 - max(dot(normalize(vNormalW), viewDir), 0.0), 3.2);
  float rim = smoothstep(0.35, 1.0, fresnel);
  gl_FragColor = vec4(glowColor, rim * intensity);
}
`
