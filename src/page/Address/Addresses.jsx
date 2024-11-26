import { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'antd';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";

const { confirm } = Modal;

const Addresses = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { userId } = useParams(); // Get userId from URL parameter

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });

    const { userData } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await API.get(`address/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
                params: {
                    page: tableParams.pagination.current,
                    page_size: tableParams.pagination.pageSize,
                }
            });
            
            setData(response.data.results);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: response.data.count,
                }
            });
        } catch (error) {
            console.error('Error fetching addresses:', error);
            openErrorNotification('Error fetching addresses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId, tableParams.pagination.current, tableParams.pagination.pageSize]);

    const handleDelete = (id) => {
        confirm({
            title: 'Delete Address',
            content: 'Are you sure you want to delete this address?',
            onOk() {
                API.delete(`address/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                })
                    .then(() => {
                        openSuccessNotification('Address deleted successfully');
                        fetchData();
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        openErrorNotification('Error deleting address');
                    });
            },
        });
    };

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            sorter: true,
        },
        {
            title: 'Address',
            render: (_, record) => (
                `${record.street_address}, ${record.city}, ${record.province}`
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone_number',
        },
        {
            title: 'Type',
            dataIndex: 'address_type',
            render: (type) => type === 'SHIPPING' ? 'Shipping' : 'Billing',
        },
        {
            title: 'Default',
            dataIndex: 'default',
            render: (isDefault) => isDefault ? 'Yes' : 'No',
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <span>
                    <Link to={`/edit-address/${record.id}`}>
                        <i className="fa-solid fa-pen-to-square me-2"></i>
                    </Link>
                    <i 
                        className="fa-solid fa-trash text-danger" 
                        onClick={() => handleDelete(record.id)}
                        style={{ cursor: 'pointer' }}
                    ></i>
                </span>
            ),
        },
    ];

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">User Addresses</h5>
                    <Button 
                        type="primary"
                        onClick={() => navigate('/create-address')}
                    >
                        Create New Address
                    </Button>
                </div>
                <div className="card-body">
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={(pagination) => setTableParams({ pagination })}
                    />
                </div>
            </div>
        </div>
    );
};

export default Addresses;