import { useState } from 'react';
import Button from '../Button';
import NumberInput from '../NumberInput';

interface IProps {
    text: string;
    noOfQbits: number;
    buttonOneContent: JSX.Element;
    onButtonOneClicked: (curQbitNo: number) => void;
    buttonTwoContent: JSX.Element;
    onButtonTwoClicked: (curQbitNo: number) => void;
}

// TODO extend with setting for `i`, a number field which raises with button click per default, and it can be set manually as well.
function BasisCommunicator(props: IProps) {
    const [curQbitNo, setCurQbitNo] = useState(1);

    return (
        <div className="flex flex-col">
            <div className="text-base">{props.text}</div>
            <NumberInput
                min={1}
                max={props.noOfQbits}
                value={curQbitNo}
                onChange={(newVal) => {
                    setCurQbitNo(newVal);
                }}
            ></NumberInput>
            <div className="flex justify-between mt-4 flex-nowrap">
                <Button
                    className="h-8"
                    onClick={() => {
                        props.onButtonOneClicked(curQbitNo);
                    }}
                >
                    {props.buttonOneContent}
                </Button>
                <Button
                    className="h-8"
                    onClick={() => {
                        props.onButtonTwoClicked(curQbitNo);
                    }}
                >
                    {props.buttonTwoContent}
                </Button>
            </div>
        </div>
    );
}

export default BasisCommunicator;
