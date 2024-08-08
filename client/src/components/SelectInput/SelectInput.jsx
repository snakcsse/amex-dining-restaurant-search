import React from 'react';
import { useState, useEffect } from 'react';
import styles from './SelectInput.module.css';

const SelectInput = ({ label, fieldName, filteredRestaurants, filters, setFilters }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [optionsCheckStatus, setOptionsCheckStatus] = useState([]);
  const [effectRun, setEffectRun] = useState(false);

  // similar to SearchContext, using useEffect such that optionsCheckStatus is updated when selectedOptions(a prop) is updated
  // to ensure the below useEffect once run once after we fetch the restaurant data, we include the state effectRun. Otherwise, since when we check/uncheck checkboxes, selectedOptions will change, which will trigger the below again if we don't include effectRun
  useEffect(() => {
    if (!effectRun && filteredRestaurants.length > 0) {
      setOptionsCheckStatus(
        filters[fieldName].map((option) => ({ label: option, isSelected: false }))
      ); // after this has happen -> state changes -> leads to re-render of this SelectInput component
      setEffectRun(true);
    }
  }, [filteredRestaurants, effectRun]);

  // after selecting options, turn options in other SelectInput to unchecked based on filtered restuarnat results
  // useEffect(() => {
  //   if (effectRun && filteredRestaurants.length > 0) {
  //     const optionsRemainedFromFilteredRes = filteredRestaurants.map(
  //       (restaurant) => restaurant[fieldName]
  //     );
  //     const updatedOptions = optionsCheckStatus.map((option) => {
  //       if (optionsRemainedFromFilteredRes.includes(option.label)) {
  //         return { ...option, isSelected: true };
  //       } else {
  //         return { ...option, isSelected: false };
  //       }
  //     });
  //     setOptionsCheckStatus(updatedOptions);
  //   } else if (effectRun && filteredRestaurants.length === 0) {
  //     // to cater the case when all options are unselected
  //     setOptionsCheckStatus(optionsCheckStatus.map((option) => ({ ...option, isSelected: false })));
  //   }
  // }, [filteredRestaurants]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // const handleCheckboxChange = (optionLabel) => {
  //   const updatedOptions = optionsCheckStatus.map((option) => {
  //     if (option.label === optionLabel) {
  //       return { ...option, isSelected: !option.isSelected };
  //     }
  //     return option;
  //   });
  //   setSelectedOptions(() => {
  //     let result = [];
  //     updatedOptions.forEach((option) => {
  //       if (option.isSelected) {
  //         result.push(option.label);
  //       }
  //     });
  //     return result;
  //   });
  // };

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
    <div className={styles.dropdownFilter}>
      <div className={styles.dropdownLabel} onClick={toggleOptions}>
        <span>{label}</span>
        <span className={styles.dropDownIndicator}>{showOptions ? '▲' : '▼'}</span>
      </div>
      {showOptions && (
        <div className={styles.dropDownOptions}>
          <label>
            <input
              type="checkbox"
              checked={optionsCheckStatus.every((option) => option.isSelected)}
              onChange={handleMasterCheckboxChange}
            ></input>
            Select All
          </label>
          <input type="text" placeholder="検索..." onChange={handleInputChange}></input>
          {filterResult.map((option) => (
            <div key={option.label}>
              <label>
                <input
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
