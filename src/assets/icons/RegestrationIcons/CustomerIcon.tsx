import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type Props = { color?: string };

function CustomerIcon({ color = '#05C0E6' }: Props) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Rect
        x={2}
        y={9}
        width={24}
        height={16}
        rx={3}
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M9 9V7a5 5 0 0110 0v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M2 16h24" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default CustomerIcon;
