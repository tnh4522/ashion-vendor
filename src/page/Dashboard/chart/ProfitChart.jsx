import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ProfitChart() {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const profitChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Product A', 'Product B', 'Product C'],
                datasets: [
                    {
                        label: 'Profit',
                        data: [300, 200, 100],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: $${value}k profit`;
                            },
                        },
                    },
                },
            },
        });

        return () => {
            profitChart.destroy();
        };
    }, []);

    return (
        <div style={{ height: 300 }}>
            <canvas ref={chartRef} />
        </div>
    );
}

export default ProfitChart;
