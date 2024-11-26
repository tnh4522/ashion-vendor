import { useEffect, useState } from 'react';
import { Table, Modal, Input, Button, Select } from 'antd';
import qs from 'qs';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";

const { confirm } = Modal;
const { Option } = Select;

const Addresses = ({ userId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        searchText: '',
        addressType: '',
    });

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });

    const { userData } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();

    const fetchData = () => {
        setLoading(true);
        let url = 'address/';
        if (userId) {
            url = `address/user/${userId}/`;
        }

        const params = {
            page: tableParams.pagination.current,
            page_size: tableParams.pagination.pageSize,
            search: searchParams.searchText,
            address_type: searchParams.addressType,
        };

        API.get(url + '?' + qs.stringify(params), {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                setData(response.data.results);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: response.data.count,
                    },
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                openErrorNotification('Error fetching addresses');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams), userId]);

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
        <div className={!userId ? "container-xxl flex-grow-1 container-p-y" : ""}>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Addresses</h5>
                    <Button 
                        type="primary"
                        onClick={() => navigate('/create-address')}
                    >
                        Add New Address
                    </Button>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <Input
                                placeholder="Search addresses..."
                                value={searchParams.searchText}
                                onChange={(e) => setSearchParams({
                                    ...searchParams,
                                    searchText: e.target.value
                                })}
                            />
                        </div>
                        <div className="col-md-4">
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select address type"
                                value={searchParams.addressType}
                                onChange={(value) => setSearchParams({
                                    ...searchParams,
                                    addressType: value
                                })}
                            >
                                <Option value="">All</Option>
                                <Option value="SHIPPING">Shipping</Option>
                                <Option value="BILLING">Billing</Option>
                            </Select>
                        </div>
                        <div className="col-md-4">
                            <Button onClick={fetchData} type="primary">
                                Search
                            </Button>
                        </div>
                    </div>

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