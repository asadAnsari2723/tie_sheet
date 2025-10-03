import React from 'react';
import { BlankCell, TopConnector, MidConnector, BottomConnector, NoConnector } from './BracketCells';

const BracketRow = () => (
  <tr>
    <BlankCell className="custom-blank" />
    <TopConnector className="custom-top" />
    <MidConnector className="custom-mid" />
    <BottomConnector className="custom-bottom" />
    <NoConnector className="custom-none" />
  </tr>
);
