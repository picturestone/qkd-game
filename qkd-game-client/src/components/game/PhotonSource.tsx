import React from 'react';
import Randomizer from '../../helper/Randomizer';
import POLARIZATION from '../../models/api/Polarization';
import Qbit from '../../models/quantum/Qbit';
import Photon from './Photon';
import styles from './PhotonSource.module.scss';
import RoundButton from './RoundButton';

interface IProps {
    onPhotonEmission: (photon: React.ReactNode) => void;
}

function PhotonSource(props: IProps) {
    return (
        <div className={styles.photonSource}>
            <div className={styles.topPlate}></div>
            <div className={styles.frontPlate}>
                <p>Send QBit</p>
                <RoundButton
                    onClick={() => {
                        props.onPhotonEmission(
                            <Photon
                                qbit={
                                    new Qbit(
                                        Randomizer.getRandomEnum(POLARIZATION)
                                    )
                                }
                            />
                        );
                    }}
                />
            </div>
        </div>
    );
}

export default PhotonSource;
