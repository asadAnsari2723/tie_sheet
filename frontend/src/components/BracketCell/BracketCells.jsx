import React from 'react';
import './BracketCells.css'; // Assumes you have this CSS file for styles
import top from '../../assets/top.gif';
// import top from '../../assets/top.svg';

import mid from '../../assets/mid.gif';
// import mid from '../../assets/mid.svg';

import low from '../../assets/low.gif';
import non from '../../assets/non.gif';

// Blank cell component (formerly Entries[0])
export const BlankCell = ({ className = '' }) => (
  <td className={`bracket-cell blank-cell ${className}`}></td>
);

// Top connector cell (Entries[1])
export const TopConnector = ({ className = '' }) => (
  <td className={`bracket-cell top-connector ${className}`}>
    <img src={top} alt="top connector" />
  </td>
);

// Middle connector cell (Entries[2])
export const MidConnector = ({ className = '' }) => (
  <td className={`bracket-cell mid-connector ${className}`}>
    <img src={mid} alt="middle connector" />
  </td>
);

// Bottom connector cell (Entries[3])
export const BottomConnector = ({ className = '' }) => (
  <td className={`bracket-cell bottom-connector ${className}`}>
    <img src={low} alt="bottom connector" />
  </td>
);

// No connector / spacer cell (Entries[4])
export const NoConnector = ({ className = '' }) => (
  <td className={`bracket-cell no-connector ${className}`}>
    <img src={non} alt="no connector" />
  </td>
);
