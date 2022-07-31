import React, { useEffect, useRef, useState } from 'react';
import { useSpring } from '@react-spring/web';
import styles from './OpticalFiber.module.scss';

interface IProps {
    pathD: string;
    photon: React.ReactNode;
    onAnimationEnd: (photon: React.ReactNode) => void;
}

function OpticalFiber(props: IProps) {
    const pathRef = useRef<SVGPathElement>(null);
    const [svgHeight, setSvgHeight] = useState(0);
    const [svgWidth, setSvgWidth] = useState(0);
    const [pathLength, setPathLenght] = useState(0);
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    // TODO make duration depend on length of optical fiber.
    const { animationCompletion } = useSpring({
        from: { animationCompletion: 0 },
        to: { animationCompletion: isAnimationStarted ? 1 : 0 },
        config: {
            duration: 250,
        },
        onRest: () => {
            if (props.photon) {
                props.onAnimationEnd(props.photon);
            }
        },
    });
    const svgStyle = {
        height: `${svgHeight === 0 ? 1 : svgHeight}px`,
        width: `${svgWidth === 0 ? 1 : svgWidth}px`,
    };

    useEffect(() => {
        if (pathRef.current) {
            const rect = pathRef.current.getBBox();
            setSvgHeight(rect.height);
            setSvgWidth(rect.width);
            setPathLenght(pathRef.current.getTotalLength());
        }
        if (props.photon) {
            setIsAnimationStarted(true);
        } else {
            setIsAnimationStarted(false);
        }
    });

    function getPhotonXOnPath(pathLengthPercentage: number) {
        let xPos = 0;
        if (pathRef.current) {
            xPos = pathRef.current.getPointAtLength(
                pathLengthPercentage * pathLength
            ).x;
        }
        return Math.round(xPos);
    }

    function getPhotonYOnPath(pathLengthPercentage: number) {
        let yPos = 0;
        if (pathRef.current) {
            yPos = pathRef.current.getPointAtLength(
                pathLengthPercentage * pathLength
            ).y;
        }
        return Math.round(yPos);
    }

    return (
        <svg className={styles.opticalFiber} style={svgStyle}>
            <path
                ref={pathRef}
                d={props.pathD}
                className={styles.opticalFiberOutline}
            ></path>
            <path d={props.pathD} className={styles.opticalFiberInside}></path>
            {React.isValidElement(props.photon)
                ? React.cloneElement(props.photon, {
                      cx: animationCompletion.to((animationCompletion) =>
                          getPhotonXOnPath(animationCompletion)
                      ),
                      cy: animationCompletion.to((animationCompletion) =>
                          getPhotonYOnPath(animationCompletion)
                      ),
                  })
                : null}
        </svg>
    );
}

export default OpticalFiber;
