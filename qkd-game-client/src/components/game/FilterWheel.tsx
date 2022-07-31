import React, { createRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import styles from './FilterWheel.module.scss';
import Filter from './Filter';
import degToRad from '../../helper/DegToRad';

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
    const [isSnapping, setIsSnapping] = useState(false);
    let degOffset = 0;
    if (props.degOffset) {
        degOffset = props.degOffset;
    }
    const [currentRotDeg, setCurrentRotDeg] = useState(degOffset);
    const [targetRotDeg, setTargetRotDeg] = useState(degOffset);
    const degBetweenFilters = 360 / props.filters.length;

    useEffect(() => {
        if (props.passingPhoton) {
            props.onPhotonPassing(getFilterTypeAt(props.degWherePhotonPasses));
        }
    }, [props.passingPhoton]);

    useEffect(() => {
        setIsSnapping(true);
    }, [targetRotDeg]);

    // Snapping completion ticks up once snapping is turned on.
    const { snappingCompletion } = useSpring({
        from: { snappingCompletion: 0 },
        to: { snappingCompletion: isSnapping ? 1 : 0 },
        config: {
            precision: 0.01,
        },
        onRest: () => {
            setCurrentRotDeg(targetRotDeg);
            setIsSnapping(false);
        },
    });

    function handleFilterClick(filterIndex: number) {
        // TODO make the rotation more beautiful when looping around.
        let newTargetRotDeg =
            props.degWherePhotonPasses -
            filterIndex * degBetweenFilters -
            degOffset;
        setTargetRotDeg(newTargetRotDeg);
    }

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
                                              [currentRotDeg, targetRotDeg]
                                          )
                                          .to((x: number) => {
                                              return `rotate(${-x}deg)`;
                                          }),
                                  }
                                : { transform: `rotate(${-currentRotDeg}deg)` }
                        }
                    >
                        <Filter
                            icon={filter.icon}
                            iconRotation={filter.iconRotation}
                            onClick={() => {
                                handleFilterClick(i);
                            }}
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
            (((deg - currentRotDeg) % 360) - degOffset) / degBetweenFilters
        );
        while (filterIndex < 0) {
            filterIndex = filterIndex + props.filters.length;
        }
        return props.filters[filterIndex].filterType;
    }

    return (
        <div className={styles.filterWheelShadow}>
            <animated.div
                ref={ref}
                className={styles.filterWheel}
                style={
                    isSnapping
                        ? {
                              transform: snappingCompletion
                                  .to([0, 1], [currentRotDeg, targetRotDeg])
                                  .to((x: number) => {
                                      return `rotate(${x}deg)`;
                                  }),
                          }
                        : { transform: `rotate(${currentRotDeg}deg)` }
                }
                draggable="false"
            >
                <div className={styles.filterWheelFilters}>{getFilters()}</div>
            </animated.div>
        </div>
    );
}

export default FilterWheel;
