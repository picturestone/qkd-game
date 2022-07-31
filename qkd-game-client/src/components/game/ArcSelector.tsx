import { useState } from 'react';
import { Arc, Layer, Group, Stage } from 'react-konva';
import { Html } from 'react-konva-utils';
import degToRad from '../../helper/DegToRad';

export interface IProps<ArcType> {
    arcs: {
        arcType: ArcType;
        content: JSX.Element;
        contentRotation: number;
    }[];
    onArcSelected: (selectedArc: ArcType | null) => void;
}

function ArcSelector<ArcType>(props: IProps<ArcType>) {
    // set state for currently highlighted section
    const [selectedArcIndex, setSelectedArcIndex] = useState<number | null>(
        null
    );

    function getArcs(): JSX.Element[] {
        const arcs: JSX.Element[] = [];
        const angle = 360 / props.arcs.length;
        const highlightingFactor = 1.1;
        const xPos = 100;
        const yPos = 100;
        const innerRadius = 40;
        const outerRadius = 80;
        const halfingRadius = innerRadius + (outerRadius - innerRadius) / 2;

        for (let i = 0; i < props.arcs.length; i++) {
            const rotation = i * angle;
            const arcContentRotation =
                -rotation + props.arcs[i].contentRotation;
            arcs.push(
                <Group
                    onClick={() => {
                        if (selectedArcIndex === i) {
                            setSelectedArcIndex(null);
                            props.onArcSelected(null);
                        } else {
                            setSelectedArcIndex(i);
                            props.onArcSelected(props.arcs[i].arcType);
                        }
                    }}
                    x={xPos}
                    y={yPos}
                    rotation={rotation}
                    scale={
                        selectedArcIndex === i
                            ? { x: highlightingFactor, y: highlightingFactor }
                            : { x: 1, y: 1 }
                    }
                    key={i}
                >
                    <Arc
                        angle={angle}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        fill="red"
                    ></Arc>
                    <Group
                        rotation={arcContentRotation}
                        x={Math.cos(degToRad(angle / 2)) * halfingRadius}
                        y={Math.sin(degToRad(angle / 2)) * halfingRadius}
                    >
                        <Html>
                            <div
                                style={{
                                    transform: 'translate(-50%, -50%)',
                                    pointerEvents: 'none',
                                }}
                            >
                                {props.arcs[i].content}
                            </div>
                        </Html>
                    </Group>
                </Group>
            );
        }

        return arcs;
    }

    return (
        <Stage width={200} height={200}>
            <Layer>{getArcs()}</Layer>
        </Stage>
    );
}

export default ArcSelector;
