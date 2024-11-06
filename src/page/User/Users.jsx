import {useEffect, useState} from 'react';
import {Table} from 'antd';
import API from '../../service/service';
import useUserContext from '../../hooks/useUserContext';
import useNotificationContext from '../../hooks/useNotificationContext';
import {Link, useNavigate} from "react-router-dom";
import {Modal} from 'antd';
import {ExclamationCircleFilled} from "@ant-design/icons";

const Users = () => {
    const {confirm} = Modal;
    const navigator = useNavigate();

    const handleDelete = (id) => {
        const response = API.delete(`user/${id}/`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            }
        });

        fetchData();
        openSuccessNotification('User deleted successfully.');
        return true;
    }

    const showPromiseConfirm = (id) => {
        confirm({
            title: 'Do you want to delete these users?',
            icon: <ExclamationCircleFilled/>,
            content: 'Confirm to delete these users, this action cannot be undone.',
            okText: 'Confirm',
            okType: 'danger',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        handleDelete(id) ? resolve() : reject();
                    }, 1000);
                }).catch(() =>
                    openErrorNotification('Error deleting user.')
                );
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
            dataIndex: 'role',
            filters: [
                {text: 'Admin', value: 'ADMIN'},
                {text: 'Manager', value: 'MANAGER'},
                {text: 'Staff', value: 'STAFF'},
                {text: 'Seller', value: 'SELLER'},
                {text: 'Buyer', value: 'BUYER'},
            ],
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
                       onClick={() => showPromiseConfirm(id)}></i>
            </span>
            ),
        }
    ];

    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();

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

            if (tableParams.filters) {
                Object.keys(tableParams.filters).forEach((key) => {
                    if (tableParams.filters[key]) {
                        params[key] = tableParams.filters[key];
                    }
                });
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
            ;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData.access) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(tableParams), userData.access]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sorter,
        });
    };


    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header"
                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h5 className="card-title">Users Management</h5>
                    <button className="btn btn-primary" onClick={() => navigator('/add-user')}>
                        Create User
                    </button>
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
