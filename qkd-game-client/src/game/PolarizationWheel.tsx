import React, { createRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Polarization from '../models/quantum/Polarization';
import styles from './PolarizationWheel.module.scss';
import PolarizationWheelFilter from './PolarizationWheelFilter';

function PolarizationWheel() {
    const ref = createRef<HTMLDivElement>();
    const [rotDegOnMouseDown, setrotDegOnMouseDown] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isSnapping, setIsSnapping] = useState(false);
    const [mouseDownPositionX, setMouseDownPositionX] = useState(0);
    const [mouseDownPositionY, setMouseDownPositionY] = useState(0);
    const [rotDeg, setRotDeg] = useState(0);

    useEffect(() => {
        window.addEventListener(('mouseup'), handleMouseUp);
        window.addEventListener(('mousemove'), handleMouseMove);

        return () => {
            window.removeEventListener(('mouseup'), handleMouseUp);
            window.removeEventListener(('mousemove'), handleMouseMove);
        }
    });

    // Snapping completion ticks up once snapping is turned on.
    const { snappingCompletion } = useSpring({
        from: { snappingCompletion: 0 },
        to: { snappingCompletion: isSnapping ? 1 : 0 },
        onRest: () => {
            setRotDeg(getNearestNintyDeg(rotDeg));
            setIsSnapping(false);
        }
    });

    function getPolarizationWheelFilters(): JSX.Element[] {
        const filters : JSX.Element[] = [];
        const polarizations = [
            Polarization.Zero,
            Polarization.PlusFourtyFive,
            Polarization.Ninety,Polarization.MinusFourtyFive
        ];
        for (let i = 0; i < 4; i++) {
            filters.push(
                <div>
                    <animated.div style={isSnapping 
                            ? { transform: snappingCompletion.to([0, 1], [rotDeg, getNearestNintyDeg(rotDeg)]).to((x: number) => {
                                return `rotate(${-x}deg)`;
                            })}
                            : { transform: `rotate(${-rotDeg}deg)`}}
                    >
                        <PolarizationWheelFilter
                        polarization={ polarizations[i] }
                        key={ i } />
                    </animated.div>
                </div>
            );
        }
        return filters;
    }

    function getElementCenter(): { x: number; y: number; } {
        let positions = {
            x: 0,
            y: 0
        };
        const componentDom = ref.current;
        if (componentDom) {
            positions['x'] = componentDom.offsetLeft + (componentDom.offsetWidth / 2);
            positions['y'] = componentDom.offsetTop + (componentDom.offsetHeight / 2);
        }
        return positions;
    }

    function handleMouseDown(event: React.MouseEvent) {
        if (!isSnapping) {
            const elementCenter = getElementCenter();
            setIsDragging(true);
            setMouseDownPositionX(event.pageX - elementCenter.x);
            setMouseDownPositionY(elementCenter.y - event.pageY);
            setrotDegOnMouseDown(rotDeg);
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (isDragging && !isSnapping) {
            const deltaDeg = degFromMouseDown(event.pageX, event.pageY);
            setRotDeg(rotDegOnMouseDown + deltaDeg);
        }
    }

    function handleMouseUp(event: MouseEvent) {
        if (isDragging && !isSnapping) {
            const deltaDeg = degFromMouseDown(event.pageX, event.pageY);
            const newDeg = rotDegOnMouseDown + deltaDeg;
            setIsDragging(false);
            setRotDeg(newDeg);
            // Once mouse is let go snapping begins.
            setIsSnapping(true);
        }
    }

    function getNearestNintyDeg(deg: number): number {
        return Math.round(deg/90) * 90;
    }

    function degFromMouseDown(posX: number, posY: number): number {
        const elementCenter = getElementCenter();
        const dX = posX - elementCenter.x;
        const dY = elementCenter.y - posY;
        let downAngle = radToDeg(Math.atan2(mouseDownPositionY, mouseDownPositionX));
        let moveAngle = radToDeg(Math.atan2(dY, dX));
        return downAngle - moveAngle;
    }

    function radToDeg(rad: number): number {
        return rad * 180 / Math.PI;
    }

    return (
        <animated.div
            ref={ ref }
            className={ styles.polarizationWheel }
            onMouseDown={ (event) => handleMouseDown(event) }
            style={isSnapping 
                ? { transform: snappingCompletion.to([0, 1], [rotDeg, getNearestNintyDeg(rotDeg)]).to((x: number) => {
                    return `rotate(${x}deg)`;
                })}
                : { transform: `rotate(${rotDeg}deg)`}}
            draggable='false'
        >
            { getPolarizationWheelFilters() }
        </animated.div>
    );
}

export default PolarizationWheel;