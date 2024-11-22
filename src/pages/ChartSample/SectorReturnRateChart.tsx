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

const SectorReturnRateChart: React.FC<{}> = () => {
    const labels = [
        'ETF',
        '기술',
        '자유소비재',
        '통신서비스',
    ]; // 섹터
    const [data, setData] = useState({
        labels: labels,
        datasets: [{
            label: '수익률',
            data: [0.30, 0.60, 0.30, 0.25], // 수익률 데이터
            borderColor: 'rgba(72, 207, 173, 1)',
            backgroundColor: 'rgba(72, 207, 173, 0.8)',
        }]
    });

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: (value: any, index: any, values: any) => {
                        return value * 100 + '%';
                    }
                },
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

export default SectorReturnRateChart;
