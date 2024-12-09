import {useEffect, useState} from 'react';
import {Button, Input, Select, Table} from 'antd';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import {useNavigate} from "react-router-dom";

const {Option} = Select;

const ActivityLog = () => {
    const navigate = useNavigate();
    const {userData, logout} = useUserContext();
    const {openErrorNotification} = useNotificationContext();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        searchText: '',
        status: '',
        model: '',
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        filters: {},
        sorter: {},
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page: tableParams.pagination.current,
                page_size: tableParams.pagination.pageSize,
            };

            if (tableParams.sorter.field) {
                params.ordering = tableParams.sorter.order === 'ascend'
                    ? tableParams.sorter.field
                    : `-${tableParams.sorter.field}`;
            }

            if (searchParams.searchText) {
                params.search = searchParams.searchText;
            }
            if (searchParams.status) {
                params.status = searchParams.status;
            }
            if (searchParams.model) {
                params.model = searchParams.model;
            }

            const response = await API.get('activity/list/', {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
                params,
            });

            setData(response.data.results);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: response.data.count,
                },
            });
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            openErrorNotification('Error fetching activity logs.');
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData.access) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData.access, JSON.stringify(tableParams)]);

    const columns = [
        {
            title: 'User',
            dataIndex: ['user', 'username'],
            sorter: true,
            width: '10%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            width: '10%',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            sorter: true,
            width: '10%',
        },
        {
            title: 'Model',
            dataIndex: 'model',
            sorter: true,
            width: '15%',
        },
        {
            title: 'Context',
            dataIndex: 'context',
            sorter: false,
            width: '25%',
        },
        {
            title: 'Data',
            dataIndex: 'data',
            width: '15%',
            render: (value) => {
                const text = JSON.stringify(value);
                if (!text) return '';
                return text.length > 20 ? text.substring(0, 20) + '...' : text;
            },
        },
        {
            title: 'Time',
            dataIndex: 'created_at',
            sorter: true,
            width: '15%',
            render: (text) => new Date(text).toLocaleString(),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sorter,
        });
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilterChange = (value, name) => {
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: 1,
            },
        });
        fetchData();
    };

    const handleResetFilters = () => {
        setSearchParams({
            searchText: '',
            status: '',
            model: '',
        });
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: 1,
            },
        });
        fetchData();
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header"
                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h4 className="card-title" style={{color: '#696cff'}}>Activity Logs</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <Select
                                id="status"
                                name="status"
                                value={searchParams.status}
                                onChange={(value) => handleFilterChange(value, 'status')}
                                placeholder="Filter by status"
                                style={{width: '100%'}}
                                allowClear
                            >
                                <Option value="">Select Status</Option>
                                <Option value="200">200 - Success</Option>
                                <Option value="201">201 - Created</Option>
                                <Option value="400">400 - Bad Request</Option>
                                <Option value="401">401 - Unauthorized</Option>
                                <Option value="403">403 - Forbidden</Option>
                                <Option value="404">404 - Not Found</Option>
                                <Option value="500">500 - Internal Server Error</Option>
                            </Select>
                        </div>
                        <div className="col-md-4">
                            <Input
                                id="model"
                                name="model"
                                value={searchParams.model}
                                onChange={handleInputChange}
                                placeholder="Filter by model"
                            />
                        </div>
                        <div className="col-md-4">
                            <Button
                                type="default"
                                onClick={handleResetFilters}
                                style={{marginRight: '10px'}}
                            >
                                Reset Filters
                            </Button>
                            <Button type="primary" onClick={handleSearch}>
                                Perform Search
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="table-responsive text-nowrap" style={{padding: '0 20px 20px'}}>
                    <Table
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    navigate(`/activity/${record.id}`);
                                },
                            };
                        }}
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                        rowClassName={(record) => {
                            switch (record.status) {
                                case '201':
                                    return 'status-success';
                                case '200':
                                    return 'status-success';
                                case '400':
                                    return 'status-error';
                                case '401':
                                    return 'status-warning';
                                case '403':
                                    return 'status-warning';
                                case '404':
                                    return 'status-warning';
                                case '500':
                                    return 'status-error';
                                default:
                                    return '';
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
