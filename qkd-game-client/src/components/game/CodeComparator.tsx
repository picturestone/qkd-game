import { useState } from 'react';
import Button from '../Button';
import Input from '../Input';

interface IProps {
    disabled?: boolean;
    onChange?: (newVal: string) => void;
    value?: string;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function CodeComparator(props: IProps) {
    const [isHighlighting, setIsHighlighting] = useState(true);

    return (
        <form
            onSubmit={props.handleSubmit}
            className="flex justify-between items-center"
        >
            <div className="text-base mr-5">
                After all qbits have been sent and compared, enter your
                non-discarded bit values here.
            </div>
            <div className="flex justify-between items-center relative">
                {/* Maybe move higlighting to only frame the input instead of input and button. might also fix overflowing on GameAlice and GameBob */}
                {isHighlighting && !props.disabled ? (
                    <div className="absolute w-full h-full border pointer-events-none border-red-600 animate-ping"></div>
                ) : (
                    ''
                )}
                <Input
                    type="text"
                    disabled={props.disabled}
                    className="mr-2 font-mono"
                    value={props.value}
                    onFocus={() => {
                        setIsHighlighting(false);
                    }}
                    onChange={(event) => {
                        let val = event.target.value;
                        val = val.replace(/[^0-1]/g, '').trim();
                        if (props.onChange) {
                            props.onChange(val);
                        }
                    }}
                ></Input>
                <Button
                    disabled={props.disabled || props.value?.length === 0}
                    type="submit"
                    className="whitespace-nowrap"
                >
                    Finish and send
                </Button>
            </div>
        </form>
    );
}

export default CodeComparator;
