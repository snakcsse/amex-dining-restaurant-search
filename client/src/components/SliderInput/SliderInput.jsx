import React from 'react';
import { useEffect, useState } from 'react';
import styles from './SliderInput.module.css';
import ReactSlider from 'react-slider';

const SliderInput = ({ label, max, min, selectedRange, setSelectedRange }) => {
  const [showSlider, setShowSlider] = useState(false);

  const handleSliderChange = ([min, max]) => {
    setSelectedRange([min, max]);
  };

  const toggle = () => {
    setShowSlider(!showSlider);
  };

  return (
    <div className={styles.container}>
      <label className={styles.dropdownLabel} onClick={toggle}>
        {label} {showSlider ? '▲' : '▼'}
      </label>
      {showSlider && (
        <>
          <ReactSlider
            className={styles.slider}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            max={parseInt(max)}
            min={parseInt(min)}
            step={0.1}
            defaultValue={[selectedRange[0], selectedRange[1]]}
            onChange={handleSliderChange} // ReactSlider will automatically pass in [min,max] of the slider value to the function
          />
          <div className={styles.rangeValues}>
            <span>{selectedRange[0]}</span>
            <span>{selectedRange[1]}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default SliderInput;
