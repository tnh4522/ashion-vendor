import { useEffect, useState } from 'react';
import { Table } from 'antd';
import qs from 'qs';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import { useNavigate } from "react-router-dom";

const PermissionsManagement = () => {
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

    const { userData } = useUserContext();

    const fetchData = () => {
        setLoading(true);
        const params = qs.stringify(getPermissionParams(tableParams));
        API.get(`permissions/?${params}`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                const { results, count } = response.data;
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
                console.error('Error fetching permissions:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const columns = [
        {
            id: 'id',
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            width: '10%',
        },
        {
            title: 'Model Name',
            dataIndex: 'model_name',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: true,
            width: '40%',
        },
        {
            title: 'Operations',
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <span>
                    <i
                        className="fa-solid fa-pen-to-square"
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                        onClick={() => handleEdit(record)}
                    ></i>
                    <i
                        className="fa-solid fa-trash"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(record)}
                    ></i>
                </span>
            ),
        },
    ];

    const getPermissionParams = (params) => ({
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

    const handleEdit = (permission) => {
        console.log('Edit permission:', permission);
        // Implement edit functionality as needed
        navigator(`/edit-permission/${permission.id}`);
    };

    const handleDelete = (permission) => {
        console.log('Delete permission:', permission);
        API.delete(`permissions/${permission.id}/`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error('Error deleting permission:', error);
            });
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className="card-header"
                     style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 className="card-title">Permissions Management</h5>
                    <button className="btn btn-primary" onClick={() => navigator('/create-permission')}>
                        Create Permission
                    </button>
                </div>
                <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
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
            <hr className="my-5" />
        </div>
    );
};

export default PermissionsManagement;
