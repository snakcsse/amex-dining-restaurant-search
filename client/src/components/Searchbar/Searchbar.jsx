import React, { useContext } from 'react';
import styles from './Searchbar.module.css';
import SelectInput from '../SelectInput/SelectInput';
import SliderInput from '../SliderInput/SliderInput';
import { SearchContext } from '../../context/SearchContext';

const Searchbar = () => {
  const {
    selectedArea,
    setSelectedArea,
    selectedCuisineType,
    setSelectedCuisineType,
    selectedRestaurantName,
    setSelectedRestaurantName,
    ratingRange,
    setRatingRange,
    ratingCountRange,
    setRatingCountRange,
    filteredRestaurants,
  } = useContext(SearchContext);

  // const area = [
  //   'エリア：札幌',
  //   'エリア：銀座・東京・日本橋周辺',
  //   'エリア：六本木・麻布・広尾周辺',
  //   'エリア：赤坂',
  //   'エリア：桜坂',
  // ];
  // const cuisineTypes = ['イタリアン', '中国料理', 'フレンチ', '日本料理'];
  // const restaurantNames = [
  //   'RISTORANTE CANOFILO（カノフィーロ）',
  //   '重慶飯店 麻布賓館（ジュウケイハンテン アザブヒンカン）',
  //   'ラ・ロシェル福岡',
  //   'アンティカ・オステリア・デル・ポンテ',
  //   '桜坂 観山荘（さくらざか かんざんそう）',
  // ];

  return (
    <div className={styles.container}>
      <SelectInput
        label="Area"
        fieldName="area"
        filteredRestaurants={filteredRestaurants}
        selectedOptions={selectedArea}
        setSelectedOptions={setSelectedArea}
      />
      <SelectInput
        label="Cuisine"
        fieldName="cuisineType"
        filteredRestaurants={filteredRestaurants}
        selectedOptions={selectedCuisineType}
        setSelectedOptions={setSelectedCuisineType}
      />
      <SelectInput
        label="Restaurant Name"
        fieldName="name"
        filteredRestaurants={filteredRestaurants}
        selectedOptions={selectedRestaurantName}
        setSelectedOptions={setSelectedRestaurantName}
      />
      <SliderInput
        label="Rating"
        min="0"
        max="5"
        selectedRange={ratingRange}
        setSelectedRange={setRatingRange}
      />
      <SliderInput
        label="Rating Count"
        min="0"
        max="3000"
        selectedRange={ratingCountRange}
        setSelectedRange={setRatingCountRange}
      />
    </div>
  );
};

export default Searchbar;
