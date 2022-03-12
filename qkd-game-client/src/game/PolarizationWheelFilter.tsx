import React from "react";
import styles from "./PolarizationWheelFilter.module.scss"

class PolarizationWheelFilter extends React.Component {
    render() {
        return (
            <div
                draggable="false"
                className={ styles.filter } 
            >
            </div>
        );
    }
}

export default PolarizationWheelFilter;