import { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import qs from 'qs';
import API from "../../service/service";
import useUserContext from "../../hooks/useUserContext";
import useNotificationContext from "../../hooks/useNotificationContext";

// eslint-disable-next-line react/prop-types
const Products = ({ searchTerm, onProductSelect }) => {
    const [categories, setCategories] = useState([]);
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

    const { userData, logout } = useUserContext();
    const { openErrorNotification } = useNotificationContext();

    const fetchData = () => {
        setLoading(true);
        const params = qs.stringify(getProductParams(tableParams));
        API.get(`products/?${params}`, {
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
                console.error('Error fetching products:', error);
                if (error.response && error.response.status === 401) {
                    openErrorNotification('Unauthorized access. Please log in again.');
                    logout();
                } else {
                    openErrorNotification('There was an error fetching the products.');
                }
            });
    };

    const fetchCategories = () => {
        API.get('categories/').then((response) => {
            setCategories(response.data.results);
        }).catch((error) => {
            console.error('Error fetching categories:', error);
            openErrorNotification('There was an error fetching the categories.');
        });
    };

    useEffect(() => {
        fetchData();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(tableParams)]);

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
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0' }} />
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
            dataIndex: 'category',
            width: '20%',
            render: (categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return category ? category.name : '';
            },
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
            width: '20%',
            render: (text, record) => (
                <span>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => onProductSelect(record.id)}
                    >
                        Select
                    </Button>
                </span>
            ),
        },
    ];

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    };

    const getProductParams = (params) => ({
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
            <div className="table-responsive text-nowrap" style={{padding: '20px'}}>
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined/>}
                    className="mb-3"
                />
                <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={data.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                    pagination={tableParams.pagination}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
};

export default Products;
