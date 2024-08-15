import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faHeart as faHeartSolid,
  faStarHalfStroke,
  faStar,
  faComments,
  faCaretUp,
  faCaretDown,
  faWineGlassEmpty,
  faArrowRightToBracket,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faStar as faStarRegular,
  faUser,
  faMessage,
} from '@fortawesome/free-regular-svg-icons';

library.add(
  fab,
  faHeartSolid,
  faHeartRegular,
  faStarHalfStroke,
  faStar,
  faStarRegular,
  faComments,
  faCaretUp,
  faCaretDown,
  faWineGlassEmpty,
  faArrowRightToBracket,
  faUserPlus,
  faUser,
  faMessage
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
