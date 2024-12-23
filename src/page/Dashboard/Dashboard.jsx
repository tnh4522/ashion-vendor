import TotalRevenueChart from './chart/TotalRevenueChart.jsx';
import CompanyGrowthChart from './chart/CompanyGrowthChart.jsx';
import StatsCards from './StatsCards';
import OrderStatistics from './OrderStatistics';
import IncomeExpensesProfitCard from './IncomeExpensesProfitCard';
import TransactionsCard from './TransactionsCard';

function Dashboard() {
    document.title = 'Dashboard';

    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="row row-bordered g-0">
                                <div className="col-md-8">
                                    <h5 className="card-header">Total Revenue</h5>
                                    <TotalRevenueChart />
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
                                                <div
                                                    className="dropdown-menu dropdown-menu-end"
                                                    aria-labelledby="growthReportId"
                                                >
                                                    <a className="dropdown-item" href="/">2021</a>
                                                    <a className="dropdown-item" href="/">2020</a>
                                                    <a className="dropdown-item" href="/">2019</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <CompanyGrowthChart />
                                    <div className="text-center fw-semibold pt-3 mb-2">
                                        62% Company Growth
                                    </div>
                                    <div
                                        className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between"
                                    >
                                        <div className="d-flex">
                                            <div className="me-2">
                        <span className="badge bg-label-primary p-2">
                          <i className="bx bx-dollar text-primary"></i>
                        </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small>2022</small>
                                                <h6 className="mb-0">$32.5k</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="me-2">
                        <span className="badge bg-label-info p-2">
                          <i className="bx bx-wallet text-info"></i>
                        </span>
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

                    <div className="col-12 mb-4">
                        <StatsCards />
                    </div>
                </div>

                {/* Các hàng và cột khác */}
                <div className="row">
                    <OrderStatistics />
                    <IncomeExpensesProfitCard />
                    <TransactionsCard />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
