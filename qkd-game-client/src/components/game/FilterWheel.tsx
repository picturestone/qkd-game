import React, { createRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styles from './FilterWheel.module.scss';
import Filter from './Filter';

interface IProps<FilterType> {
    degOffset?: number;
    degWherePhotonPasses: number;
    onPhotonPassing: (selectedFilterType: FilterType) => void;
    passingPhoton: React.ReactNode;
    filters: {
        filterType: FilterType;
        icon: JSX.Element;
        iconRotation: number;
    }[];
}

function FilterWheel<FilterType>(props: IProps<FilterType>) {
    const ref = createRef<HTMLDivElement>();
    const [rotDegOnMouseDown, setRotDegOnMouseDown] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isSnapping, setIsSnapping] = useState(false);
    const [mouseDownPositionX, setMouseDownPositionX] = useState(0);
    const [mouseDownPositionY, setMouseDownPositionY] = useState(0);
    let degOffset = 0;
    if (props.degOffset) {
        degOffset = props.degOffset;
    }
    const [rotDeg, setRotDeg] = useState(degOffset);
    const degBetweenFilters = 360 / props.filters.length;
    let elementCenter = getElementCenter();

    useEffect(() => {
        elementCenter = getElementCenter();

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup function for deconstructing component to remove old event listeners.
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (props.passingPhoton) {
            props.onPhotonPassing(getFilterTypeAt(props.degWherePhotonPasses));
        }
    }, [props.passingPhoton]);

    // Snapping completion ticks up once snapping is turned on.
    const { snappingCompletion } = useSpring({
        from: { snappingCompletion: 0 },
        to: { snappingCompletion: isSnapping ? 1 : 0 },
        config: {
            precision: 0.01,
        },
        onRest: () => {
            setRotDeg(getNearestLockedDeg(rotDeg));
            setIsSnapping(false);
        },
    });

    function getFilters(): JSX.Element[] {
        const filters: JSX.Element[] = [];

        for (let i = 0; i < props.filters.length; i++) {
            const filter = props.filters[i];
            // -90 because in unit circle the right hand side has 0 degrees, but here the right hand filter has 90 degrees.
            const degInWheel = i * degBetweenFilters - 90;
            const spacingTop = parseFloat(
                Math.sin(degToRad(degInWheel)).toFixed(2)
            );
            const spacingLeft = parseFloat(
                Math.cos(degToRad(degInWheel)).toFixed(2)
            );
            const divStyle = {
                top: `${(spacingTop * 100) / 2 + 50}%`,
                left: `${(spacingLeft * 100) / 2 + 50}%`,
            };
            filters.push(
                <div key={i} style={divStyle}>
                    <animated.div
                        style={
                            isSnapping
                                ? {
                                      transform: snappingCompletion
                                          .to(
                                              [0, 1],
                                              [
                                                  rotDeg,
                                                  getNearestLockedDeg(rotDeg),
                                              ]
                                          )
                                          .to((x: number) => {
                                              return `rotate(${-x}deg)`;
                                          }),
                                  }
                                : { transform: `rotate(${-rotDeg}deg)` }
                        }
                    >
                        <Filter
                            icon={filter.icon}
                            iconRotation={filter.iconRotation}
                        />
                    </animated.div>
                </div>
            );
        }
        return filters;
    }

    function getFilterTypeAt(deg: number) {
        // TODO Check if the photon even hits a filter with the current rotation.
        let filterIndex = Math.round(
            ((deg - rotDeg) % 360) / degBetweenFilters
        );
        console.log(rotDeg);
        while (filterIndex < 0) {
            filterIndex = filterIndex + props.filters.length;
        }
        return props.filters[filterIndex].filterType;
    }

    function getElementCenter(): { x: number; y: number } {
        let positions = {
            x: 0,
            y: 0,
        };
        const componentDom = ref.current;
        if (componentDom) {
            positions['x'] =
                componentDom.offsetLeft + componentDom.offsetWidth / 2;
            positions['y'] =
                componentDom.offsetTop + componentDom.offsetHeight / 2;
        }
        return positions;
    }

    function handleMouseDown(event: React.MouseEvent) {
        if (!isSnapping) {
            setIsDragging(true);
            setMouseDownPositionX(event.pageX - elementCenter.x);
            setMouseDownPositionY(elementCenter.y - event.pageY);
            setRotDegOnMouseDown(rotDeg);
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

    function getNearestLockedDeg(deg: number): number {
        return (
            Math.round(deg / degBetweenFilters) * degBetweenFilters + degOffset
        );
    }

    function degFromMouseDown(posX: number, posY: number): number {
        const dX = posX - elementCenter.x;
        const dY = elementCenter.y - posY;
        let downAngle = radToDeg(
            Math.atan2(mouseDownPositionY, mouseDownPositionX)
        );
        let moveAngle = radToDeg(Math.atan2(dY, dX));
        return downAngle - moveAngle;
    }

    function radToDeg(rad: number): number {
        return (rad * 180) / Math.PI;
    }

    function degToRad(deg: number) {
        return (deg * Math.PI) / 180;
    }

    return (
        <div className={styles.filterWheelShadow}>
            <animated.div
                ref={ref}
                className={styles.filterWheel}
                onMouseDown={(event) => handleMouseDown(event)}
                style={
                    isSnapping
                        ? {
                              transform: snappingCompletion
                                  .to(
                                      [0, 1],
                                      [rotDeg, getNearestLockedDeg(rotDeg)]
                                  )
                                  .to((x: number) => {
                                      return `rotate(${x}deg)`;
                                  }),
                          }
                        : { transform: `rotate(${rotDeg}deg)` }
                }
                draggable="false"
            >
                <div className={styles.filterWheelFilters}>{getFilters()}</div>
            </animated.div>
        </div>
    );
}

export default FilterWheel;
