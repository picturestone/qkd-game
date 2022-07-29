import styles from './Led.module.scss';

interface IProps {
    isOn: boolean;
    label: string;
}

function Led(props: IProps) {
    return (
        <div className={styles.ledContainer}>
            <div
                className={
                    props.isOn
                        ? `${styles.ledLight} ${styles.ledLightOn}`
                        : styles.ledLight
                }
            ></div>
            <p className={styles.label}>{props.label}</p>
        </div>
    );
}

export default Led;
