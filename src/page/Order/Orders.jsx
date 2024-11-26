import { useEffect, useState, useRef } from 'react';
import { Table, Tag} from 'antd';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';

const Orders = () => {
    const { userData, logout } = useUserContext();
    const { openErrorNotification } = useNotificationContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
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
                    // case 'ACCEPTED':
                    //     color = 'green';
                    //     break;
                    // case 'REJECTED':
                    //     color = 'red';
                    //     break;
                    default:
                        color = 'blue';
                }
                return <Tag color={color}>{status}</Tag>;
            }
        },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page: tableParams.pagination.current,
                page_size: tableParams.pagination.pageSize,
                ordering: tableParams.sorter.order === 'ascend' ? tableParams.sorter.field : `-${tableParams.sorter.field}`,
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

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
             <div className="card">
                 <h5 className="card-header">Order List</h5>
                 <div className="table-responsive text-nowrap" style={{ padding: '0 20px 20px' }}>
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
    );
};

export default Orders;
