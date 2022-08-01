import { Arc, Layer, Group, Stage } from 'react-konva';
import { Html } from 'react-konva-utils';
import degToRad from '../../helper/DegToRad';

export interface IArcData<ArcType> {
    arcType: ArcType;
    content: JSX.Element;
    contentRotation: number;
}

interface IProps<ArcType> {
    arcs: IArcData<ArcType>[];
    onArcSelected: (selectedArc?: IArcData<ArcType>) => void;
    onStageClicked?: () => void;
    selectedArc?: ArcType;
    rotationDeg?: number;
}

function ArcSelector<ArcType>(props: IProps<ArcType>) {
    function handleArcClicked(clickedArc: IArcData<ArcType>) {
        const isSelectedArc = props.selectedArc === clickedArc.arcType;
        if (isSelectedArc) {
            props.onArcSelected(undefined);
        } else {
            props.onArcSelected(clickedArc);
        }
    }

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
            const rotation = props.rotationDeg
                ? i * angle + props.rotationDeg
                : i * angle;
            const arcContentRotation =
                -rotation + props.arcs[i].contentRotation;
            const isSelectedArc = props.selectedArc === props.arcs[i].arcType;
            arcs.push(
                <Group
                    onClick={(e) => {
                        handleArcClicked(props.arcs[i]);
                        e.cancelBubble = true;
                    }}
                    x={xPos}
                    y={yPos}
                    rotation={rotation}
                    scale={
                        isSelectedArc
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
                        onMouseEnter={(e) => {
                            const stage = e.target.getStage();
                            if (stage) {
                                const container = stage.container();
                                container.style.cursor = 'pointer';
                            }
                        }}
                        onMouseLeave={(e) => {
                            const stage = e.target.getStage();
                            if (stage) {
                                const container = stage.container();
                                container.style.cursor = 'default';
                            }
                        }}
                    ></Arc>
                    <Group
                        rotation={arcContentRotation}
                        x={Math.cos(degToRad(angle / 2)) * halfingRadius}
                        y={Math.sin(degToRad(angle / 2)) * halfingRadius}
                        onMouseEnter={(e) => {
                            const stage = e.target.getStage();
                            if (stage) {
                                const container = stage.container();
                                container.style.cursor = 'pointer';
                            }
                        }}
                        onMouseLeave={(e) => {
                            const stage = e.target.getStage();
                            if (stage) {
                                const container = stage.container();
                                container.style.cursor = 'default';
                            }
                        }}
                    >
                        {/* TODO fix issue where click on icon is probably not bubbled up, thus not registered. */}
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
        // TODO implement closing on click outside.
        <Stage
            width={200}
            height={200}
            onClick={() => {
                if (props.onStageClicked) {
                    props.onStageClicked();
                }
            }}
        >
            <Layer>{getArcs()}</Layer>
        </Stage>
    );
}

export default ArcSelector;
