import styles from './BitBox.module.scss';
import POLARIZATION from '../../models/api/Polarization';
import Led from './Led';

interface IProps {
    showPolarization?: POLARIZATION;
}

function BitBox(props: IProps) {
    return (
        <div className={styles.bitBox}>
            <div className={styles.topPlate}></div>
            <div className={styles.frontPlate}>
                <Led
                    isOn={
                        props.showPolarization === POLARIZATION.Zero ||
                        props.showPolarization === POLARIZATION.PlusFourtyFive
                    }
                    label="0"
                ></Led>
                <Led
                    isOn={
                        props.showPolarization === POLARIZATION.Ninety ||
                        props.showPolarization === POLARIZATION.MinusFourtyFive
                    }
                    label="1"
                ></Led>
            </div>
        </div>
    );
}

export default BitBox;
