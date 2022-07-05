import React, { useState } from 'react';
import Qbit from '../../models/quantum/Qbit';
import OpticalFiber from './OpticalFiber';
import styles from './Sender.module.scss';
import { IProps as IPhotonProps } from './Photon';

interface IProps {
    receivedPhoton?: React.ReactNode;
    onReceivedPhotonTransported: () => void;
}

function Receiver(props: IProps) {
    return (
        <div className={styles.sender}>
            <div className={styles.polarizedPhotonOpticalFiberWrapper}>
                <OpticalFiber
                    pathD="M 0 0 v 200"
                    photon={props.receivedPhoton}
                    onAnimationEnd={props.onReceivedPhotonTransported}
                ></OpticalFiber>
            </div>
        </div>
    );
}

export default Receiver;
