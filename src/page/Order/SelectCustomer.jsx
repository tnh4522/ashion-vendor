import { useEffect, useState } from 'react';
import {Table, Button} from 'antd';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';


// eslint-disable-next-line react/prop-types
const Customers = ({ searchTerm, onCustomerSelect }) => {
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
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

            if (tableParams.sorter.field) {
                params.ordering = tableParams.sorter.order === 'ascend' ? tableParams.sorter.field : `-${tableParams.sorter.field}`;
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await API.get('customers/', {
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
            console.error('Error fetching customers:', error);
            openErrorNotification('Error fetching customers.');
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData.access) {
            fetchData();
        }
    }, [userData.access, searchTerm, JSON.stringify(tableParams)]);


    const columns = [
        {
            title: 'First Name',
            dataIndex: 'first_name',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            sorter: false,
            width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (record) => (
                <span>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => onCustomerSelect(record)}
                    >
                        Select
                    </Button>
                </span>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sorter,
        });
    };

    return (
        <div className="table-responsive text-nowrap" style={{padding: '20px'}}>
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
    );
};

export default Customers;
