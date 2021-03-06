import React, { useState } from 'react';
import { FaArrowsAlt } from 'react-icons/fa';
import BASIS from '../../models/api/Basis';
import POLARIZATION from '../../models/api/Polarization';
import BitBox from './BitBox';
import FilterWheel from './FilterWheel';
import OpticalFiber from './OpticalFiber';
import styles from './Receiver.module.scss';

interface IProps {
    receivedPhoton?: React.ReactNode;
    showPolarization?: POLARIZATION;
    onReceivedPhotonTransported: () => void;
    onPhotonPassing: (basis: BASIS) => void;
    onMeasuredPhotonTransported: () => void;
}

function Receiver(props: IProps) {
    const [passingPhoton, setPassingPhoton] = useState<React.ReactNode>(null);
    const [measuredPhoton, setMeasuredPhoton] = useState<React.ReactNode>(null);

    function handleReceivedPhotonTransported(photon: React.ReactNode) {
        setPassingPhoton(photon);
        props.onReceivedPhotonTransported();
    }

    function handlePhotonPassing(basis: BASIS) {
        if (React.isValidElement(passingPhoton)) {
            setMeasuredPhoton(passingPhoton);
            setPassingPhoton(null);
            props.onPhotonPassing(basis);
        }
    }

    function handleMeasuredPhotonTransported() {
        setMeasuredPhoton(null);
        props.onMeasuredPhotonTransported();
    }

    return (
        <div className={styles.receiver}>
            <div className={styles.receiverReceivedPhotonOpticalFiberWrapper}>
                <OpticalFiber
                    pathD="M 0 0 v 200"
                    photon={props.receivedPhoton}
                    onAnimationEnd={handleReceivedPhotonTransported}
                ></OpticalFiber>
            </div>
            <div className={styles.receiverFilterWheelWrapper}>
                <FilterWheel<BASIS>
                    degOffset={90}
                    passingPhoton={passingPhoton}
                    onPhotonPassing={handlePhotonPassing}
                    degWherePhotonPasses={0}
                    filters={[
                        {
                            filterType: BASIS.horizontalVertical,
                            icon: <FaArrowsAlt />,
                            iconRotation: 0,
                        },
                        {
                            filterType: BASIS.diagonal,
                            icon: <FaArrowsAlt />,
                            iconRotation: 45,
                        },
                    ]}
                />
            </div>
            <div className={styles.receiverMeasuredPhotonOpticalFiberWrapper}>
                <OpticalFiber
                    pathD="M 0 0 v 200"
                    photon={measuredPhoton}
                    onAnimationEnd={handleMeasuredPhotonTransported}
                ></OpticalFiber>
            </div>
            <div className={styles.receiverBitBoxWrapper}>
                <BitBox showPolarization={props.showPolarization}></BitBox>
            </div>
        </div>
    );
}

export default Receiver;
