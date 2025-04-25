precision mediump float;
uniform float uTime;
varying vec2 vUv;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float r = rand(vUv + uTime);
    float g = rand(vUv + uTime + 10.0);
    float b = rand(vUv + uTime + 20.0);
    gl_FragColor = vec4(r, g, b, 1.0);
}