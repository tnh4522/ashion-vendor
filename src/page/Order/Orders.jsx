import { useEffect, useState } from 'react';
import { Table, Modal, Input } from 'antd';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import { ExclamationCircleFilled } from "@ant-design/icons";

const { TextArea } = Input;

const Orders = () => {
    const { confirm } = Modal;
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        filters: {},
        sorter: {},
    });

    const columns = [
        {
            title: 'Order Code',
            dataIndex: 'order_code',
            sorter: true,
            width: '15%',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customer',
            sorter: true,
            render: (customer) => `${customer.first_name} ${customer.last_name}`,
            width: '20%',
        },
        {
            title: 'Contact',
            dataIndex: 'customer',
            render: (customer) => (
                <>
                    <div>{customer.email}</div>
                    <div>{customer.phone_number}</div>
                </>
            ),
            width: '20%',
        },
        {
            title: 'Order Date',
            dataIndex: 'created_at',
            sorter: true,
            render: (date) => new Date(date).toLocaleDateString(),
            width: '15%',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            sorter: true,
            render: (amount) => `$${amount.toFixed(2)}`,
            width: '15%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Unprocessed', value: 'UNPROCESSED' },
                { text: 'Accepted', value: 'ACCEPTED' },
                { text: 'Rejected', value: 'REJECTED' },
            ],
            render: (status) => (
                <span className={`badge ${getStatusBadgeClass(status)}`}>
                    {status}
                </span>
            ),
            width: '15%',
        },
        {
            title: 'Action',
            width: '15%',
            render: (_, record) => (
                <div className="dropdown">
                    <button
                        type="button"
                        className="btn p-0 dropdown-toggle hide-arrow"
                        data-bs-toggle="dropdown"
                    >
                        <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu">
                        {record.status === 'UNPROCESSED' && (
                            <>
                                <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                    onClick={() => showAcceptConfirm(record.id)}
                                >
                                    <i className="bx bx-check me-1"></i> Accept
                                </a>
                                <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                    onClick={() => showRejectConfirm(record.id)}
                                >
                                    <i className="bx bx-x me-1"></i> Reject
                                </a>
                            </>
                        )}
                        <a
                            className="dropdown-item"
                            href={`/order-detail/${record.id}`}
                        >
                            <i className="bx bx-detail me-1"></i> View Details
                        </a>
                    </div>
                </div>
            ),
        },
    ];

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return 'bg-success';
            case 'REJECTED':
                return 'bg-danger';
            default:
                return 'bg-warning';
        }
    };

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

            if (tableParams.filters) {
                Object.keys(tableParams.filters).forEach((key) => {
                    if (tableParams.filters[key]) {
                        params[key] = tableParams.filters[key];
                    }
                });
            }

            const response = await API.get('orders/', {
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
            console.error('Error fetching orders:', error);
            if (error.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            openErrorNotification('Error fetching orders.');
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sorter,
        });
    };

    const updateOrderStatus = async (orderId, status, rejectionReason = null) => {
        try {
            const response = await API.patch(`orders/${orderId}/`, {
                status,
                rejection_reason: rejectionReason,
            }, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });

            if (response.status === 200) {
                openSuccessNotification(`Order ${status.toLowerCase()} successfully`);
                fetchData();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            openErrorNotification(`Failed to ${status.toLowerCase()} order`);
        }
    };

    const showAcceptConfirm = (orderId) => {
        confirm({
            title: 'Are you sure you want to accept this order?',
            icon: <ExclamationCircleFilled />,
            content: 'This will update the order status to Accepted',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                return updateOrderStatus(orderId, 'ACCEPTED');
            },
        });
    };

    const showRejectConfirm = (orderId) => {
        let rejectionReason = '';
        Modal.confirm({
            title: 'Reject Order',
            icon: <ExclamationCircleFilled />,
            content: (
                <div>
                    <p>Please provide a reason for rejection:</p>
                    <TextArea
                        rows={4}
                        onChange={(e) => rejectionReason = e.target.value}
                    />
                </div>
            ),
            okText: 'Reject',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                return updateOrderStatus(orderId, 'REJECTED', rejectionReason);
            },
        });
    };

    useEffect(() => {
        if (userData.access) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(tableParams), userData.access]);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <h5 className="card-header">Order List</h5>
                <div className="table-responsive text-nowrap" style={{ padding: '0 20px 20px' }}>
                    <Table
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                        style={{ border: '1px solid #ebedf2' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Orders;
