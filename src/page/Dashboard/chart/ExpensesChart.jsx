import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ExpensesChart() {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const expensesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Expenses',
                        data: [1000, 1200, 900, 800, 2200, 1400],
                        fill: false,
                        borderColor: 'rgba(255,99,132,1)',
                        tension: 0.1,
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
                            callback: (value) => `$${value}`,
                        },
                    },
                },
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${context.parsed.y}`,
                        },
                    },
                },
            },
        });

        return () => {
            expensesChart.destroy();
        };
    }, []);

    return (
        <div style={{ height: 300 }}>
            <canvas ref={chartRef} />
        </div>
    );
}

export default ExpensesChart;
