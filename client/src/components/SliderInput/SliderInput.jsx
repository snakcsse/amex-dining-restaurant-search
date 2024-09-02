import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './SliderInput.module.css';
import ReactSlider from 'react-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import debounce from 'lodash.debounce';

const SliderInput = ({ label, max, min, step, fieldName, filters, setFilters }) => {
  const [showSlider, setShowSlider] = useState(false);
  const [sliderMinMax, setSliderMinMax] = useState([min, max]);
  const dropDown = useRef(null);

  // Update the filter only after 0.5s to avoid updating the filter continuously when the user adjusts the slider
  const debouncedSetFilters = useCallback(
    debounce((newFilters) => {
      setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    }, 500),
    []
  );

  const handleSliderChange = ([min, max]) => {
    setSliderMinMax([min, max]);
    debouncedSetFilters({ [fieldName]: [min, max] });
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      debouncedSetFilters.cancel();
    };
  }, [debouncedSetFilters]);

  const toggle = () => {
    setShowSlider(!showSlider);
  };

  // In the first render min max is 0,5 (rating) and 0,2000 (rating count), here we update the max  from initial render based on the restaurant data
  useEffect(() => {
    setSliderMinMax([min, max]);
  }, [min, max]);

  // Hide the slider when the user clicks anywhere of the browser
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDown.current && !dropDown.current.contains(e.target)) {
        setShowSlider(false);
      }
    };

    if (showSlider) {
      document.addEventListener('click', handleClickOutside, true);
    } else {
      document.removeEventListener('click', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showSlider]);

  return (
    <div className={styles.container} ref={dropDown}>
      <div className={styles.dropdownLabel} onClick={toggle}>
        <span className={styles.labelText}>{label}</span>
        <span className={styles.dropDownIndicator}>
          {' '}
          Select{' '}
          {showSlider ? (
            <FontAwesomeIcon icon="fa-caret-up" />
          ) : (
            <FontAwesomeIcon icon="fa-caret-down" />
          )}
        </span>
      </div>

      {showSlider && (
        <div className={styles.dropDownOptions}>
          <div className={styles.dropDownOptionText}>Set {label} range</div>
          <ReactSlider
            className={styles.slider}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            max={max}
            min={min}
            step={step}
            defaultValue={[filters[fieldName][0], filters[fieldName][1]]}
            onChange={handleSliderChange} // ReactSlider will automatically pass in [min,max] of the slider value to the function
          />
          <div className={styles.rangeValues}>
            <span>{sliderMinMax[0]}</span>
            <span>{sliderMinMax[1].toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderInput;
