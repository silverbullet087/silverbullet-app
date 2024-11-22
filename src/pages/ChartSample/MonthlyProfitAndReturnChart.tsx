import React, {useState} from 'react';
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip
} from 'chart.js';
import {Chart} from 'react-chartjs-2';
import ChartWrapper from "../../components/ChartWrapper";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    BarController,
    LineController
);

const MonthlyProfitAndReturnChart: React.FC<{}> = () => {
    const labels = [
        '2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06',
        '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12',
    ];
    const [data, setData] = useState({
        labels: labels,
        datasets: [
            {
                label: '월별수익률',
                data: [
                    0.01, 0.02, -0.02, -0.01, -0.02, 0.01,
                    0.05, 0.08, -0.09, -0.02, -0.12, 0.03
                ], // 수익률 데이터 (예: [0.1, 0.2, ...])
                borderColor: 'rgba(255, 195, 0, 1)',
                backgroundColor: 'rgba(255, 195, 0, 0.9)',
                yAxisID: 'y1',
                type: 'line' as const,
                fill: false,
            },
            {
                label: '월별배당수익',
                data: [
                    300000, 200000, 300000, 200000, 300000, 200000,
                    400000, 300000, 400000, 300000, 400000, 400000
                ], // 월별수익률 데이터 (예: [1000, 1200, ...])
                borderColor: 'rgba(93, 156, 236, 1)',
                backgroundColor: 'rgba(93, 156, 236, 0.8)',
                yAxisID: 'y0',
                stack: 'Stack 0',
                type: 'bar' as const
            },
            {
                label: '월별실현손익',
                data: [
                    50000, 5000, 50000, 500000, 50000, 5000,
                    50000, 5000, 50000, 50000, 50000, 5000000
                ], // 월별배당수익 데이터 (예: [200, 200, ...])
                borderColor: 'rgba(252, 110, 81, 1)',
                backgroundColor: 'rgba(252, 110, 81, 0.8)',
                yAxisID: 'y0',
                stack: 'Stack 0',
                type: 'bar' as const
            },
            {
                label: '월별미실현손익',
                data: [
                    10000000, 8000000, 10000000, 8000000, 10000000, -8000000,
                    12000000, 10000000, -12000000, -10000000, -12000000, 12000000
                ], // 월별실현손익 데이터 (예: [150, 250, ...])
                borderColor: 'rgba(72, 207, 173, 1)',
                backgroundColor: 'rgba(72, 207, 173, 0.8)',
                yAxisID: 'y0',
                stack: 'Stack 0',
                type: 'bar' as const
            },
        ]
    });

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            'y0': {
                type: 'linear',
                display: true,
                position: 'left',
                stacked: true,
                title: {
                    display: true,
                    text: '월별 수익금(원)'
                }
            },
            'y1': {
                type: 'linear',
                display: true,
                position: 'right',
                min: -1,
                ticks: {
                    callback: (value: any, index: any, values: any) => {
                        return value * 100 + '%';
                    }
                },
                title: {
                    display: true,
                    text: '월별 수익률'
                }
            },
        }
    }

    return (
        <ChartWrapper>
            <Chart type={'bar'} data={data} options={options}/>
        </ChartWrapper>
    );


};

export default MonthlyProfitAndReturnChart;
