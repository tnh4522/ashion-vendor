import {useEffect, useState} from 'react';
import {Table} from 'antd';
import qs from 'qs';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";

const columns = [
    {
        title: 'Image',
        dataIndex: 'main_image_url',
        key: 'main_image',
        width: '10%',
        render: (text, record) => (
            record.main_image ? (
                <img
                    src={convertUrl(record.main_image)}
                    alt={record.name}
                    style={{width: '50px', height: '50px', objectFit: 'cover'}}
                />
            ) : (
                <div style={{width: '50px', height: '50px', backgroundColor: '#f0f0f0'}}/>
            )
        ),
    },
    {
        title: 'Product Name',
        dataIndex: 'name',
        sorter: true,
        width: '25%',
    },
    {
        title: 'Category',
        dataIndex: ['category', 'name'],
        width: '20%',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        sorter: true,
        render: (price) => `$${price}`,
        width: '15%',
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        width: '10%',
    },
    {
        title: 'Action',
        key: 'action',
        width: '10%',
        render: () => (
            <span>
                <i className="fa-solid fa-pen-to-square" style={{marginRight: '10px'}}></i>
                <i className="fa-solid fa-trash"></i>
            </span>
        ),
    },
];

const convertUrl = (url) => {
    return url.replace("/media/", "/api/static/");
}

const getProductParams = (params) => ({
    page_size: params.pagination?.pageSize,
    page: params.pagination?.current,
    ordering: params.sortField ? `${params.sortOrder === 'descend' ? '-' : ''}${params.sortField}` : undefined,
});

const Products = () => {
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
        const params = qs.stringify(getProductParams(tableParams));
        API.get(`products/?${params}`, {
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
                console.log('Products:', results);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error fetching products:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: sorter.order,
            sortField: sorter.field,
        });

        // Reset data when pageSize changes
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

export default Products;
