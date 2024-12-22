import {useEffect, useState} from 'react';
import {Table, Modal, Input, Button} from 'antd';
import {ExclamationCircleFilled} from "@ant-design/icons";
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import {Link, useNavigate} from "react-router-dom";

const {confirm} = Modal;

const Customers = () => {
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

            if (tableParams.sorter.field) {
                params.ordering = tableParams.sorter.order === 'ascend' ? tableParams.sorter.field : `-${tableParams.sorter.field}`;
            }

            if (searchParams.searchText) {
                params.search = searchParams.searchText;
            }

            const response = await API.get('customer/list', {
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
    }, [userData.access, JSON.stringify(tableParams)]); // Track changes in tableParams

    const handleDelete = (id) => {
        confirm({
            title: 'Do you want to delete this customer?',
            icon: <ExclamationCircleFilled/>,
            content: 'Confirm to delete this customer, this action cannot be undone.',
            okText: 'Confirm',
            okType: 'danger',
            onOk() {
                return API.delete(`customer/detail/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    }
                })
                    .then(() => {
                        openSuccessNotification('Customer deleted successfully.');
                        fetchData();
                    })
                    .catch((error) => {
                        console.error('Error deleting customer:', error);
                    });
            },
            onCancel() {
            },
        });
    };

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
            dataIndex: 'id',
            width: '10%',
            render: (id) => (
                <span>
                    <Link to={`/customer/${id}`}><i className="fa-solid fa-pen-to-square"
                                                           style={{marginRight: '10px'}}></i></Link>
                    <i className="fa-solid fa-trash" style={{cursor: 'pointer', color: 'red'}}
                       onClick={() => handleDelete(id)}></i>
                </span>
            ),
        }
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
                <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h4 className="card-title" style={{color: '#696cff'}}>Customers Management</h4>
                    <button className="btn btn-primary" onClick={() => navigate('/add-customer')}>
                        Create Customer
                    </button>
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
                                placeholder="Search by first name, last name or email"
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
                        style={{border: '1px solid #ebedf2'}}
                    />
                </div>
            </div>
        </div>
    );
};

export default Customers;
