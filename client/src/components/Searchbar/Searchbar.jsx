import React from 'react';
import styles from './Searchbar.module.css';

const Searchbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input type="text" id="location" name="location" placeholder="エリア・駅"></input>
        <input
          type="text"
          id="keyword"
          name="keyword"
          placeholder="キーワード [例: 焼肉、イタリアン]"
        ></input>
        <div className={styles.searchItem}>
          <label htmlFor="price">
            価格
            <select id="price" name="price">
              <option value="low-price">￥1000-5000</option>
              <option value="mid-price">￥5000~10000</option>
              <option value="high-price">￥10000~</option>
            </select>
          </label>
        </div>
        <div className={styles.searchItem}>
          <label htmlFor="review">
            レビュー
            <select id="review" name="review">
              <option value="low-rating">&lt;3</option>
              <option value="mid-rating">3~4</option>
              <option value="high-rating">&gt;4</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
