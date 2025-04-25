export function isWebGPUSupported() {
    return !!navigator.gpu;
}

export async function initializeWebGPU(canvas) {
    if (!isWebGPUSupported()) {
        throw new Error('WebGPU is not supported in this browser.');
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error('No WebGPU adapter found.');
    }

    const device = await adapter.requestDevice();
    const context = canvas.getContext('webgpu');
    const format = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
        device,
        format,
    });

    return { device, context, format };
}