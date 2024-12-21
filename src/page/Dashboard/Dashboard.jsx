import {useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';

function Dashboard() {
    document.title = "Dashboard";

    const totalRevenueRef = useRef(null);
    const companyGrowthRef = useRef(null);

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
            totalRevenueChart.destroy();
            companyGrowthChart.destroy();
        };
    }, []);

    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="row row-bordered g-0">
                                <div className="col-md-8">
                                    <h5 className="card-header">Total Revenue</h5>
                                    <div className="pb-4 px-4" style={{height: '400px'}}>
                                        <canvas ref={totalRevenueRef}></canvas>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card-body">
                                        <div className="text-center">
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-sm btn-outline-primary dropdown-toggle"
                                                    type="button"
                                                    id="growthReportId"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    2022
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end"
                                                     aria-labelledby="growthReportId">
                                                    <a className="dropdown-item" href="/">2021</a>
                                                    <a className="dropdown-item" href="/">2020</a>
                                                    <a className="dropdown-item" href="/">2019</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-2" style={{height: '200px'}}>
                                        <canvas ref={companyGrowthRef}></canvas>
                                    </div>
                                    <div className="text-center fw-semibold pt-3 mb-2">62% Company Growth
                                    </div>
                                    <div
                                        className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
                                        <div className="d-flex">
                                            <div className="me-2">
                                                <span className="badge bg-label-primary p-2"><i
                                                    className="bx bx-dollar text-primary"></i></span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small>2022</small>
                                                <h6 className="mb-0">$32.5k</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="me-2">
                                                <span className="badge bg-label-info p-2"><i
                                                    className="bx bx-wallet text-info"></i></span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small>2021</small>
                                                <h6 className="mb-0">$41.2k</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Phần còn lại của Dashboard */}
                    <div className="col-12 mb-4">
                        <div className="row">
                            <div className="col-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div
                                            className="card-title d-flex align-items-start justify-content-between">
                                            <div className="avatar flex-shrink-0">
                                                <img
                                                    src="/admin/assets/img/icons/unicons/chart-success.png"
                                                    alt="chart success"
                                                    className="rounded"
                                                />
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt3"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end"
                                                     aria-labelledby="cardOpt3">
                                                    <a className="dropdown-item" href="/">View
                                                        More</a>
                                                    <a className="dropdown-item"
                                                       href="/">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="fw-semibold d-block mb-1">Profit</span>
                                        <h3 className="card-title mb-2">$12,628</h3>
                                        <small className="text-success fw-semibold"><i
                                            className="bx bx-up-arrow-alt"></i> +72.80%</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-title d-flex align-items-start justify-content-between">
                                            <div className="avatar flex-shrink-0">
                                                <img
                                                    src="/admin/assets/img/icons/unicons/wallet-info.png"
                                                    alt="Credit Card"
                                                    className="rounded"
                                                />
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt6"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end"
                                                     aria-labelledby="cardOpt6">
                                                    <a className="dropdown-item" href="/">View
                                                        More</a>
                                                    <a className="dropdown-item"
                                                       href="/">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="fw-semibold d-block mb-1">Sales</span>
                                        <h3 className="card-title text-nowrap mb-2">$4,679</h3>
                                        <small className="text-success fw-semibold"><i
                                            className="bx bx-up-arrow-alt"></i> +28.42%</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div
                                            className="card-title d-flex align-items-start justify-content-between">
                                            <div className="avatar flex-shrink-0">
                                                <img src="/admin/assets/img/icons/unicons/paypal.png"
                                                     alt="Credit Card" className="rounded"/>
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt4"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end"
                                                     aria-labelledby="cardOpt4">
                                                    <a className="dropdown-item" href="/">View
                                                        More</a>
                                                    <a className="dropdown-item"
                                                       href="/">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="fw-semibold d-block mb-1">Payments</span>
                                        <h3 className="card-title text-nowrap mb-2">$2,456</h3>
                                        <small className="text-danger fw-semibold"><i
                                            className="bx bx-down-arrow-alt"></i> -14.82%</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div
                                            className="card-title d-flex align-items-start justify-content-between">
                                            <div className="avatar flex-shrink-0">
                                                <img src="/admin/assets/img/icons/unicons/cc-primary.png"
                                                     alt="Credit Card" className="rounded"/>
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="btn p-0"
                                                    type="button"
                                                    id="cardOpt1"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu" aria-labelledby="cardOpt1">
                                                    <a className="dropdown-item" href="/">View
                                                        More</a>
                                                    <a className="dropdown-item"
                                                       href="/">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="fw-semibold d-block mb-1">Transactions</span>
                                        <h3 className="card-title mb-2">$14,857</h3>
                                        <small className="text-success fw-semibold"><i
                                            className="bx bx-up-arrow-alt"></i> +28.14%</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Các hàng và cột khác */}
                <div className="row">
                    <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
                        <div className="card h-100">
                            <div
                                className="card-header d-flex align-items-center justify-content-between pb-0">
                                <div className="card-title mb-0">
                                    <h5 className="m-0 me-2">Order Statistics</h5>
                                    <small className="text-muted">42.82k Total Sales</small>
                                </div>
                                <div className="dropdown">
                                    <button
                                        className="btn p-0"
                                        type="button"
                                        id="orederStatistics"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-end"
                                         aria-labelledby="orederStatistics">
                                        <a className="dropdown-item" href="/">Select
                                            All</a>
                                        <a className="dropdown-item" href="/">Refresh</a>
                                        <a className="dropdown-item" href="/">Share</a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex flex-column align-items-center gap-1">
                                        <h2 className="mb-2">8,258</h2>
                                        <span>Total Orders</span>
                                    </div>
                                    <div id="orderStatisticsChart"></div>
                                </div>
                                <ul className="p-0 m-0">
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <span className="avatar-initial rounded bg-label-primary"
                                            ><i className="bx bx-mobile-alt"></i
                                            ></span>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <h6 className="mb-0">Electronic</h6>
                                                <small className="text-muted">Mobile, Earbuds, TV</small>
                                            </div>
                                            <div className="user-progress">
                                                <small className="fw-semibold">82.5k</small>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <span className="avatar-initial rounded bg-label-success"><i
                                                className="bx bx-closet"></i></span>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <h6 className="mb-0">Fashion</h6>
                                                <small className="text-muted">T-shirt, Jeans, Shoes</small>
                                            </div>
                                            <div className="user-progress">
                                                <small className="fw-semibold">23.8k</small>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <span className="avatar-initial rounded bg-label-info"><i
                                                className="bx bx-home-alt"></i></span>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <h6 className="mb-0">Decor</h6>
                                                <small className="text-muted">Fine Art, Dining</small>
                                            </div>
                                            <div className="user-progress">
                                                <small className="fw-semibold">849k</small>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <span className="avatar-initial rounded bg-label-secondary"
                                            ><i className="bx bx-football"></i
                                            ></span>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <h6 className="mb-0">Sports</h6>
                                                <small className="text-muted">Football, Cricket Kit</small>
                                            </div>
                                            <div className="user-progress">
                                                <small className="fw-semibold">99</small>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-4 order-1 mb-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <ul className="nav nav-pills" role="tablist">
                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className="nav-link active"
                                            role="tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#navs-tabs-line-card-income"
                                            aria-controls="navs-tabs-line-card-income"
                                            aria-selected="true"
                                        >
                                            Income
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button type="button" className="nav-link" role="tab">Expenses
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button type="button" className="nav-link" role="tab">Profit
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body px-0">
                                <div className="tab-content p-0">
                                    <div className="tab-pane fade show active"
                                         id="navs-tabs-line-card-income" role="tabpanel">
                                        <div className="d-flex p-4 pt-3">
                                            <div className="avatar flex-shrink-0 me-3">
                                                <img src="/admin/assets/img/icons/unicons/wallet.png"
                                                     alt="User"/>
                                            </div>
                                            <div>
                                                <small className="text-muted d-block">Total Balance</small>
                                                <div className="d-flex align-items-center">
                                                    <h6 className="mb-0 me-1">$459.10</h6>
                                                    <small className="text-success fw-semibold">
                                                        <i className="bx bx-chevron-up"></i>
                                                        42.9%
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="incomeChart"></div>
                                        <div className="d-flex justify-content-center pt-4 gap-2">
                                            <div className="flex-shrink-0">
                                                <div id="expensesOfWeek"></div>
                                            </div>
                                            <div>
                                                <p className="mb-n1 mt-1">Expenses This Week</p>
                                                <small className="text-muted">$39 less than last
                                                    week</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-4 order-2 mb-4">
                        <div className="card h-100">
                            <div className="card-header d-flex align-items-center justify-content-between">
                                <h5 className="card-title m-0 me-2">Transactions</h5>
                                <div className="dropdown">
                                    <button
                                        className="btn p-0"
                                        type="button"
                                        id="transactionID"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-end"
                                         aria-labelledby="transactionID">
                                        <a className="dropdown-item" href="/">Last 28
                                            Days</a>
                                        <a className="dropdown-item" href="/">Last
                                            Month</a>
                                        <a className="dropdown-item" href="/">Last
                                            Year</a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul className="p-0 m-0">
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src="/admin/assets/img/icons/unicons/paypal.png" alt="User"
                                                 className="rounded"/>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <small className="text-muted d-block mb-1">Paypal</small>
                                                <h6 className="mb-0">Send money</h6>
                                            </div>
                                            <div className="user-progress d-flex align-items-center gap-1">
                                                <h6 className="mb-0">+82.6</h6>
                                                <span className="text-muted">USD</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src="/admin/assets/img/icons/unicons/wallet.png" alt="User"
                                                 className="rounded"/>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <small className="text-muted d-block mb-1">Wallet</small>
                                                <h6 className="mb-0">Mac's</h6>
                                            </div>
                                            <div className="user-progress d-flex align-items-center gap-1">
                                                <h6 className="mb-0">+270.69</h6>
                                                <span className="text-muted">USD</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src="/admin/assets/img/icons/unicons/chart.png" alt="User"
                                                 className="rounded"/>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <small className="text-muted d-block mb-1">Transfer</small>
                                                <h6 className="mb-0">Refund</h6>
                                            </div>
                                            <div className="user-progress d-flex align-items-center gap-1">
                                                <h6 className="mb-0">+637.91</h6>
                                                <span className="text-muted">USD</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src="/admin/assets/img/icons/unicons/cc-success.png" alt="User"
                                                 className="rounded"/>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <small className="text-muted d-block mb-1">Credit
                                                    Card</small>
                                                <h6 className="mb-0">Ordered Food</h6>
                                            </div>
                                            <div className="user-progress d-flex align-items-center gap-1">
                                                <h6 className="mb-0">-838.71</h6>
                                                <span className="text-muted">USD</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src="/admin/assets/img/icons/unicons/wallet.png" alt="User"
                                                 className="rounded"/>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <small className="text-muted d-block mb-1">Wallet</small>
                                                <h6 className="mb-0">Starbucks</h6>
                                            </div>
                                            <div className="user-progress d-flex align-items-center gap-1">
                                                <h6 className="mb-0">+203.33</h6>
                                                <span className="text-muted">USD</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src="/admin/assets/img/icons/unicons/cc-warning.png" alt="User"
                                                 className="rounded"/>
                                        </div>
                                        <div
                                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                            <div className="me-2">
                                                <small
                                                    className="text-muted d-block mb-1">Mastercard</small>
                                                <h6 className="mb-0">Ordered Food</h6>
                                            </div>
                                            <div className="user-progress d-flex align-items-center gap-1">
                                                <h6 className="mb-0">-92.45</h6>
                                                <span className="text-muted">USD</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
