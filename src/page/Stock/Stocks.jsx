import {useEffect, useState} from 'react';
import {Table} from 'antd';
import qs from 'qs';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import {Link} from "react-router-dom";


const Stocks = () => {
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
        const params = qs.stringify(getStockParams(tableParams));
        API.get(`stocks/?${params}`, {
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
                console.error('Error fetching stocks:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const columns = [
        {
            title: 'Stock Name',
            dataIndex: 'name',
            sorter: true,
            width: '30%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '30%',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '30%',
            render: (location) => {
                if (location) {
                    return location;
                }
            },
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <span>
                    <Link to={`/edit-stock/${record.id}`}>
                        <i className="fa-solid fa-pen-to-square" style={{marginRight: '10px'}}></i>
                    </Link>
                    <i className="fa-solid fa-trash"></i>
                </span>
            ),
        },
    ];

    const getStockParams = (params) => ({
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
            <div className="card">
                <h5 className="card-header">Stock Management</h5>
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

export default Stocks;
