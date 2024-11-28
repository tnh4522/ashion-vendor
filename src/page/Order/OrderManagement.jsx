import { useEffect, useState, useRef } from 'react';
import { Table, Tag, Input, Button, Modal } from 'antd';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import { Link } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';

const Orders = () => {
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [tableParams, setTableParams] = useState({
        pagination: { current: 1, pageSize: 10 },
        filters: {},
        sorter: {},
    });

    const prevTableParams = useRef();

    const columns = [
        { title: 'Order ID', dataIndex: 'order_number', sorter: true },
        { 
            title: 'Customer', 
            dataIndex: 'customer', 
            render: (customer) => customer?.first_name || 'N/A', 
            sorter: true 
        },
        { 
            title: 'Order Date', 
            dataIndex: 'created_at', 
            sorter: true, 
            render: date => new Date(date).toLocaleDateString() 
        },
        { 
            title: 'Total Price', 
            dataIndex: 'total_price', 
            sorter: true, 
            render: (price) => {
                const numericPrice = parseFloat(price);
                return isNaN(numericPrice) ? 'N/A' : numericPrice.toFixed(2);
            }
        },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            filters: [
                { text: 'Pending', value: 'PENDING' }, 
                { text: 'Processing', value: 'PROCESSING' }, 
                { text: 'Shipped', value: 'SHIPPED' },
                { text: 'Delivered', value: 'DELIVERED' }, 
                { text: 'Canceled', value: 'CANCELED' }, 
                { text: 'Returned', value: 'RETURNED' }
            ],
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'PENDING':
                        color = 'orange';
                        break;
                    case 'PROCESSING':
                        color = 'yellow';
                        break;
                    case 'CANCELED':
                        color = 'red';
                        break;
                    case 'SHIPPED':
                        color = 'green';
                        break;
                    default:
                        color = 'blue';
                }
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Action',
            dataIndex: 'id',
            render: (id) => (
                <span>
                    <Link to={`/order-detail/${id}`} style={{ marginRight: '10px' }}>
                        <i className="fa-solid fa-edit" style={{ color: 'blue' }}></i>
                    </Link>
                    <i className="fa-solid fa-trash" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(id)}></i>
                </span>
            ),
        },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page: tableParams.pagination.current,
                page_size: tableParams.pagination.pageSize,
                ordering: tableParams.sorter.order === 'ascend' ? tableParams.sorter.field : `-${tableParams.sorter.field}`,
                search: searchText,
            };
            const response = await API.get('orders/', {
                headers: { 'Authorization': `Bearer ${userData.access}` },
                params,
            });

            const processedData = response.data.results.map(order => ({
                ...order,
                total_price: parseFloat(order.total_price),
            }));

            setData(processedData);
            setTableParams({
                ...tableParams,
                pagination: { ...tableParams.pagination, total: response.data.count },
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            openErrorNotification('Error fetching orders.');
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            JSON.stringify(prevTableParams.current) !== JSON.stringify(tableParams)
        ) {
            prevTableParams.current = tableParams;
            fetchData();
        }
    }, [tableParams, userData.access]);

    const handleTableChange = (pagination, filters, sorter) => {
        const newTableParams = { pagination, filters, sorter };
        if (JSON.stringify(tableParams) !== JSON.stringify(newTableParams)) {
            setTableParams(newTableParams);
        }
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Do you want to delete this order?',
            icon: <ExclamationCircleFilled />,
            content: 'Confirm to delete this order, this action cannot be undone.',
            okText: 'Confirm',
            okType: 'danger',
            onOk() {
                return API.delete(`orders/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    }
                })
                    .then(() => {
                        openSuccessNotification('Order deleted successfully.');
                        fetchData();
                    })
                    .catch((error) => {
                        console.error('Error deleting order:', error);
                        openErrorNotification('Error deleting order.');
                    });
            },
            onCancel() {},
        });
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="card-title" style={{ color: '#696cff' }}>Orders Management</h4>
                    <Link to="/add-order" className="btn btn-primary">Create Order</Link>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Input
                                placeholder="Search by Order ID or Customer Name"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 text-start">
                            <Button type="primary" onClick={handleSearch}>Search</Button>
                        </div>
                    </div>
                    <div className="table-responsive text-nowrap">
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={tableParams.pagination}
                            loading={loading}
                            onChange={handleTableChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
