import { FaMinus, FaPlus } from 'react-icons/fa';
import Button from './Button';

interface IProps {
    disabled?: boolean;
    className?: string;
    onChange?: (newVal: number) => void;
    value: number;
    max?: number;
    min?: number;
}

function NumberInput(props: IProps) {
    function isMinusButtonDisabled(): boolean {
        let isDisadbled = false;
        if (props.min) {
            isDisadbled = props.disabled || props.value <= props.min;
        } else if (props.disabled) {
            isDisadbled = props.disabled;
        }
        return isDisadbled;
    }

    function isPlusButtonDisabled(): boolean {
        let isDisadbled = false;
        if (props.max) {
            isDisadbled = props.disabled || props.value >= props.max;
        } else if (props.disabled) {
            isDisadbled = props.disabled;
        }
        return isDisadbled;
    }

    return (
        <div
            className={`flex items-end ${
                props.className ? props.className : ''
            }`}
        >
            <Button
                className="h-8"
                type="button"
                disabled={isMinusButtonDisabled()}
                onClick={() => {
                    if (props.onChange && !isMinusButtonDisabled()) {
                        const newVal = props.value - 1;
                        props.onChange(newVal);
                    }
                }}
            >
                <FaMinus></FaMinus>
            </Button>
            <input
                disabled={props.disabled}
                type="number"
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={(event) => {
                    if (props.onChange) {
                        const newVal = parseInt(event.target.value);
                        props.onChange(newVal);
                    }
                }}
                className={`flex-auto text-center border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-gray-700 disabled:border-gray-400 disabled:text-gray-500 remove-spinner`}
            ></input>
            <Button
                className="h-8"
                type="button"
                disabled={isPlusButtonDisabled()}
                onClick={() => {
                    if (props.onChange && !isPlusButtonDisabled()) {
                        const newVal = props.value + 1;
                        props.onChange(newVal);
                    }
                }}
            >
                <FaPlus></FaPlus>
            </Button>
        </div>
    );
}

export default NumberInput;
