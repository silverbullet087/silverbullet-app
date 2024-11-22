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
    Tooltip,
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
    LineController,
);

const StockReturnRateChart: React.FC<{}> = () => {
    const labels = [
        'SPY', 'QQQ', 'VTI', 'AAPL', 'MSFT', 'META', 'SBUX'
    ]; // 종목 라벨 (예: ['삼성전자', 'SK하이닉스', ...]);
    const [data, setData] = useState({
        labels: labels,
        datasets: [{
            label: '수익률',
            data: [0.30, -0.05, -0.09, 0.85, 0.05, 0.15, 0.3], // 수익률 데이터
            borderColor: 'rgba(72, 207, 173, 1)',
            backgroundColor: 'rgba(72, 207, 173, 0.8)',
        }]
    });

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                }
            }],
            y: {
                ticks: {
                    beginAtZero: true,
                    callback: (value: any, index: any, values: any) => {
                        return value * 100 + '%';
                    }
                },
                title: {
                    display: true,
                    text: '수익률'
                }
            }
        }
    }

    return (
        <ChartWrapper>
            <Chart type={'bar'} data={data} options={options}/>
        </ChartWrapper>
    );


};

export default StockReturnRateChart;
