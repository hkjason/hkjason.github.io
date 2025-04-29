import { useEffect, useRef, useState } from 'react';
import { ShaderPageError } from "./ShaderPageError.jsx";
import { ControlPanel } from "./ControlPanel.jsx";

import styles from "./ShaderPage.module.css";

import moveShader from './move.wgsl?raw';
import diffuseShader from './diffuse.wgsl?raw';
import renderShader from './render.wgsl?raw';

export function ShaderPage() {
    const canvasRef = useRef();
    const [isWebGPUSupported, setIsWebGPUSupported] = useState(true);

    const gridSizeX= 1920; //1080
    const gridSizeY =1080; //2160
    const agentCount = useRef(100000);
    const time = useRef(0.0);
    const deltaTime = useRef(0.0);
    const moveSpeed = useRef(92.5);
    const turnRate = useRef(75.0);
    const sensorAngle = useRef(31.9);
    const sensorDistance = useRef(11.6);
    const decayRate = useRef(0.4);
    const diffuseRate = useRef(0.174);
    
    const setSpeed = (val) => moveSpeed.current = val;
    const setTurnRate = (val) => turnRate.current = val;
    const setSensorAngle = (val) => sensorAngle.current = val;
    const setSensorDistance = (val) => sensorDistance.current = val;
    const setDecayRate = (val) => decayRate.current = val;
    const setDiffuseRate = (val) => diffuseRate.current = val;
    
    
    useEffect(() => {
        const canvas = canvasRef.current;
        async function checkWebGPU() {
            if (!navigator.gpu) {
                const errorMessage = 'WebGPU is not supported in this browser. Please use a WebGPU-compatible browser (e.g., Chrome 113+ or Edge 113+).';
                console.error(errorMessage);
                return false;
            }

            try {
                const adapter = await navigator.gpu.requestAdapter();
                if (!adapter) {
                    const errorMessage = 'No GPU adapter found. Please ensure hardware acceleration is enabled or use a device with a compatible GPU.';
                    console.error(errorMessage);
                    return false;
                }
                return adapter; // Return adapter if valid
            } catch (err) {
                const errorMessage = `WebGPU initialization failed: ${err.message}`;
                console.error(errorMessage);
                return false;
            }
        }
        
        let agentBuffer, uniformBuffer, trailTextureA, trailTextureB;
        let animationFrameId;

        checkWebGPU().then(async (adapter) => {
            if (!adapter) {
                setIsWebGPUSupported(false);
                return;
            }
            
            const device = await adapter.requestDevice();
            const context = canvas.getContext('webgpu');

            const format = navigator.gpu.getPreferredCanvasFormat();
            context.configure({ device, format });
            
            const uniformData = new Float32Array(12);
            uniformData[11] = 0.0; //padding
            uniformBuffer = device.createBuffer({
                label: "uniform buff",
                size: 48,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            device.queue.writeBuffer(uniformBuffer, 0 , uniformData);
            
            const agents = new Float32Array(agentCount.current * 4); // x, y, degree
            for (let i = 0; i < agentCount.current; i++) {
                agents[i * 4] = Math.random() * gridSizeX;
                agents[i * 4 + 1] = Math.random() * gridSizeY;
                agents[i * 4 + 2] = Math.random() * Math.PI * 2.0;
                agents[i * 4 + 3] = 0.0; //padding
            }
            agentBuffer = device.createBuffer({
                label: "agent buffer",
                size: agents.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
                mappedAtCreation: true,
            });
            new Float32Array(agentBuffer.getMappedRange()).set(agents);
            agentBuffer.unmap();
            
            trailTextureA = device.createTexture({
                label: "trail texture A",
                size: [gridSizeX, gridSizeY],
                format: 'rgba8unorm',
                usage:
                    GPUTextureUsage.STORAGE_BINDING |
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_SRC,
            });
            
            trailTextureB = device.createTexture({
                label: "trail texture B",
                size: [gridSizeX, gridSizeY],
                format: 'rgba8unorm',
                usage:
                    GPUTextureUsage.STORAGE_BINDING |
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_SRC,
            })
            
            const shaderModule = device.createShaderModule({
                label: "move shader",
                code: moveShader,
            });
            
            const diffuseModule = device.createShaderModule({
                label: "diffuse shader",
                code: diffuseShader, 
            });

            const renderModule = device.createShaderModule({
                label: "render shader",
                code: renderShader,
            });

            const computePipeline = device.createComputePipeline({
                label: "compute pipeline",
                layout: 'auto',
                compute: {
                    module: shaderModule,
                    entryPoint: 'main',
                },
            });
            
            const diffusePipeline = device.createComputePipeline({
                label: "diffuse pipeline",
                layout: 'auto',
                compute: {
                    module: diffuseModule,
                    entryPoint: 'diffuse',
                },
            });
            
            const renderPipeline = device.createRenderPipeline({
                label: "render pipeline",
                layout: 'auto',
                vertex: { 
                    module: renderModule, 
                    entryPoint: 'vs' 
                },
                fragment: {
                    module: renderModule,
                    entryPoint: 'fs',
                    targets: [{ format }],
                },
                primitive: { topology: 'triangle-list' },
            });

            const sampler = device.createSampler();
            const viewA = trailTextureA.createView();
            const viewB = trailTextureB.createView();

            const computeBindGroupA = device.createBindGroup({
                label: "compute bind group A",
                layout: computePipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: { buffer: agentBuffer } },
                    { binding: 1, resource: viewA },
                    { binding: 2, resource: viewB },
                    { binding: 3, resource: { buffer: uniformBuffer} },
                ],
            });

            const computeBindGroupB = device.createBindGroup({
                label: "compute bind group B",
                layout: computePipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: { buffer: agentBuffer } },
                    { binding: 1, resource: viewB },
                    { binding: 2, resource: viewA },
                    { binding: 3, resource: { buffer: uniformBuffer} },
                ],
            });

            const diffuseBindGroupA = device.createBindGroup({
                label: "diffuse bind group A",
                layout: diffusePipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: viewB },
                    { binding: 1, resource: viewA },
                    { binding: 2, resource: { buffer: uniformBuffer} },
                ],
            });

            const diffuseBindGroupB = device.createBindGroup({
                label: "diffuse bind group B",
                layout: diffusePipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: viewA },
                    { binding: 1, resource: viewB },
                    { binding: 2, resource: { buffer: uniformBuffer} },
                ],
            });

            const renderBindGroupA = device.createBindGroup({
                label: "renderBindGroupA",
                layout: renderPipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: viewA },
                    { binding: 1, resource: sampler },
                ],
            });

            const renderBindGroupB = device.createBindGroup({
                label: "renderBindGroupB",
                layout: renderPipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: viewB },
                    { binding: 1, resource: sampler },
                ],
            });
            
            let useA = true;
            let lastTime = performance.now();
            function frame() {
                const encoder = device.createCommandEncoder();

                const now = performance.now();
                const delta = (now - lastTime) / 1000;
                lastTime = now;
                
                uniformData[0] = 1920;//gridSizeX
                uniformData[1] = 1080;//gridSizeY;
                uniformData[2] = 100000;//agentCount;
                uniformData[3] += delta; //Time.time
                uniformData[4] = delta; //Time.deltaTime
                uniformData[5] = moveSpeed.current;//moveSpeed
                uniformData[6] = turnRate.current;//turnRate
                uniformData[7] = sensorAngle.current;//sensorAngle
                uniformData[8] = sensorDistance.current;//sensorDistance
                uniformData[9] = decayRate.current;//decayRate
                uniformData[10] = diffuseRate.current;//diffuseRate
                
                device.queue.writeBuffer(uniformBuffer, 0, uniformData);
                
                const computePass = encoder.beginComputePass();
                computePass.setPipeline(computePipeline);
                computePass.setBindGroup(0, useA ? computeBindGroupA : computeBindGroupB);
                computePass.dispatchWorkgroups(Math.ceil(agentCount.current / 8));
                computePass.end();
                
                const diffusePass = encoder.beginComputePass();
                diffusePass.setPipeline(diffusePipeline);
                diffusePass.setBindGroup(0, useA ? diffuseBindGroupA : diffuseBindGroupB);
                diffusePass.dispatchWorkgroups(Math.ceil(gridSizeX/8), Math.ceil(gridSizeY/8));
                diffusePass.end();

                const renderView = context.getCurrentTexture().createView();
                const renderPass = encoder.beginRenderPass({
                    colorAttachments: [
                        {
                            view: renderView,
                            loadOp: 'clear',
                            storeOp: 'store',
                            clearValue: { r: 0, g: 0, b: 0, a: 1 },
                        },
                    ],
                });
                renderPass.setPipeline(renderPipeline);
                renderPass.setBindGroup(0, useA ? renderBindGroupA : renderBindGroupB);
                renderPass.draw(6);
                renderPass.end();

                device.queue.submit([encoder.finish()]);
                animationFrameId = requestAnimationFrame(frame);
                
                useA = !useA;
            }
            animationFrameId = requestAnimationFrame(frame);
        });
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            uniformBuffer?.destroy();
            agentBuffer?.destroy();
            trailTextureA?.destroy();
            trailTextureB?.destroy();
        }
    }, []);

    if (!isWebGPUSupported) {
        return <ShaderPageError />;
    }

    return (
        <div className={styles.container}>
            <canvas className = {styles.canvas} ref={canvasRef} width={1920} height={1080}/>;
            <div className = {styles.controlPanel}>
                <ControlPanel 
                    speed = {moveSpeed.current} setSpeed={setSpeed}
                    turnRate={turnRate.current} setTurnRate={setTurnRate}
                    sensorAngle={sensorAngle.current} setSensorAngle={setSensorAngle}
                    sensorDistance={sensorDistance.current} setSensorDistance={setSensorDistance}
                    decayRate={decayRate.current} setDecayRate={setDecayRate}
                    diffuseRate={diffuseRate.current} setDiffuseRate={setDiffuseRate}
                />
            </div>
        </div>
    );
}
