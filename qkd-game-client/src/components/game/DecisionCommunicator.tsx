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

function BasisCommunicator(props: IProps) {
    const [curQbitNo, setCurQbitNo] = useState(1);

    return (
        <div className="flex flex-wrap">
            <div className="text-base flex-auto w-full">{props.text}</div>
            <NumberInput
                className="flex-none w-full"
                min={1}
                max={props.noOfQbits}
                value={curQbitNo}
                onChange={(newVal) => {
                    setCurQbitNo(newVal);
                }}
            ></NumberInput>
            <div className="flex justify-between mt-4 flex-nowrap w-full flex-none">
                <Button
                    className="h-8"
                    onClick={() => {
                        props.onButtonOneClicked(curQbitNo);
                        if (curQbitNo < props.noOfQbits) {
                            setCurQbitNo(curQbitNo + 1);
                        }
                    }}
                >
                    {props.buttonOneContent}
                </Button>
                <Button
                    className="h-8 ml-2"
                    onClick={() => {
                        props.onButtonTwoClicked(curQbitNo);
                        if (curQbitNo < props.noOfQbits) {
                            setCurQbitNo(curQbitNo + 1);
                        }
                    }}
                >
                    {props.buttonTwoContent}
                </Button>
            </div>
        </div>
    );
}

export default BasisCommunicator;
