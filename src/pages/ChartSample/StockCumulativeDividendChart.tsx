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

const StockCumulativeDividendChart: React.FC<{}> = () => {
    const labels = [
            'SPY', 'SPYD', 'AAPL', 'QQQ', 'T', 'MSFT', 'VTI', 'SBUX', '삼성전자우',
        ]; // 종목 라벨 (예: ['삼성전자', 'SK하이닉스', ...])
    const [data, setData] = useState({
        labels: labels,
        datasets: [
            {
                label: '누적배당금',
                data: [
                    4728132, 1281431, 821522, 552065, 471297, 411661, 307000, 200000, 100000
                ], // 배당금 데이터 (예: [1000, 1200, ...])
                borderColor: 'rgba(72, 207, 173, 1)',
                backgroundColor: 'rgba(72, 207, 173, 0.8)',
            }
        ]
    });

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
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

export default StockCumulativeDividendChart;
