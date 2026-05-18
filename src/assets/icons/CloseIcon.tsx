import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CloseIcon() {
    return (
        <Svg
            width={10}
            height={10}
            viewBox="0 0 10 10"
            fill="none"

        >
            <Path
                d="M9 1L1 9m8 0L1 1"
                stroke="#1B1631"
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    )
}

export default CloseIcon
