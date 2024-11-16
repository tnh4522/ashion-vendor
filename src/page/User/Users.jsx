import {useEffect, useState} from 'react';
import {Table, Modal, Input, Button, Select} from 'antd';
import {ExclamationCircleFilled} from "@ant-design/icons";
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import {Link, useNavigate} from "react-router-dom";

const {confirm} = Modal;
const {Option} = Select;

const Users = () => {
    const navigate = useNavigate();

    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();

    const [data, setData] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        searchText: '',
        role: '',
    });
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
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

            if (searchParams.role) {
                params.role = searchParams.role;
            }

            const response = await API.get('users/', {
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
            console.error('Error fetching users:', error);
            openErrorNotification('Error fetching users.');
            if (error.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await API.get('roles/', {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                }
            });

            setRoleOptions(response.data.results);

        } catch (error) {
            console.error('Error fetching roles:', error);
            openErrorNotification('Error fetching roles.');
            if (error.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
        }
    }

    useEffect(() => {
        if (userData.access) {
            fetchRoles();
            fetchData();
        }
    }, [userData.access]);

    const handleDelete = (id) => {
        confirm({
            title: 'Do you want to delete these users?',
            icon: <ExclamationCircleFilled/>,
            content: 'Confirm to delete these users, this action cannot be undone.',
            okText: 'Confirm',
            okType: 'danger',
            onOk() {
                return API.delete(`user/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    }
                })
                    .then(() => {
                        openSuccessNotification('User deleted successfully.');
                        fetchData();
                    })
                    .catch((error) => {
                        console.error('Error deleting user:', error);
                        openErrorNotification('Error deleting user.');
                    });
            },
            onCancel() {
            },
        });
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            sorter: true,
            width: '20%',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            sorter: true,
            width: '15%',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            sorter: true,
            width: '15%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            width: '25%',
        },
        {
            title: 'Role',
            dataIndex: 'role_display',
            width: '15%',
        },
        {
            title: 'Action',
            dataIndex: 'id',
            width: '10%',
            render: (id) => (
                <span>
                    <Link to={`/user-detail/${id}`}><i className="fa-solid fa-pen-to-square"
                                                       style={{marginRight: '10px'}}></i></Link>
                    <i className="fa-solid fa-trash" style={{cursor: 'pointer'}}
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

    const handleRoleChange = (value) => {
        setSearchParams((prev) => ({
            ...prev,
            role: value,
        }));
    };

    const handleSearch = () => {
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: 1, // Reset to first page when searching
            },
        });
        fetchData();
    };

    const handleResetFilters = () => {
        setSearchParams({
            searchText: '',
            role: '',
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

    const renderRoleOptions = () => {
        if(roleOptions.length === 0) {
            return null;
        }

        return roleOptions.map((role) => (
            <Option key={role.id} value={role.id}>{role.name}</Option>
        ));
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header"
                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h4 className="card-title" style={{ color: '#696cff' }}>Users Management</h4>
                    <button className="btn btn-primary" onClick={() => navigate('/add-user')}>
                        Create User
                    </button>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        {/* Search Text */}
                        <div className="col-md-4">
                            <label htmlFor="searchText" className="form-label">Search by Name or Email</label>
                            <Input
                                id="searchText"
                                name="searchText"
                                value={searchParams.searchText}
                                onChange={handleInputChange}
                                placeholder="Search by name or email"
                            />
                        </div>
                        {/* Role */}
                        <div className="col-md-4">
                            <label htmlFor="role" className="form-label">Role</label>
                            <Select
                                id="role"
                                name="role"
                                value={searchParams.role}
                                onChange={handleRoleChange}
                                style={{width: '100%'}}
                            >
                                <Option value="">All Roles</Option>
                                {renderRoleOptions()}
                            </Select>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="row mb-4">
                        <div className="col-md-6 d-flex">
                            <Button type="default" onClick={handleResetFilters} style={{marginRight: '10px'}}>Reset
                                Filters</Button>
                            <Button type="primary" onClick={handleSearch}>Perform Search</Button>
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

export default Users;