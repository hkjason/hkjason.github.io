@group(0) @binding(0) var trailTex: texture_2d<f32>;
@group(0) @binding(1) var samp: sampler;

struct VSOut { 
  @builtin(position) pos: vec4f, 
  @location(0) uv: vec2f 
};

@vertex 
fn vs(@builtin(vertex_index) i: u32) -> VSOut {
  var pos = array<vec2f, 6>(
    vec2f(-1, -1), vec2f(1, -1), vec2f(-1, 1),
    vec2f(-1, 1), vec2f(1, -1), vec2f(1, 1)
  );
  var uv = (pos[i] + vec2f(1.0)) * 0.5;
  return VSOut(vec4f(pos[i], 0, 1), uv);
}

@fragment 
fn fs(input: VSOut) -> @location(0) vec4f {
  let intensity = textureSample(trailTex, samp, input.uv).x;

  
  let colorA = vec3f(1.0, 0.8, 0.439);  
  let colorB = vec3f(0.784, 0.314, 0.753);  
  let colorC = vec3f(0.255, 0.345, 0.816); 
  let colorD = vec3f(0.051, 0.106, 0.165);  
  
  var color: vec3f;
  if (intensity <= 0.33) {
      let t = intensity / 0.33;
      color = mix(colorD, colorC, t);
  } else if (intensity <= 0.88) {
      let t = (intensity - 0.33) / (0.88 - 0.33);
      color = mix(colorC, colorB, t);
  } else {
      let t = (intensity - 0.88) / (1.0 - 0.88);
      color = mix(colorB, colorA, t);
  }
  
  return vec4f(color, 1.0);
}