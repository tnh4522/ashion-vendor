import {useEffect, useState} from 'react';
import {Table} from 'antd';
import qs from 'qs';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import {useNavigate} from "react-router-dom";

const RoleManagement = () => {
    const navigator = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        filters: {},
        sortOrder: null,
        sortField: null,
    });

    const {userData} = useUserContext();

    const fetchData = () => {
        setLoading(true);
        const params = qs.stringify(getRoleParams(tableParams));
        API.get(`roles/?${params}`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                const {results, count} = response.data;
                setData(results);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: count,
                    },
                });
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error fetching roles:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            sorter: true,
            width: '40%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '40%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (text, record) => (
                <span>
                    <i
                        className="fa-solid fa-pen-to-square"
                        style={{marginRight: '10px', cursor: 'pointer'}}
                        onClick={() => handleEdit(record)}
                    ></i>
                    <i
                        className="fa-solid fa-trash"
                        style={{cursor: 'pointer'}}
                        onClick={() => handleDelete(record)}
                    ></i>
                </span>
            ),
        },
    ];

    const getRoleParams = (params) => ({
        page_size: params.pagination?.pageSize,
        page: params.pagination?.current,
        ordering: params.sortField ? `${params.sortOrder === 'descend' ? '-' : ''}${params.sortField}` : undefined,
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: sorter.order,
            sortField: sorter.field,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const handleEdit = (role) => {
        console.log('Edit role:', role);
    };

    const handleDelete = (role) => {
        console.log('Delete role:', role);
        API.delete(`roles/${role.id}/`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error('Error deleting role:', error);
            });
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header"
                     style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h5 className="card-title">Role Management</h5>
                    <button className="btn btn-primary" onClick={() => navigator('/create-role')}>
                        Create Role
                    </button>
                </div>
                <div className="table-responsive text-nowrap" style={{padding: '20px'}}>
                    <Table
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
            <hr className="my-5"/>
        </div>
    );
};

export default RoleManagement;
