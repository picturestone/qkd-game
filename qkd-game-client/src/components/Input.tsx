interface IProps {
    disabled?: boolean;
    type?: 'text' | 'password' | 'number';
    className?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    value?: string;
}

function Input(props: IProps) {
    return (
        <input
            disabled={props.disabled}
            type={props.type}
            value={props.value}
            onChange={(event) => {
                if (props.onChange) {
                    props.onChange(event);
                }
            }}
            className={`border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-gray-700 disabled:border-gray-400 disabled:text-gray-500 ${props.className}`}
        ></input>
    );
}

export default Input;
