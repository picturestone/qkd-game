import React, { createRef } from "react";
import { transform } from "typescript";
import styles from "./PolarizationWheel.module.scss";
import PolarizationWheelFilter from "./PolarizationWheelFilter";

interface IProps {
}

interface IState {
    isDragging: boolean;
    mouseDownPositionX: number;
    mouseDownPositionY: number;
    rotDeg: number;
    rotStyle: {}
}

/**
 * Maybe add a running rot deg style and a not running one? 
 */

class PolarizationWheel extends React.Component<IProps, IState> {
    private ref = createRef<HTMLDivElement>();

    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false,
            mouseDownPositionX: 0,
            mouseDownPositionY: 0,
            rotDeg: 0,
            rotStyle: {
                transform: `translate(0deg)`
            }
        }
    }

    componentDidMount() {
        window.addEventListener(('mouseup'), this.handleMouseUp.bind(this));
        window.addEventListener(('mousemove'), this.handleMouseMove.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener(('mouseup'), this.handleMouseUp.bind(this));
        window.removeEventListener(('mousemove'), this.handleMouseMove.bind(this));
    }

    getPolarizationWheelFilters(): JSX.Element[] {
        const filters : JSX.Element[] = [];
        for (let i = 0; i < 4; i++) {
            filters.push(
                <PolarizationWheelFilter 
                    key={i} 
                />
            );
        }
        return filters;
    }

    handleMouseDown(event: React.MouseEvent) {
        const elementCenter = this.getElementCenter();

        this.setState({
            ...this.state,
            isDragging: true,
            mouseDownPositionX: event.pageX - elementCenter.x, 
            mouseDownPositionY: elementCenter.y - event.pageY
        });
    }

    getElementCenter() {
        let positions = {
            x: 0,
            y: 0
        };
        const componentDom = this.ref.current;
        if (componentDom) {
            positions['x'] = componentDom.offsetLeft + (componentDom.offsetWidth / 2);
            positions['y'] = componentDom.offsetTop + (componentDom.offsetHeight / 2);
        }
        return positions;
    }

    handleMouseMove(event: MouseEvent) {
        if (this.state.isDragging) {
            const deltaDeg = this.degFromMouseDown(event.pageX, event.pageY);
            this.setState({
                ...this.state,
                rotStyle: {
                    transform: `rotate(${ this.state.rotDeg + deltaDeg }deg)`
                }
            });
        }
    }

    handleMouseUp(event: MouseEvent) {
        if (this.state.isDragging) {
            const deltaDeg = this.degFromMouseDown(event.pageX, event.pageY);
            const newDeg = this.state.rotDeg + deltaDeg;

            this.setState({
                ...this.state,
                isDragging: false,
                rotDeg: newDeg,
                rotStyle: {
                    transform: `rotate(${ newDeg }deg)`
                }
            });
        }
    }

    degFromMouseDown(posX: number, posY: number): number {
        const elementCenter = this.getElementCenter();
        const dX = posX - elementCenter.x;
        const dY = elementCenter.y - posY;
        let downAngle = this.radToDeg(Math.atan2(this.state.mouseDownPositionY, this.state.mouseDownPositionX));
        let moveAngle = this.radToDeg(Math.atan2(dY, dX));
        return Math.round(downAngle - moveAngle);
    }

    radToDeg(rad: number): number {
        return rad * 180 / Math.PI;
    }

    render() {
        return (
            <div
                ref={ this.ref }
                className={ styles.polarizationWheel }
                onMouseDown={ (event) => this.handleMouseDown(event) }
                style={ this.state.rotStyle }
                draggable="false"
            >
                { this.getPolarizationWheelFilters() }
            </div>
        );
    }
}

export default PolarizationWheel;