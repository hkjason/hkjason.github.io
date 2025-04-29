import { useState } from 'react';

function SliderInput({ label, min, max, step = 1, value, onChange }) {
  return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem', minWidth: '100px' }}>{label}</label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{ flex: 1 }}
        />
        <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{ width: '80px', marginLeft: '1rem' }}
        />
      </div>
  );
}

export default SliderInput;