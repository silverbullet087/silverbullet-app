import React, { ReactNode } from 'react';

interface ChartWrapperProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}


const ChartWrapper = ({children, className, style}: ChartWrapperProps) => {
    return (
        <div className="chart-container" style={{position: 'relative', height: '400px', width: '100%'}}>
            {children}
        </div>
    );
};

export default ChartWrapper;
