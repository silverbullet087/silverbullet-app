import React, {ReactNode} from 'react';

// 인터페이스 정의: 차트를 포장하는 컴포넌트의 속성
interface ChartWrapperProps {
    children: ReactNode;  // 차트 컴포넌트의 자식 요소
    className?: string;   // 차트 컴포넌트의 CSS 클래스 이름 (옵션)
    style?: React.CSSProperties;  // 차트 컴포넌트의 인라인 스타일 (옵션)
}

/**
 * 차트를 포장하는 함수형 컴포넌트입니다.
 * @param {ReactNode} children - 차트 컴포넌트의 자식 요소
 * @param {string} [className] - 차트 컴포넌트의 CSS 클래스 이름 (옵션)
 * @param {React.CSSProperties} [style] - 차트 컴포넌트의 인라인 스타일 (옵션)
 * @returns {JSX.Element} 차트 컴포넌트를 포장한 <div> 요소
 */
const ChartWrapper = ({children, className, style}: ChartWrapperProps) => {
    return (
        // 차트를 포장하여 레이아웃을 제어하는 div
        <div className="chart-container" style={{position: 'relative', height: '400px', width: '100%'}}>
            {children}  // 차트 컴포넌트 렌더링
        </div>
    );
};

// 기본으로 내보내기
export default ChartWrapper;