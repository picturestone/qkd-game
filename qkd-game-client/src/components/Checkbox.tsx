interface IProps {
    className?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    defaultChecked?: boolean;
}

function Checkbox(props: React.PropsWithChildren<IProps>) {
    return (
        <label
            className={`flex items-start w-4 h-4 ${
                props.className ? props.className : ''
            }`}
        >
            <input
                type="checkbox"
                value=""
                className="w-4 h-4 text-gray-700 bg-white rounded border-gray-700 focus:ring-0"
                onChange={(event) => {
                    if (props.onChange) {
                        props.onChange(event);
                    }
                }}
                defaultChecked={props.defaultChecked}
            ></input>
            <span className="ml-2 text-sm">{props.children}</span>
        </label>
    );
}

export default Checkbox;
