import { useState } from "react";
import { animated, easings, useSpring } from "react-spring";
import Qbit from "../../models/quantum/Qbit";
import styles from "./Photon.module.scss";

interface IProps {
    cx?: number;
    cy?: number;
    qbit: Qbit;
}

function Photon(props: IProps) {
    const [isLightPulseFlipped, setIsLightPulseFlipped] = useState(false);
    const { radius } = useSpring({
        from: { radius: 10 },
        to: { radius: 11 },
        reset: true,
        onRest: () => setIsLightPulseFlipped(!isLightPulseFlipped),
        reverse: isLightPulseFlipped,
        config: {
            duration: 1000,
            easing: easings.easeInOutSine
        }
    });

    return (
        <animated.circle
            className={styles.photon}
            r={radius}
            cx={props.cx}
            cy={props.cy}
        >
        </animated.circle>
    )
}

export default Photon;