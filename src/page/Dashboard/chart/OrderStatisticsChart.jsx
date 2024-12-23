// OrderStatisticsChart.jsx
import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function OrderStatisticsChart() {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        const chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Electronic', 'Fashion', 'Decor', 'Sports'],
                datasets: [
                    {
                        label: 'Orders',
                        // Giả sử:
                        // Electronic: 82.5k -> 82500
                        // Fashion: 23.8k -> 23800
                        // Decor: 849k -> 849000
                        // Sports: 99 -> 99
                        data: [82500, 23800, 849000, 99],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)',   // Electronic
                            'rgba(75, 192, 192, 0.7)',  // Fashion
                            'rgba(255, 206, 86, 0.7)',  // Decor
                            'rgba(153, 102, 255, 0.7)', // Sports
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom', // hoặc 'top', 'left', 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value} orders`;
                            },
                        },
                    },
                },
            },
        });

        return () => {
            chartInstance.destroy();
        };
    }, []);

    return (
        <div style={{ width: '120px', height: '120px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default OrderStatisticsChart;
