import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type Props = {
  checked: boolean;
  size?: number;
};

function CheckCircleIcon({ checked, size = 20 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle
        cx="10"
        cy="10"
        r="9"
        fill={checked ? '#00C950' : 'transparent'}
        stroke={checked ? '#00C950' : '#C9CACC'}
        strokeWidth="1.5"
      />
      <Path
        d="M6 10.5l2.5 2.5 5.5-5.5"
        stroke={checked ? '#FFFFFF' : '#C9CACC'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CheckCircleIcon;
