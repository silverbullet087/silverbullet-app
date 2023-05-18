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

const ProfitRateChartByExchangeRate: React.FC<{}> = () => {
    const labels = ['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06', '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12'];
    const [data, setData] = useState({
        labels: labels,
        datasets: [{
            label: '환율',
            data: [
                1209.0
                , 1204.5
                , 1215.4
                , 1263.0
                , 1241.0
                , 1298.1
                , 1304.9
                , 1352.8
                , 1438.0
                , 1419.2
                , 1305.3
                , 1263.0
            ], // 환율 데이터 (예: [1100, 1000, ...])
            borderColor: 'rgba(255, 195, 0, 1)',
            backgroundColor: 'rgba(255, 195, 0, 0.9)',
            yAxisID: 'y-a',
        },
            {
                label: '수익률',
                data: [0.55, 0.50, 0.45, 0.40, 0.43, 0.38, 0.25, 0.20, 0.15, 0.32, 0.46, 0.58], // 수익률 데이터
                borderColor: 'rgba(237, 85, 101, 1)',
                backgroundColor: 'rgba(237, 85, 101, 0.8)',
                yAxisID: 'y-b',
            }]
    });

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            'y-a': {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: '환율'
                },
                min: 0,
            },
            'y-b': {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: '수익률'
                },
                ticks: {
                    callback: (value: any, index: any, values: any) => {
                        return value * 100 + '%';
                    }
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }

    return (
        <ChartWrapper>
            <Chart type={'line'} data={data} options={options}/>
        </ChartWrapper>
    );


};

export default ProfitRateChartByExchangeRate;
