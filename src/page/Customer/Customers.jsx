import {useEffect, useState} from 'react';
import {Table} from 'antd';
import qs from 'qs';

const columns = [
    {
        title: 'Name',
        dataIndex: ['name', 'first'],
        sorter: true,
        render: (first, record) => `${first} ${record.name.last}`,
        width: '20%',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        width: '20%',
    },
    {
        title: 'Address',
        dataIndex: ['location', 'street', 'name'],
        render: (street, record) => `${street}, ${record.location.city}, ${record.location.country}`,
    },
    {
        title: 'Purchase History',
        dataIndex: 'purchaseHistory',
        render: (purchaseHistory) => purchaseHistory.join(', '),
    },
];

const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

const Customers = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const fetchData = () => {
        setLoading(true);
        fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
            .then((res) => res.json())
            .then(({results}) => {
                const customers = results.map((result) => ({
                    name: result.name,
                    phone: result.phone,
                    location: result.location,
                    purchaseHistory: ['Purchase 1', 'Purchase 2', 'Purchase 3'], // Dữ liệu mẫu
                }));
                setData(customers);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200, // Sử dụng dữ liệu giả định
                    },
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams?.sortOrder,
        tableParams?.sortField,
        JSON.stringify(tableParams.filters),
    ]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        // Reset dataSource when pageSize changes
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <h5 className="card-header">List Customers</h5>
                <div className="table-responsive text-nowrap">
                    <Table
                        columns={columns}
                        rowKey={(record) => record.name.first + record.name.last}
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

export default Customers;