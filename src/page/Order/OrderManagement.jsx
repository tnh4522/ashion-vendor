import { useEffect, useState, useRef } from 'react';
import { Table, Tag, Input, Button, Modal, message } from 'antd';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import { Link,  useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { orderStatus } from '../../utils/Constant';
import formatCurrency from "../../constant/formatCurrency.js";

const Orders = () => {
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
    const [tableParams, setTableParams] = useState({
        pagination: { current: 1, pageSize: 10 },
        filters: {},
        sorter: {},
    });
    const navigate = useNavigate();

    const prevTableParams = useRef();

    const columns = [
        {
            title: 'Order ID',
            sorter: true,
            render: (order) => (
                    <strong style={{ color: '#1890ff' }}>{order.order_number}</strong>
            )
        },
        { 
            title: 'Customer', 
            dataIndex: 'customer_name',
            sorter: true 
        },
        { 
            title: 'Total Price', 
            dataIndex: 'total_price', 
            sorter: true,
            render: (price) => (
                <strong style={{ color: '#52c41a' }}>
                    {formatCurrency(price)}
                </strong>
            ),
        },
        {
            title: 'Payment Status',
            dataIndex: 'payment_status',
            sorter: true,
            render: (payment_status) => {
                let color = '';
                switch(payment_status) {
                    case 'UNPAID':
                        color = 'gray';
                        break;
                    case 'PAID':
                        color = 'green';
                        break;
                    case 'REFUNDED':
                        color = 'blue';
                        break;
                    default:
                        color = 'N/A';
                }
                return <Tag color={color}>{payment_status}</Tag>;
            }
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            sorter: true,
            render: (payment_method) => {
                let label;
                switch(payment_method) {
                    case 'COD':
                        label = 'COD';
                        break;
                    case 'BANK_TRANSFER':
                        label = 'Bank Transfer';
                        break;
                    case 'CREDIT_CARD':
                        label = 'Credit Card';
                        break;
                    case 'PAYPAL':
                        label = 'PayPal';
                        break;
                    default:
                        label = 'N/A';
                }
                return <span>{label}</span>;
            }
        },
        { 
            title: 'Status',
            dataIndex: 'status', 
            filters: Object.values(orderStatus).map(status => ({ text: status, value: status })), 
            render: (status) => {
                let color = '';
                switch (status) {
                    case orderStatus.PENDING:
                        color = 'orange';
                        break;
                    case orderStatus.PROCESSING:    
                        color = 'blue';
                        break;
                    case orderStatus.CANCELED:
                        color = 'red';
                        break;
                    case orderStatus.SHIPPED:
                        color = 'green';
                        break;
                    case orderStatus.RETURNED:
                        color = 'violet';
                        break;
                    case orderStatus.DELIVERED:
                        color = 'blue';    
                        break;
                    default:
                        color = 'blue';
                }
                return <Tag color={color}>{status}</Tag>;
            }
        },
        { 
            title: 'Order Date', 
            dataIndex: 'created_at', 
            sorter: true, 
            render: date => new Date(date).toLocaleDateString() 
        },
        {
            title: 'Action',
            dataIndex: 'id',
            render: (id, record) => (
                <span>
                    {record.status === orderStatus.PENDING && (
                        <i className="fa-solid fa-trash" style={{ color: 'red', cursor: 'pointer' }} onClick={(event) =>{
                                event.stopPropagation(); 
                                handleDelete(id);
                            }}
                         ></i>
                    )}
                </span>
            ),
        },
    ];

    const fetchCustomerData = async (customerId) => {
        try {
            const response = await API.get(`customer/detail/${customerId}/`, {
                headers: { 'Authorization': `Bearer ${userData.access}` },
            });
            return `${response.data.first_name} ${response.data.last_name}`; 
        } catch (error) {
            console.error('Error fetching customer details:', error);
            return 'N/A'; 
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page: tableParams.pagination.current,
                page_size: tableParams.pagination.pageSize,
                ordering: tableParams.sorter.order === 'ascend' ? tableParams.sorter.field : `-${tableParams.sorter.field}`,
                search: searchText,
            };
            const response = await API.get('orders/list/', {
                headers: { 'Authorization': `Bearer ${userData.access}` },
                params,
            });
    
            const ordersWithCustomers = await Promise.all(response.data.results.map(async order => ({
                ...order,
                customer_name: await fetchCustomerData(order.customer),
                total_price: parseFloat(order.total_price),
            })));
    
            setData(ordersWithCustomers);
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

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    // const handleDeleteSelected = () => {
    //     Modal.confirm({
    //         title: 'Do you want to delete the selected orders?',
    //         icon: <ExclamationCircleFilled />,
    //         content: 'Confirm to delete these orders, this action cannot be undone.',
    //         okText: 'Confirm',
    //         okType: 'danger',
    //         onOk() {
    //             return API.delete('orders/list/', {
    //                 headers: {
    //                     'Authorization': `Bearer ${userData.access}`,
    //                 },
    //                 data: { ids: selectedRowKeys }
    //             })
    //                 .then(() => {
    //                     openSuccessNotification('Selected orders deleted successfully.');
    //                     fetchData();
    //                     setSelectedRowKeys([]);
    //                 })
    //                 .catch((error) => {
    //                     console.error('Error deleting orders:', error);
    //                     openErrorNotification('Error deleting orders.');
    //                 });
    //         },
    //         onCancel() {},
    //     });
    // };

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
                return API.delete(`orders/detail/${id}/`, {
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
                            {/* <Button className='m-2 btn-secondary' onClick={handleDeleteSelected} disabled={selectedRowKeys.length === 0}>Delete</Button> */}
                        </div>
                    </div>
                    <div className="table-responsive text-nowrap">
                        <Table
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={tableParams.pagination}
                            loading={loading}
                            onChange={handleTableChange}
                            onRow={(record) => ({
                                onClick: () => 
                                navigate(`/order-detail/${record.id}`),
                                style: { cursor: 'pointer' }
                            })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
