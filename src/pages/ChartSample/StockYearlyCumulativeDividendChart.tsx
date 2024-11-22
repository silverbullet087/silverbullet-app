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

const StockYearlyCumulativeDividendChart: React.FC<{}> = () => {
    const labels = [
        'SPY', 'SPYD', 'AAPL', 'QQQ', 'T', 'MSFT', 'VTI', 'SBUX', '삼성전자우',
    ];
    const [data, setData] = useState({
        labels: labels,
        datasets: [
            {
                label: '2019년',
                data: [
                    23000, 22000, 21000, 20000, 18000, 15000, 9000, 12000, 10000,
                ], // 배당금 데이터 (예: [1000, 1200, ...])
                borderColor: 'rgba(237, 85, 101, 1)',
                backgroundColor: 'rgba(237, 85, 101, 0.8)',
            },
            {
                label: '2020년',
                data: [
                    30000, 27000, 26000, 25000, 23000, 20000, 13000, 17000, 15000,
                ], // 배당금 데이터 (예: [1000, 1200, ...])
                borderColor: 'rgba(252, 110, 81, 1)',
                backgroundColor: 'rgba(252, 110, 81, 0.8)',
            },
            {
                label: '2021년',
                data: [
                    40000, 37000, 36000, 35000, 33000, 30000, 23000, 27000, 25000,
                ], // 배당금 데이터 (예: [1000, 1200, ...])
                borderColor: 'rgba(255, 206, 84, 1)',
                backgroundColor: 'rgba(255, 206, 84, 0.8)',
            },
            {
                label: '2022년',
                data: [
                    50000, 47000, 46000, 45000, 43000, 40000, 33000, 37000, 35000,
                ], // 배당금 데이터 (예: [1000, 1200, ...])
                borderColor: 'rgba(160, 212, 104, 1)',
                backgroundColor: 'rgba(160, 212, 104, 0.8)',
            },
            {
                label: '2023년',
                data: [
                    60000, 57000, 56000, 55000, 53000, 50000, 43000, 47000, 45000,
                ], // 배당금 데이터 (예: [1000, 1200, ...])
                borderColor: 'rgba(160, 212, 104, 1)',
                backgroundColor: 'rgba(160, 212, 104, 0.8)',
            },
            // 다른 연도 데이터셋도 추가해주세요.
        ]
    });

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                beginAtZero: true,
                stacked: true,
                title: {
                    display: true,
                    text: '누적배당금'
                }
            }
        },
    }

    return (
        <ChartWrapper>
            <Chart type={'bar'} data={data} options={options}/>
        </ChartWrapper>
    );


};

export default StockYearlyCumulativeDividendChart;
