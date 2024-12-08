import {useEffect, useState} from 'react';
import {Table, Input, Button} from 'antd';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import {useNavigate} from "react-router-dom";

const ActivityLog = () => {
    const navigate = useNavigate();

    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        searchText: '',
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
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

            // Sort logic
            if (tableParams.sorter.field) {
                params.ordering = tableParams.sorter.order === 'ascend'
                    ? tableParams.sorter.field
                    : `-${tableParams.sorter.field}`;
            }

            // Search logic (giả sử API hỗ trợ tìm kiếm theo action hoặc user.username)
            if (searchParams.searchText) {
                params.search = searchParams.searchText;
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
            render: (text) => JSON.stringify(text),
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
                    <Button type="primary" onClick={() => navigate('/')}>
                        Back to Dashboard
                    </Button>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        {/* Search Input */}
                        <div className="col-md-6">
                            <Input
                                id="searchText"
                                name="searchText"
                                value={searchParams.searchText}
                                onChange={handleInputChange}
                                placeholder="Search by user or action"
                            />
                        </div>
                        <div className="col-md-6">
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
