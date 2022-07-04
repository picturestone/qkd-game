import React, { useState } from 'react';
import Qbit from '../../models/quantum/Qbit';
import OpticalFiber from './OpticalFiber';
import PhotonSource from './PhotonSource';
import PolarizationWheel from './PolarizationWheel';
import styles from './Sender.module.scss';
import { IProps as IPhotonProps } from './Photon';

interface IProps {
    onPolarizedPhotonTransported: (qbit: Qbit) => void;
}

function Sender(props: IProps) {
    const [emittedPhoton, setEmittedPhoton] = useState<React.ReactNode>(null);
    const [passingPhoton, setPassingPhoton] = useState<React.ReactNode>(null);
    const [polarizedPhoton, setPolarizedPhoton] =
        useState<React.ReactNode>(null);

    function handlePhotonEmission(photon: React.ReactNode) {
        setEmittedPhoton(photon);
    }

    function handleEmittedPhotonTransported(photon: React.ReactNode) {
        setEmittedPhoton(null);
        setPassingPhoton(photon);
    }

    function handlePhotonPassed(photon: React.ReactNode) {
        setPassingPhoton(null);
        setPolarizedPhoton(photon);
    }

    function handlePolarizedPhotonTransported(photon: React.ReactNode) {
        setPolarizedPhoton(null);
        const photonProps = (photon as any).props as IPhotonProps;
        props.onPolarizedPhotonTransported(photonProps.qbit);
    }

    return (
        <div className={styles.sender}>
            <div className={styles.polarizedPhotonOpticalFiberWrapper}>
                <OpticalFiber
                    pathD="M 0 200 v -200"
                    photon={polarizedPhoton}
                    onAnimationEnd={handlePolarizedPhotonTransported}
                ></OpticalFiber>
            </div>
            <div className={styles.polarizationWheelWrapper}>
                <PolarizationWheel
                    passingPhoton={passingPhoton}
                    onPhotonPassed={handlePhotonPassed}
                />
            </div>
            <div className={styles.emittedPhotonOpticalFiberWrapper}>
                <OpticalFiber
                    pathD="M 0 200 v -200"
                    photon={emittedPhoton}
                    onAnimationEnd={handleEmittedPhotonTransported}
                ></OpticalFiber>
            </div>
            <div className={styles.photonSourceWrapper}>
                <PhotonSource onPhotonEmission={handlePhotonEmission} />
            </div>
        </div>
    );
}

export default Sender;
