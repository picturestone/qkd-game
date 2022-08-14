import styles from './PaperStack.module.scss';

interface IProps {
    className?: string;
}

function PaperStack(props: React.PropsWithChildren<IProps>) {
    return (
        <div
            className={
                props.className
                    ? styles.paperstack + ' ' + props.className
                    : styles.paperstack
            }
        >
            {props.children}
        </div>
    );
}

export default PaperStack;
