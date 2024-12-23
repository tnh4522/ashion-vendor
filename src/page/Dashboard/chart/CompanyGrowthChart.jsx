import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function CompanyGrowthChart() {
    const companyGrowthRef = useRef(null);

    useEffect(() => {
        const ctxGrowth = companyGrowthRef.current.getContext('2d');
        const companyGrowthChart = new Chart(ctxGrowth, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                    {
                        label: 'Company Growth',
                        data: [20, 35, 50, 62],
                        fill: false,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
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
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Growth (%)',
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
                                    label += context.parsed.y + '%';
                                }
                                return label;
                            }
                        }
                    }
                },
            },
        });

        return () => {
            companyGrowthChart.destroy();
        };
    }, []);

    return (
        <div className="px-2" style={{ height: '200px' }}>
            <canvas ref={companyGrowthRef}></canvas>
        </div>
    );
}

export default CompanyGrowthChart;
