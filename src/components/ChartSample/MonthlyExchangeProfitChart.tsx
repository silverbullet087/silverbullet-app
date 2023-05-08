import React, {MouseEvent, useRef, useState} from 'react';
import type {InteractionItem} from 'chart.js';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from 'chart.js';
import {
    Chart
} from 'react-chartjs-2';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

const MonthlyExchangeProfitChart: React.FC<{}> = () => {
    const labels = ['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06', '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12'];
    const [data, setData] = useState({
        labels: labels,
        datasets: [
            {
                label: '환차익',
                data: [
                    5478119
                    , 4414079
                    , 5784711
                    , 14027587
                    , 10238240
                    , 20652669
                    , 21175138
                    , 28232195
                    , 44742767
                    , 43506682
                    , 23729312
                    , 13840627
                ], // 환차익 데이터 (예: [1000, 1200, ...])
                borderColor: 'rgba(55, 188, 155, 1)',
                backgroundColor: 'rgba(55, 188, 155, 0.8)',
                yAxisID: 'y-a',
                type: 'bar' as const
            },
            {
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
                yAxisID: 'y-b',
                type: 'line' as const,
                fill: false,
            }
        ]
    });

    const options: any = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: '월'
                }
            },
            'y-a': {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: '환차익'
                }
            },
            'y-b': {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: '환율'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }

    return (
        <div className="chart-container" style={{position: 'relative', width: '100%', maxHeight: '500px' }}>
            <Chart type={'bar'} data={data} options={options} width={400} height={400}/>
        </div>
    );



};

export default MonthlyExchangeProfitChart;
