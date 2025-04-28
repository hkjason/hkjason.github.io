import React from 'react';
import styles from './ShaderPageError.module.css';

export function ShaderPageError() {
  return (
      <div className={styles.container}>
        <h2>WebGPU Not Supported</h2>
        <p>Your browser or device does not support WebGPU, or hardware acceleration is disabled.</p>

        <p>WebGPU is currently supported on:</p>
        <ul className={styles.list}>
          <li>Google Chrome (version 113+)</li>
          <li>Microsoft Edge (version 113+)</li>
          <li>Safari Technology Preview (macOS)</li>
          <li>Firefox Nightly (experimental support)</li>
        </ul>

        <p>To enable WebGPU:</p>
        <ul className={styles.list}>
          <li>In Chrome: Settings → System → Enable "Use hardware acceleration when available". Restart Chrome.</li>
          <li>In Chrome/Edge: Visit <code className={styles.code}>chrome://flags</code> → Enable <strong>WebGPU</strong>.</li>
          <li>In Firefox Nightly: Visit <code className={styles.code}>about:config</code> → Set <code className={styles.code}>dom.webgpu.enabled</code> to <code>true</code>.</li>
          <li>Make sure your GPU drivers are updated and WebGPU-compatible.</li>
        </ul>

        <p>Learn more about WebGPU: <a href="https://web.dev/webgpu/" target="_blank" rel="noopener noreferrer" className={styles.link}>web.dev/webgpu</a></p>
      </div>
  );
}