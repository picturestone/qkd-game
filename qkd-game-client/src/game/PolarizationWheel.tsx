import React, { createRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Polarization from "../models/quantum/Polarization";
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

    const spring = useSpring({
        from: { x: 0},
        x: 1,
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
                <PolarizationWheelFilter
                    degCorrection={ -rotDeg }
                    polarization={ polarizations[i] }
                    key={ i } />
            );
        }
        return filters;
    }

    function handleMouseDown(event: React.MouseEvent) {
        const elementCenter = getElementCenter();
        setIsDragging(true);
        setMouseDownPositionX(event.pageX - elementCenter.x);
        setMouseDownPositionY(elementCenter.y - event.pageY);
        setrotDegOnMouseDown(rotDeg);
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

    function handleMouseMove(event: MouseEvent) {
        if (isDragging) {
            const deltaDeg = degFromMouseDown(event.pageX, event.pageY);
            setRotDeg(rotDegOnMouseDown + deltaDeg);
        }
    }

    function handleMouseUp(event: MouseEvent) {
        if (isDragging) {
            const deltaDeg = degFromMouseDown(event.pageX, event.pageY);
            const newDeg = rotDegOnMouseDown + deltaDeg;
            setIsDragging(false);
            setRotDeg(newDeg);
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
            style={{ transform: `rotate(${ isSnapping ? spring.x.to([0, 1], [0, 100]) : rotDeg }deg)` }}

            //            style={{ transform: `rotate(${ isSnapping ? spring.deg.to([rotDeg, getNearestNintyDeg(rotDeg)], [rotDeg, getNearestNintyDeg(rotDeg)]) : rotDeg }deg)` }}
            draggable='false'
        >
            { getPolarizationWheelFilters() }
        </animated.div>
    );
}

export default PolarizationWheel;