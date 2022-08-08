import { FaArrowsAlt, FaArrowsAltV } from 'react-icons/fa';
import POLARIZATION from '../../models/api/Polarization';
import Button from '../Button';

interface IProps {
    text: string;
    buttonOneContent: JSX.Element;
    onButtonOneClicked: () => void;
    buttonTwoContent: JSX.Element;
    onButtonTwoClicked: () => void;
}

// TODO extend with setting for `i`, a number field which raises with button click per default, and it can be set manually as well.
function BasisCommunicator(props: IProps) {
    return (
        <div className="flex flex-col">
            <div className="text-base">{props.text}</div>
            <div className="flex justify-between mt-4 flex-nowrap">
                <Button onClick={props.onButtonOneClicked}>
                    {props.buttonOneContent}
                </Button>
                <Button onClick={props.onButtonTwoClicked}>
                    {props.buttonTwoContent}
                </Button>
            </div>
        </div>
    );
}

export default BasisCommunicator;
