import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function IncomeChart() {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const incomeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Income',
                        data: [2000, 3000, 4000, 1500, 5000, 3500],
                        backgroundColor: 'rgba(75,192,192, 0.5)',
                        borderColor: 'rgba(75,192,192, 1)',
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
            incomeChart.destroy();
        };
    }, []);

    return (
        <div style={{ height: 300 }}>
            <canvas ref={chartRef} />
        </div>
    );
}

export default IncomeChart;
