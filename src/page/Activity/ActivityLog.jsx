import { useEffect, useState } from 'react';
import { Button, Input, Select, Table, Space } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import useNotificationContext from '../../hooks/useNotificationContext';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ActivityLog = () => {
    const navigate = useNavigate();
    const { openErrorNotification } = useNotificationContext();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        searchText: '',
        status: '',
        model: '',
    });

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
    });

    useEffect(() => {
        setLoading(true);
        const eventSource = new EventSource(`http://localhost:8000/api/activity/log-stream/`);

        eventSource.onmessage = (event) => {
            const newLog = JSON.parse(event.data);
            setLogs((prevLogs) => [newLog, ...prevLogs]);
            setLoading(false);
        };

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            openErrorNotification('Error', 'Failed to connect to the server');
            eventSource.close();
            setLoading(false);
        };

        return () => {
            eventSource.close();
        };
    }, [openErrorNotification]);

    // Optional: Limit the number of logs stored to prevent excessive memory usage
    const MAX_LOGS = 1000; // Adjust as needed

    useEffect(() => {
        if (logs.length > MAX_LOGS) {
            setLogs((prevLogs) => prevLogs.slice(0, MAX_LOGS));
        }
    }, [logs]);

    const columns = [
        {
            title: 'User',
            dataIndex: 'user',
            sorter: (a, b) => a.user.localeCompare(b.user),
            width: '10%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            width: '10%',
            filters: [
                { text: 'Success', value: 'success' },
                { text: 'Failed', value: 'failed' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <span style={{ color: status === 'success' ? 'green' : 'red' }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            sorter: (a, b) => a.action.localeCompare(b.action),
            width: '15%',
        },
        {
            title: 'Model',
            dataIndex: 'model',
            sorter: (a, b) => a.model.localeCompare(b.model),
            width: '10%',
        },
        {
            title: 'Context',
            dataIndex: 'context',
            sorter: (a, b) => a.context.localeCompare(b.context),
            width: '15%',
            ellipsis: true,
        },
        {
            title: 'Data',
            dataIndex: 'details',
            width: '20%',
            render: (value) => {
                const text = JSON.stringify(value);
                if (!text) return '';
                return text.length > 30 ? `${text.substring(0, 30)}...` : text;
            },
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
            width: '15%',
        },
    ];

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination({
            ...newPagination,
            // Maintain current page size options
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
        setPagination({
            ...pagination,
            current: 1,
        });
    };

    const handleResetFilters = () => {
        setSearchParams({
            searchText: '',
            status: '',
            model: '',
        });
        setPagination({
            ...pagination,
            current: 1,
        });
    };

    // Apply filters and search to the logs
    const filteredLogs = logs.filter((log) => {
        const { searchText, status, model } = searchParams;
        const matchesSearchText =
            searchText === '' ||
            log.user.toLowerCase().includes(searchText.toLowerCase()) ||
            log.action.toLowerCase().includes(searchText.toLowerCase()) ||
            log.model.toLowerCase().includes(searchText.toLowerCase()) ||
            log.context.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = status === '' || log.status === status;
        const matchesModel = model === '' || log.model.toLowerCase().includes(model.toLowerCase());

        return matchesSearchText && matchesStatus && matchesModel;
    });

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div
                    className="card-header"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <h4 className="card-title" style={{ color: '#696cff' }}>
                        Activity Logs
                    </h4>
                </div>
                <div className="card-body">
                    <Space direction="horizontal" size="middle" style={{ marginBottom: 16 }}>
                        <Select
                            id="status"
                            name="status"
                            value={searchParams.status || undefined}
                            onChange={(value) => handleFilterChange(value, 'status')}
                            placeholder="Filter by status"
                            style={{ width: 200 }}
                            allowClear
                        >
                            <Option value="success">Success</Option>
                            <Option value="failed">Failed</Option>
                        </Select>
                        <Input
                            id="model"
                            name="model"
                            value={searchParams.model}
                            onChange={handleInputChange}
                            placeholder="Filter by model"
                            style={{ width: 200 }}
                        />
                        <Input
                            id="searchText"
                            name="searchText"
                            value={searchParams.searchText}
                            onChange={handleInputChange}
                            placeholder="Search..."
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                        <Button
                            type="default"
                            onClick={handleResetFilters}
                            icon={<ReloadOutlined />}
                            style={{ marginRight: '10px' }}
                        >
                            Reset Filters
                        </Button>
                        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                            Perform Search
                        </Button>
                    </Space>
                </div>
                <div className="table-responsive text-nowrap" style={{ padding: '0 20px 20px' }}>
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
                        dataSource={filteredLogs}
                        pagination={pagination}
                        loading={loading}
                        onChange={handleTableChange}
                        rowClassName={(record) => {
                            switch (record.status) {
                                case 'success':
                                    return 'status-success';
                                case 'failed':
                                    return 'status-error';
                                default:
                                    return '';
                            }
                        }}
                        scroll={{ y: 500 }} // Optional: Set a fixed height with scroll
                    />
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
