import React, { createContext, useContext, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import './LoadingBarContext.css';

export const LoadingBarContext = createContext();

export const LoadingBarProvider = ({ children }) => {
  const loadingBarRef = useRef(null);

  return (
    <LoadingBarContext.Provider value={loadingBarRef}>
      <LoadingBar className="custom-loading-bar" color="#065dc0" ref={loadingBarRef} />
      {children}
    </LoadingBarContext.Provider>
  );
};

export const useLoadingBar = () => useContext(LoadingBarContext);
