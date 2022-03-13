import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import styles from "./PolarizationWheelFilter.module.scss"

interface IProps {
    deg: number;
}

function PolarizationWheelFilter(props: IProps) {
    return (
        <div
            draggable="false"
            className={ styles.filter }
        >
            <div style={{ transform: `rotate(${props.deg}deg)` }}>
                <FontAwesomeIcon icon={ faArrowsUpDown } />
            </div>
        </div>
    );
}

export default PolarizationWheelFilter;