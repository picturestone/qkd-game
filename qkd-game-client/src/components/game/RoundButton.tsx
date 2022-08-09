import React, { MouseEventHandler, useState } from 'react';
import { animated, useSpring, config } from '@react-spring/web';
import styles from './RoundButton.module.scss';
import { isDisabled } from '@testing-library/user-event/dist/types/utils';

interface IProps {
    disabled?: boolean;
    onClick: MouseEventHandler;
}

function RoundButton(props: IProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const { shadowCompletion } = useSpring({
        from: { shadowCompletion: 0 },
        to: { shadowCompletion: isAnimating ? 1 : 0 },
        reverse: isFlipped,
        onRest: () => {
            if (!isFlipped) {
                setIsFlipped(true);
            } else {
                setIsFlipped(false);
                setIsAnimating(false);
            }
        },
        config: config.stiff,
    });

    return (
        <animated.div
            onClick={(event: React.MouseEvent) => {
                if (props.disabled !== true) {
                    setIsAnimating(true);
                    props.onClick(event);
                }
            }}
            className={styles.roundButton}
            style={
                isAnimating
                    ? {
                          boxShadow: shadowCompletion
                              .to([0, 1], [40, 20])
                              .to(
                                  (completion: number) =>
                                      `0 -5px 5px 0 rgb(0 0 0 / ${completion}%)`
                              ),
                      }
                    : {}
            }
        />
    );
}

export default RoundButton;
