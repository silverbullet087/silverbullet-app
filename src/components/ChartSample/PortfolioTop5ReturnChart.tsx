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
import ChartWrapper from "../../common/components/ChartWrapper";

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

const PortfolioTop5ReturnChart: React.FC<{}> = () => {
    const labels = [
        'SPY', 'SPYD', 'AAPL', 'QQQ', 'MSFT'
    ]; // 종목 라벨 (예: ['삼성전자', 'SK하이닉스', ...]);
    const [data, setData] = useState({
        labels: labels,
        datasets: [{
            label: '수익률',
            data: [0.80, 0.65, 0.40, 0.25, 0.10], // 수익률 데이터
            borderColor: 'rgba(72, 207, 173, 1)',
            backgroundColor: 'rgba(72, 207, 173, 0.8)',
        }]
    });

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // This will make the Horizontal Bar Chart
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                }
            }],
            x: {
                ticks: {
                    callback: (value: any, index: any, values: any) => {
                        return value * 100 + '%';
                    }
                },
                title: {
                    display: true,
                    text: '수익률'
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

export default PortfolioTop5ReturnChart;
