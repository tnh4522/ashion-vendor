import { useEffect, useState } from 'react';
import { Table } from 'antd';
import qs from 'qs';

const columns = [
    {
        title: 'Product Name',
        dataIndex: 'title',
        sorter: true,
        width: '30%',
    },
    {
        title: 'Category',
        dataIndex: 'category',
        filters: [
            {
                text: 'Beauty',
                value: 'beauty',
            },
            {
                text: 'Electronics',
                value: 'electronics',
            },
        ],
        width: '20%',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        sorter: true,
        render: (price) => `$${price}`,
        width: '20%',
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        width: '20%',
    },
];

const getProductParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

const Products = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });

    const fetchData = () => {
        setLoading(true);
        fetch(`https://dummyjson.com/products?${qs.stringify(getProductParams(tableParams))}`)
            .then((res) => res.json())
            .then(({ products, total }) => {
                setData(products);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: total, // Total từ dữ liệu trả về
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

        // Reset dataSource khi pageSize thay đổi
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <h5 className="card-header">List Product</h5>
                <div className="table-responsive text-nowrap" style={{padding: '20px'}}>
                    <Table
                        columns={columns}
                        rowKey={(record) => record.id} // Sử dụng `id` từ dữ liệu sản phẩm
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

export default Products;
