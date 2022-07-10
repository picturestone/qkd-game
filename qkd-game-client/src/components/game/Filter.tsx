import styles from './Filter.module.scss';

interface IProps {
    icon: JSX.Element;
    iconRotation: number;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function Filter(props: IProps) {
    return (
        <div
            draggable="false"
            className={styles.filter}
            onClick={props.onClick}
        >
            <div
                style={{
                    transform: `rotate(${props.iconRotation}deg)`,
                }}
            >
                {props.icon}
            </div>
        </div>
    );
}

export default Filter;
