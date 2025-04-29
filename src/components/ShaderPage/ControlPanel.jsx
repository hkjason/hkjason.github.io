import { useState } from 'react';
import SliderInput from './SliderInput';

import styles from './ControlPanel.module.css';

export function ControlPanel({speed, setSpeed,
                              turnRate, setTurnRate, 
                              sensorAngle, setSensorAngle,
                              sensorDistance, setSensorDistance,
                              decayRate, setDecayRate,
                              diffuseRate, setDiffuseRate,}) {
  const [speedS, setSpeedLocal] = useState(speed);
  const [turnRateS, setTurnRateLocal] = useState(turnRate);
  const [sensorAngleS, setSensorAngleLocal] = useState(sensorAngle);
  const [sensorDistanceS, setSensorDistanceLocal] = useState(sensorDistance);
  const [decayRateS, setDecayRateLocal] = useState(decayRate);
  const [diffuseRateS, setDiffuseRateLocal] = useState(diffuseRate);
  
  const setSpeedS = (val) => {
    setSpeedLocal(val);
    setSpeed(val);
  }
  const setTurnRateS = (val) => {
    setTurnRateLocal(val);
    setTurnRate(val);
  }
  const setSensorAngleS = (val) => {
    setSensorAngleLocal(val);
    setSensorAngle(val);
  }
  const setSensorDistanceS = (val) => {
    setSensorDistanceLocal(val);
    setSensorDistance(val);
  }
  const setDecayRateS = (val) => {
    setDecayRateLocal(val);
    setDecayRate(val);
  }
  const setDiffuseRateS = (val) => {
    setDiffuseRateLocal(val);
    setDiffuseRate(val);
  }
  
  return (
    <div className={styles.panel}>
      Physarum (Slime Mold) Simulation
      <SliderInput label="Speed" min={0.0} max={500.0} step={0.5} value={speedS} onChange={setSpeedS} />
      <SliderInput label="Turn Rate" min={0.0} max={500.0} step={0.5} value={turnRateS} onChange={setTurnRateS} />
      <SliderInput label="Sensor Angle" min={0.1} max={179.9} step={0.1} value={sensorAngleS} onChange={setSensorAngleS} />
      <SliderInput label="Sensor Distance" min={0.1} max={100.0} step={0.1} value={sensorDistanceS} onChange={setSensorDistanceS} />
      <SliderInput label="Decay Rate" min={0.0} max={200.0} step={0.01} value={decayRateS} onChange={setDecayRateS} />
      <SliderInput label="DiffuseRate" min={0.0} max={200.0} step={0.01} value={diffuseRateS} onChange={setDiffuseRateS} />
    </div>
  );
}
