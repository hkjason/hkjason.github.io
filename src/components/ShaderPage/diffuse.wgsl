struct Uniforms {
  gridSize: vec2<f32>, //8
  agentNum: f32, //4
  time: f32, //4 16
  deltaTime: f32, //4
  moveSpeed: f32, //4
  turnRate: f32, //4
  sensorAngle: f32, //4 32
  sensorDistance: f32, //4
  decayRate: f32, //4
  diffuseRate: f32, //4 
  _padding: f32, //padding 4 = 48
};

@group(0) @binding(0) var trailTexIn: texture_2d<f32>;
@group(0) @binding(1) var trailTexOut: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> uniforms: Uniforms;
@compute @workgroup_size(8, 8)
fn diffuse(@builtin(global_invocation_id) id: vec3u) {
  let gridX : u32 = u32(uniforms.gridSize.x);
  let gridY : u32 = u32(uniforms.gridSize.y);

  if (id.x >= gridX) { return; }
  if (id.y >= gridY) { return; }
  
  let pos : vec2u = vec2u(id.x, id.y);
  
  var sum : f32 = 0.0;
  
  //here is a 3x3 diffuse, from x = -1, y = -1 to x = 1, y = 1;
  for (var dx : u32 = 0; dx <= 2; dx++)
  {
    for (var dy : u32 = 0; dy <= 2; dy++)
    {
       let sampleX = clamp(id.x + dx - 1, 0, gridX - 1);
       let sampleY = clamp(id.y + dy - 1, 0, gridY - 1);
       let sampleLoc = vec2u(sampleX, sampleY);
       sum += textureLoad(trailTexIn, sampleLoc, 0).x;
    }
  }
  
  sum /= 9;
  
  var diffuseWeight : f32 = clamp(uniforms.diffuseRate * uniforms.deltaTime, 0.0, 1.0);
  var diffusedVal : f32 = textureLoad(trailTexIn, pos, 0).x * (1- diffuseWeight) + sum * diffuseWeight;
  diffusedVal = max(diffusedVal - uniforms.decayRate * uniforms.deltaTime , 0.0);
  
  textureStore(trailTexOut, pos, vec4f(diffusedVal));
}