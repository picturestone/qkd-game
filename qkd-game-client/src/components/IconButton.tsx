interface IProps {
    disabled?: boolean;
    type?: 'button' | 'submit';
    className?: string;
    onClick?: () => void;
}

function IconButton(props: React.PropsWithChildren<IProps>) {
    return (
        <button
            type={props.type}
            className={`flex justify-center items-center border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-0 rounded-md disabled:bg-gray-50 disabled:text-gray-500 ${
                props.className ? props.className : ''
            }`}
            disabled={props.disabled}
            onClick={() => {
                if (props.onClick) {
                    props.onClick();
                }
            }}
        >
            {props.children}
        </button>
    );
}

export default IconButton;
