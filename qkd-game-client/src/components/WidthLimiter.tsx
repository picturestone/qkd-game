import React from 'react';

interface IProps {
    className?: string;
}

function WidthLimiter(props: React.PropsWithChildren<IProps>) {
    return (
        <div
            className={`w-full px-3 mx-auto max-w-8xl lg:px-4${
                props.className ? ' ' + props.className : ''
            }`}
        >
            {props.children}
        </div>
    );
}

export default WidthLimiter;
