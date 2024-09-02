import { useState, useEffect, useRef } from 'react';
import styles from './SelectInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SelectInput = ({
  label,
  fieldName,
  filteredRestaurants,
  filters,
  setFilters,
  restaurantLists,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [optionsCheckStatus, setOptionsCheckStatus] = useState([]);
  const [effectRun, setEffectRun] = useState(false);

  const dropDownRef = useRef(null); // To handle closing dropdown when clicking anywhere on the page; we use 'useRef' to access DOM element directly (similar to document.querySelector in vanilla JavaScript) (here we will assign this ref to parent <div> for showOptions), dropdownRef.current accesses the actual DOM element that the ref is pointing to

  // Set filter options based on all restaurants
  useEffect(() => {
    if (!effectRun && filteredRestaurants.length > 0) {
      setOptionsCheckStatus(
        [...new Set(restaurantLists.map((obj) => obj[fieldName]))].map((option) => ({
          label: option,
          isSelected: false,
        }))
      );
      setEffectRun(true);
    }
  }, [filters, effectRun]);

  const toggleOptions = (event) => {
    setShowOptions((prevShowOptions) => !prevShowOptions);
  };

  // To handle closing dropdown when clicking anywhere on the page
  useEffect(() => {
    const handleClickOutside = (event) => {
      // dropdownRef.current accesses the actual DOM element that the ref is pointing to; .contains checks whether the click (event.target -> the element clicked) is inside dropDown.current (i.e. <div> with the ref={dropDown}), if not then set showOptions to false (i.e. when user clicks outside the filter box, will set showOptions to false)
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    // Adding the click event to document (i.e. the entire DOM, which is the entire web browser)
    if (showOptions) {
      document.addEventListener('click', handleClickOutside, true); // setting true: ensure the click event to be catched by handleClickOutside function before any other click event listeners that might be set on child elements
    } else {
      document.removeEventListener('click', handleClickOutside, true);
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showOptions]);

  // Handle filter selection by the user
  const handleCheckboxChange = (optionLabel) => {
    const updatedOptions = optionsCheckStatus.map((option) => {
      if (option.label === optionLabel) {
        return { ...option, isSelected: !option.isSelected };
      }
      return option;
    });
    setOptionsCheckStatus(updatedOptions);
    const updatedFilters = updatedOptions
      .map((obj) => {
        if (obj.isSelected) {
          return obj.label;
        }
      })
      .filter((el) => el); // since .map return undefined, further use .filter to remove undefined
    setFilters((prevFilters) => ({ ...prevFilters, [fieldName]: updatedFilters }));
  };

  // Handle the case when Select All button is clicked
  const handleMasterCheckboxChange = () => {
    const allSelected = optionsCheckStatus.every((option) => option.isSelected);
    const updatedOptions = optionsCheckStatus.map((option) => {
      return { ...option, isSelected: !allSelected };
    });
    setOptionsCheckStatus(updatedOptions);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [fieldName]: updatedOptions.map((option) => option.label), // if unselected all, all options will be included in the filters
    }));
  };

  // Handle input changes in the filter's searchbox
  const handleInputChange = (e) => {
    const input = e.target.value;
    setFilterText(input);
  };

  const filterResult =
    filterText === '' || !filterText
      ? optionsCheckStatus
      : optionsCheckStatus.filter((option) => {
          return option.label.includes(filterText);
        });

  return (
    <div className={styles.dropdownFilter} ref={dropDownRef}>
      <div className={styles.dropdownLabel} onClick={toggleOptions}>
        <span className={styles.labelText}>{label}</span>
        <span className={styles.dropDownIndicator}>
          {' '}
          Select{' '}
          {showOptions ? (
            <FontAwesomeIcon icon="fa-caret-up" />
          ) : (
            <FontAwesomeIcon icon="fa-caret-down" />
          )}
        </span>
      </div>
      {showOptions && (
        // added below ref
        <div className={styles.dropDownOptions}>
          <label className={styles.selectAllLabel}>
            <input
              type="checkbox"
              checked={optionsCheckStatus.every((option) => option.isSelected)}
              onChange={handleMasterCheckboxChange}
            ></input>
            Select All
          </label>
          <input
            className={styles.textInputBox}
            type="text"
            placeholder="🖊 Search..."
            onChange={handleInputChange}
          ></input>
          {filterResult.map((option) => (
            <div key={option.label} className={styles.selectOption}>
              <label htmlFor={option.label} className={styles.selectOptionLabel}>
                <input
                  id={option.label}
                  type="checkbox"
                  checked={option.isSelected}
                  onChange={() => handleCheckboxChange(option.label)}
                ></input>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectInput;
