import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function TotalRevenueChart() {
    const totalRevenueRef = useRef(null);

    useEffect(() => {
        const ctxRevenue = totalRevenueRef.current.getContext('2d');
        const totalRevenueChart = new Chart(ctxRevenue, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [12000, 19000, 3000, 5000, 2000, 3000, 4000, 2500, 3500, 4500, 5000, 6000],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return '$' + value;
                            }
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + context.parsed.y;
                                }
                                return label;
                            }
                        }
                    }
                },
            },
        });

        return () => {
            totalRevenueChart.destroy();
        };
    }, []);

    return (
        <div className="pb-4 px-4" style={{ height: '400px' }}>
            <canvas ref={totalRevenueRef}></canvas>
        </div>
    );
}

export default TotalRevenueChart;
