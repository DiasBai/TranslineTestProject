import * as React from 'react';
import Svg, { Path } from 'react-native-svg';


function BottomArrowIcon() {
  return (
      <Svg
          width={10}
          height={5}
          viewBox="0 0 10 5"
          fill="none"

      >
          <Path
              d="M.5.5l4.167 3.817L8.833.5"
              stroke="#252526"
              strokeLinecap="round"
              strokeLinejoin="round"
          />
      </Svg>
  );
}

export default BottomArrowIcon;
