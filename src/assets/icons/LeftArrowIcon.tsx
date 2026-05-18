import * as React from "react"
import Svg, { Path } from "react-native-svg"

function LeftArrowIcon() {
    return (
        <Svg
            width={7}
            height={12}
            viewBox="0 0 7 12"
            fill="none"
        >
            <Path
                d="M6 11L1 6l5-5"
                stroke="#1B1631"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default LeftArrowIcon
