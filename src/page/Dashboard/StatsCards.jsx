function StatsCards() {
    return (
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
                                    <a className="dropdown-item" href="/">View More</a>
                                    <a className="dropdown-item" href="/">Delete</a>
                                </div>
                            </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Profit</span>
                        <h3 className="card-title mb-2">$12,628</h3>
                        <small className="text-success fw-semibold">
                            <i className="bx bx-up-arrow-alt"></i> +72.80%
                        </small>
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
                                    <a className="dropdown-item" href="/">View More</a>
                                    <a className="dropdown-item" href="/">Delete</a>
                                </div>
                            </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Sales</span>
                        <h3 className="card-title text-nowrap mb-2">$4,679</h3>
                        <small className="text-success fw-semibold">
                            <i className="bx bx-up-arrow-alt"></i> +28.42%
                        </small>
                    </div>
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-body">
                        <div
                            className="card-title d-flex align-items-start justify-content-between">
                            <div className="avatar flex-shrink-0">
                                <img
                                    src="/admin/assets/img/icons/unicons/paypal.png"
                                    alt="Credit Card"
                                    className="rounded"
                                />
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
                                    <a className="dropdown-item" href="/">View More</a>
                                    <a className="dropdown-item" href="/">Delete</a>
                                </div>
                            </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Payments</span>
                        <h3 className="card-title text-nowrap mb-2">$2,456</h3>
                        <small className="text-danger fw-semibold">
                            <i className="bx bx-down-arrow-alt"></i> -14.82%
                        </small>
                    </div>
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-body">
                        <div
                            className="card-title d-flex align-items-start justify-content-between">
                            <div className="avatar flex-shrink-0">
                                <img
                                    src="/admin/assets/img/icons/unicons/cc-primary.png"
                                    alt="Credit Card"
                                    className="rounded"
                                />
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
                                    <a className="dropdown-item" href="/">View More</a>
                                    <a className="dropdown-item" href="/">Delete</a>
                                </div>
                            </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Transactions</span>
                        <h3 className="card-title mb-2">$14,857</h3>
                        <small className="text-success fw-semibold">
                            <i className="bx bx-up-arrow-alt"></i> +28.14%
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatsCards;
