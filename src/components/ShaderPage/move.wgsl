const PI = 3.141592653589793f;

struct Agent {
  position: vec2f,
  angle: f32,
};
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
@group(0) @binding(0) var<storage, read_write> agents: array<Agent>;
@group(0) @binding(1) var trailTexIn: texture_2d<f32>;
@group(0) @binding(2) var trailTexOut: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(3) var<uniform> uniforms: Uniforms;
@compute @workgroup_size(8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  if (id.x >= u32(uniforms.agentNum)) { return; }
  
  var agent = agents[id.x];
  var random : u32 = hash(u32(agent.position.y * uniforms.gridSize.x + agent.position.x) + hash(id.x + u32(uniforms.time * 100000.0)));
  var facing : vec2f = vec2f(cos(agent.angle), sin(agent.angle));
  var frontSensor : vec2f = agent.position + facing * uniforms.sensorDistance;
  
  var leftFacing : vec2f = vec2f(cos(agent.angle - uniforms.sensorAngle), sin(agent.angle - uniforms.sensorAngle));
  var leftSensor : vec2f = agent.position + leftFacing * uniforms.sensorDistance;
  
  var rightFacing : vec2f = vec2f(cos(agent.angle + uniforms.sensorAngle), sin(agent.angle + uniforms.sensorAngle));
  var rightSensor : vec2f = agent.position + rightFacing * uniforms.sensorDistance;
  
  frontSensor = clamp(frontSensor, vec2f(0.0), vec2f(uniforms.gridSize.x - 0.01, uniforms.gridSize.y - 0.01));
  leftSensor = clamp(leftSensor, vec2f(0.0), vec2f(uniforms.gridSize.x - 0.01, uniforms.gridSize.y - 0.01));
  rightSensor = clamp(rightSensor, vec2f(0.0), vec2f(uniforms.gridSize.x - 0.01, uniforms.gridSize.y - 0.01));
  
  let frontIndex = vec2i(frontSensor);
  let leftIndex = vec2i(leftSensor);
  let rightIndex = vec2i(rightSensor);
  
  let white = vec4f(1.0);
  let frontStrength = dot(white, textureLoad(trailTexIn, frontIndex, 0));
  let leftStrength = dot(white, textureLoad(trailTexIn, leftIndex, 0));
  let rightStrength = dot(white, textureLoad(trailTexIn, rightIndex, 0));
  
  let steerStrength = scaleToRange01(random);
  
  if (leftStrength > frontStrength && leftStrength > rightStrength)
  {
      agent.angle -= steerStrength * uniforms.turnRate * uniforms.deltaTime;
  }
  else if (rightStrength > frontStrength && rightStrength > leftStrength)
  {
      agent.angle += steerStrength * uniforms.turnRate * uniforms.deltaTime;
  }
  else if (leftStrength > frontStrength && rightStrength > frontStrength)
  {
      agent.angle += (steerStrength - 0.5) * 2 * uniforms.turnRate * uniforms.deltaTime;
  }
  else
  {
      agent.angle += 0;
  }
  
  agents[id.x].angle = agent.angle;
  
  var direction :vec2f = vec2f(cos(agent.angle), sin(agent.angle));
  var newPos : vec2f = agent.position + direction * uniforms.moveSpeed * uniforms.deltaTime;
  
  if (newPos.x < 0.0 || newPos.x >= uniforms.gridSize.x || newPos.y < 0.0 || newPos.y >= uniforms.gridSize.y)
  {
    random = hash(random);
    newPos = clamp(newPos, vec2f(0.0), vec2f(uniforms.gridSize.x, uniforms.gridSize.y));
    agents[id.x].angle = scaleToRange01(random) * 2 * PI;
  }
  
  agents[id.x].position = newPos;
  textureStore(trailTexOut, vec2i(newPos), vec4f(1.0));
}

fn hash(state: u32) -> u32 {
  var s = state;
  s ^= 2747636419u;
  s *= 2654435769u;
  s ^= s >> 16;
  s *= 2654435769u;
  s ^= s >> 16;
  s *= 2654435769u;
  return s;
}

fn scaleToRange01(num : u32) -> f32 {
    return f32(num) / 4294967295.0;
}