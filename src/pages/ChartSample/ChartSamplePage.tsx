import React from 'react';
import ChartGrid from "./ChartGrid";
import './ChartGrid.css';
import ThemedTitle from "../../components/ThemedTitle";

const ChartSamplePage = () => {
    return (
        <div>
            <ThemedTitle title={'차트 샘플'}/>
            <ChartGrid/>
        </div>
    );
};

export default ChartSamplePage;
