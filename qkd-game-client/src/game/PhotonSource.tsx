import styles from "./PhotonSource.module.scss"
import RoundButton from "./RoundButton";

function PhotonSource() {
    return (
        <div className={ styles.photonSource }>
            <div className={ styles.topPlate }>
            </div>
            <div className={ styles.frontPlate }>
                <p>Send QBit</p>
                <RoundButton />
            </div>
        </div>
    );
}

export default PhotonSource;