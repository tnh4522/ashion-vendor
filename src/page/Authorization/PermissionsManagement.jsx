import { useEffect, useState } from 'react';
import { Table } from 'antd';
import qs from 'qs';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";

const PermissionsManagement = () => {
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
            width: '10%'
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

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card mt-3">
                <div className="card-header">
                    <h5>Permissions Settings</h5>
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
        </div>
    );
};

export default PermissionsManagement;
