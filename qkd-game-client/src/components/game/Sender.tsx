import React, { useState } from 'react';
import Qbit from '../../models/quantum/Qbit';
import OpticalFiber from './OpticalFiber';
import PhotonSource from './PhotonSource';
import FilterWheel from './FilterWheel';
import styles from './Sender.module.scss';
import { FaArrowsAltV } from 'react-icons/fa';
import { IProps as IPhotonProps } from './Photon';
import POLARIZATION from '../../models/api/Polarization';

interface IProps {
    onPolarizedPhotonTransported: (qbit: Qbit) => void;
}

function Sender(props: IProps) {
    const [emittedPhoton, setEmittedPhoton] = useState<React.ReactNode>(null);
    const [passingPhoton, setPassingPhoton] = useState<React.ReactNode>(null);
    const [polarizedPhoton, setPolarizedPhoton] =
        useState<React.ReactNode>(null);
    const [isSendingDisabled, setIsSendingDisabled] = useState(false);

    function handlePhotonEmission(photon: React.ReactNode) {
        setIsSendingDisabled(true);
        setEmittedPhoton(photon);
    }

    function handleEmittedPhotonTransported(photon: React.ReactNode) {
        setEmittedPhoton(null);
        setPassingPhoton(photon);
    }

    function handlePhotonPassing(polarization: POLARIZATION) {
        if (React.isValidElement(passingPhoton)) {
            const polarizedPhoton = React.cloneElement(passingPhoton, {
                qbit: new Qbit(polarization),
            });
            setPassingPhoton(null);
            setPolarizedPhoton(polarizedPhoton);
        }
    }

    function handlePolarizedPhotonTransported(photon: React.ReactNode) {
        setPolarizedPhoton(null);
        const photonProps = (photon as any).props as IPhotonProps;
        props.onPolarizedPhotonTransported(photonProps.qbit);
        setIsSendingDisabled(false);
    }

    return (
        <div className={styles.sender}>
            <div className={styles.senderPolarizedPhotonOpticalFiberWrapper}>
                <OpticalFiber
                    pathD="M 0 200 v -200"
                    photon={polarizedPhoton}
                    onAnimationEnd={handlePolarizedPhotonTransported}
                ></OpticalFiber>
            </div>
            <div className={styles.senderFilterWheelWrapper}>
                <FilterWheel<POLARIZATION>
                    passingPhoton={passingPhoton}
                    onPhotonPassing={handlePhotonPassing}
                    degWherePhotonPasses={270}
                    filters={[
                        {
                            filterType: POLARIZATION.Zero,
                            icon: <FaArrowsAltV />,
                            iconRotation: POLARIZATION.Zero.valueOf(),
                        },
                        {
                            filterType: POLARIZATION.PlusFourtyFive,
                            icon: <FaArrowsAltV />,
                            iconRotation: POLARIZATION.PlusFourtyFive.valueOf(),
                        },
                        {
                            filterType: POLARIZATION.Ninety,
                            icon: <FaArrowsAltV />,
                            iconRotation: POLARIZATION.Ninety.valueOf(),
                        },
                        {
                            filterType: POLARIZATION.MinusFourtyFive,
                            icon: <FaArrowsAltV />,
                            iconRotation:
                                POLARIZATION.MinusFourtyFive.valueOf(),
                        },
                    ]}
                />
            </div>
            <div className={styles.senderEmittedPhotonOpticalFiberWrapper}>
                <OpticalFiber
                    pathD="M 0 200 v -200"
                    photon={emittedPhoton}
                    onAnimationEnd={handleEmittedPhotonTransported}
                ></OpticalFiber>
            </div>
            <div className={styles.senderPhotonSourceWrapper}>
                <PhotonSource
                    disabled={isSendingDisabled}
                    onPhotonEmission={handlePhotonEmission}
                />
            </div>
        </div>
    );
}

export default Sender;
