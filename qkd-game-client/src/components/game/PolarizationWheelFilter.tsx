import { faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';
import Polarization from '../../models/api/Polarization';
import styles from './PolarizationWheelFilter.module.scss';

interface IProps {
    polarization: Polarization;
}

function PolarizationWheelFilter(props: IProps) {
    return (
        <div draggable="false" className={styles.filter}>
            <div
                style={{
                    transform: `rotate(${props.polarization.valueOf()}deg)`,
                }}
            >
                <FontAwesomeIcon icon={faArrowsUpDown} />
            </div>
        </div>
    );
}

export default PolarizationWheelFilter;
