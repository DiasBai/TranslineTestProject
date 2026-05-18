import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CloseEyeIcon() {
    return (
        <Svg
            width={22}
            height={17}
            viewBox="0 0 22 17"
            fill="none"
        >
            <Path
                d="M19.052 16l-15-15m4.8 5.942c-.373.411-.6.952-.6 1.544 0 1.29 1.075 2.336 2.4 2.336.612 0 1.17-.223 1.593-.589m6.846.589c.826-1.237 1.162-2.246 1.162-2.246S18.068 1.6 10.653 1.6c-.417 0-.817.022-1.2.063m6.6 12.186c-1.378.88-3.151 1.5-5.4 1.464-7.324-.12-9.6-6.737-9.6-6.737s1.057-3.378 4.2-5.433"
                stroke="#1B1631"
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    )
}

export default CloseEyeIcon
