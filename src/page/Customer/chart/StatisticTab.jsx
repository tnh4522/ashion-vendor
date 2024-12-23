import {Bar, Pie} from 'react-chartjs-2';
import {Card} from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const StatisticTab = () => {
    const salesDataMock = {
        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
        values: [500, 700, 800, 600, 900, 750]
    };

    const marketShareDataMock = {
        labels: ["Sản phẩm A", "Sản phẩm B", "Sản phẩm C", "Sản phẩm D"],
        values: [300, 150, 100, 50]
    };

    const barData = {
        labels: salesDataMock.labels,
        datasets: [
            {
                label: 'Doanh số',
                data: salesDataMock.values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Doanh số theo tháng',
            },
        },
    };

    const pieData = {
        labels: marketShareDataMock.labels,
        datasets: [
            {
                label: 'Thị phần',
                data: marketShareDataMock.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Thị phần sản phẩm',
            },
        },
    };

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Card title="Customer sales statistics" bordered={false} style={{width: '60%'}}>
                <Bar data={barData} options={barOptions}/>
            </Card>
            <Card title="Statistics of products purchased by customers" bordered={false} style={{width: '40%'}}>
                <Pie data={pieData} options={pieOptions}/>
            </Card>
        </div>
    );
};

export default StatisticTab;
