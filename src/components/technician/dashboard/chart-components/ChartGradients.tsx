
import React from 'react';

export const ChartGradients: React.FC = () => {
  return (
    <defs>
      <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
      </linearGradient>
      <linearGradient id="colorCumulative" x1="0" y1="0" x2="1" y2="0">
        <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#ff9800" stopOpacity={1}/>
      </linearGradient>
    </defs>
  );
};
