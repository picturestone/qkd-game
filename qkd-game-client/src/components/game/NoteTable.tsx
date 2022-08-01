import { useState } from 'react';
import ArcSelector, { IArcData } from './ArcSelector';
import BASIS from '../../models/api/Basis';
import { FaArrowsAlt, FaArrowsAltV, FaQuestion } from 'react-icons/fa';
import POLARIZATION from '../../models/api/Polarization';
import Button from '../Button';

type availableArcs = 'basis' | 'bitVal';

interface IProps {
    noOfQubits: number;
}

interface INoteTableColumnData {
    basis?: IArcData<BASIS>;
    bitVal?: IArcData<0 | 1>;
    openedArcFor?: availableArcs;
}

// TODO for sender: Show basis and bit value
// TODO for receiver: show basis and bit value?
// TODO for sender: Show polarization table
// Difficulty: EVE > ALICE > BOB
// See worksheets Quantum Computing for the Quantum Curious
function NoteTable(props: IProps) {
    const cellHeightClass = 'h-8';
    const headerColClasses =
        cellHeightClass + ' text-base border-l border-b flex items-center';
    const dataColClasses =
        cellHeightClass + ' text-base border-l border-b flex items-center';

    const [noteTableData, setNoteTableData] = useState<INoteTableColumnData[]>(
        []
    );

    function addColData(newColData: INoteTableColumnData) {
        setNoteTableData((prevNoteTableData) => [
            ...prevNoteTableData,
            newColData,
        ]);
    }

    function replaceColData(newColData: INoteTableColumnData, atIndex: number) {
        setNoteTableData(
            noteTableData.map((curCol, i) =>
                i === atIndex ? newColData : curCol
            )
        );
    }

    function handleArcOpenButtonClicked(
        forIndex: number,
        forArc: availableArcs
    ) {
        if (noteTableData[forIndex].openedArcFor === forArc) {
            closeArcSelector(forIndex);
        } else {
            closeAllArcSelectors();
            replaceColData(
                {
                    ...noteTableData[forIndex],
                    openedArcFor: forArc,
                },
                forIndex
            );
        }
    }

    function closeArcSelector(forIndex: number) {
        replaceColData(
            {
                ...noteTableData[forIndex],
                openedArcFor: undefined,
            },
            forIndex
        );
    }

    function closeAllArcSelectors() {
        const newTableData = noteTableData.map((curCol) => {
            return {
                ...curCol,
                openedArcFor: undefined,
            };
        });

        setNoteTableData(newTableData);
    }

    function getArcContainerClasses(
        forIndex: number,
        forArc: availableArcs
    ): string {
        let arcClasses =
            'absolute overflow-visible top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10';
        if (noteTableData[forIndex].openedArcFor !== forArc) {
            arcClasses = `hidden ${arcClasses}`;
        }
        return arcClasses;
    }

    function getBasisArcButtonContent(forIndex: number) {
        return noteTableData[forIndex].basis ? (
            <div
                style={{
                    transform: `rotate(${noteTableData[forIndex].basis?.contentRotation}deg)`,
                }}
            >
                {noteTableData[forIndex].basis?.content}
            </div>
        ) : (
            <FaQuestion />
        );
    }

    function getBasisArc(relatedColIndex: number) {
        return (
            <ArcSelector<BASIS>
                onArcSelected={(selectedArc?: IArcData<BASIS>) => {
                    replaceColData(
                        {
                            ...noteTableData[relatedColIndex],
                            basis: selectedArc,
                            openedArcFor: undefined,
                        },
                        relatedColIndex
                    );
                }}
                arcs={[
                    {
                        arcType: BASIS.horizontalVertical,
                        content: <FaArrowsAlt />,
                        contentRotation: 0,
                    },
                    {
                        arcType: BASIS.diagonal,
                        content: <FaArrowsAlt />,
                        contentRotation: 45,
                    },
                ]}
                selectedArc={noteTableData[relatedColIndex].basis?.arcType}
            ></ArcSelector>
        );
    }

    function getBitValueArc(relatedColIndex: number) {
        return (
            <ArcSelector<0 | 1>
                onArcSelected={(selectedArc?: IArcData<0 | 1>) => {
                    replaceColData(
                        {
                            ...noteTableData[relatedColIndex],
                            bitVal: selectedArc,
                            openedArcFor: undefined,
                        },
                        relatedColIndex
                    );
                }}
                arcs={[
                    {
                        arcType: 0,
                        content: <span>0</span>,
                        contentRotation: 0,
                    },
                    {
                        arcType: 1,
                        content: <span>1</span>,
                        contentRotation: 0,
                    },
                ]}
                selectedArc={noteTableData[relatedColIndex].bitVal?.arcType}
            ></ArcSelector>
        );
    }

    function getBitValueArcButtonContent(forIndex: number) {
        return noteTableData[forIndex].bitVal ? (
            <div
                style={{
                    transform: `rotate(${noteTableData[forIndex].bitVal?.contentRotation}deg)`,
                }}
            >
                {noteTableData[forIndex].bitVal?.content}
            </div>
        ) : (
            <FaQuestion />
        );
    }

    function getDataCols(): JSX.Element[] {
        const dataCols: JSX.Element[] = [];

        for (let i = 0; i < props.noOfQubits; i++) {
            // Add table data if none is existing for defined length.
            if (i >= noteTableData.length) {
                addColData({
                    basis: undefined,
                    bitVal: undefined,
                    openedArcFor: undefined,
                });
            } else {
                dataCols.push(
                    <div className="flex flex-col" key={i}>
                        <div className={dataColClasses}>
                            <span className="w-full h-full flex items-center justify-center">
                                {i + 1}
                            </span>
                        </div>
                        <div className={dataColClasses + ' relative'}>
                            <Button
                                className="w-full h-full flex items-center justify-center"
                                onClick={() => {
                                    handleArcOpenButtonClicked(i, 'basis');
                                }}
                            >
                                {getBasisArcButtonContent(i)}
                            </Button>

                            <div className={getArcContainerClasses(i, 'basis')}>
                                {getBasisArc(i)}
                            </div>
                        </div>
                        <div className={dataColClasses + ' relative'}>
                            <Button
                                className="w-full h-full flex items-center justify-center"
                                onClick={() => {
                                    handleArcOpenButtonClicked(i, 'bitVal');
                                }}
                            >
                                {getBitValueArcButtonContent(i)}
                            </Button>

                            <div
                                className={getArcContainerClasses(i, 'bitVal')}
                            >
                                {getBitValueArc(i)}
                            </div>
                        </div>
                    </div>
                );
            }
        }

        return dataCols;
    }

    return (
        <div className="flex border-t border-r">
            <div className="flex flex-col">
                <div className={headerColClasses}>Qubit No.</div>
                <div className={headerColClasses}>Basis</div>
                <div className={headerColClasses}>Bit val.</div>
            </div>
            {getDataCols()}
        </div>
    );
}

export default NoteTable;
