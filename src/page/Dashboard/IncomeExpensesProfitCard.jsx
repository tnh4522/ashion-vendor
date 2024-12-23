import { Tabs } from 'antd';

import IncomeChart from './chart/IncomeChart';
import ExpensesChart from './chart/ExpensesChart';
import ProfitChart from './chart/ProfitChart';

const { TabPane } = Tabs;

function IncomeExpensesProfitCard() {
    return (
        <div className="col-md-6 col-lg-4 order-1 mb-4">
            <div className="card h-100">
                <div className="card-header">
                    <Tabs type="card" defaultActiveKey="income">
                        <TabPane tab="Income" key="income">
                            <div className="card-body px-0">
                                <div className="p-4">
                                    <h6>Income Overview</h6>
                                    <p className="text-muted mb-2">
                                        Nội dung hiển thị cho tab Income (placeholder).
                                    </p>
                                    <div id="incomeChart">
                                        <IncomeChart />
                                    </div>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab="Expenses" key="expenses">
                            <div className="card-body px-0">
                                <div className="p-4">
                                    <h6>Expenses Overview</h6>
                                    <p className="text-muted mb-2">
                                        Nội dung hiển thị cho tab Expenses (placeholder).
                                    </p>
                                    <div id="expensesChart">
                                        <ExpensesChart />
                                    </div>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab="Profit" key="profit">
                            <div className="card-body px-0">
                                <div className="p-4">
                                    <h6>Profit Overview</h6>
                                    <p className="text-muted mb-2">
                                        Nội dung hiển thị cho tab Profit (placeholder).
                                    </p>
                                    <div id="profitChart">
                                        <ProfitChart />
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default IncomeExpensesProfitCard;
