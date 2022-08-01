import { FaArrowsAlt, FaArrowsAltV } from 'react-icons/fa';
import POLARIZATION from '../../models/api/Polarization';

function PolarizationTable() {
    const colClasses = 'h-8 w-8 text-base flex justify-center items-center';

    return (
        <div className="flex flex-row border-2">
            <div className="flex flex-col">
                <div className={colClasses + ' border-b'}></div>
                <div className={colClasses + ' border-b'}>
                    <div>
                        <FaArrowsAlt />
                    </div>
                </div>
                <div className={colClasses}>
                    <div
                        style={{
                            transform: 'rotate(45deg)',
                        }}
                    >
                        <FaArrowsAlt />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className={colClasses + ' border-b border-l'}>
                    <span>0</span>
                </div>
                <div className={colClasses + ' border-b border-l'}>
                    <div
                        style={{
                            transform: `rotate(${POLARIZATION.Zero.valueOf()}deg)`,
                        }}
                    >
                        <FaArrowsAltV />
                    </div>
                </div>
                <div className={colClasses + ' border-l'}>
                    <div
                        style={{
                            transform: `rotate(${POLARIZATION.PlusFourtyFive.valueOf()}deg)`,
                        }}
                    >
                        <FaArrowsAltV />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className={colClasses + ' border-b border-l'}>
                    <span>1</span>
                </div>
                <div className={colClasses + ' border-b border-l'}>
                    <div
                        style={{
                            transform: `rotate(${POLARIZATION.Ninety.valueOf()}deg)`,
                        }}
                    >
                        <FaArrowsAltV />
                    </div>
                </div>
                <div className={colClasses + ' border-l'}>
                    <div
                        style={{
                            transform: `rotate(${POLARIZATION.MinusFourtyFive.valueOf()}deg)`,
                        }}
                    >
                        <FaArrowsAltV />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PolarizationTable;
