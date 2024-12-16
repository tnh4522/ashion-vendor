import { useEffect, useState } from 'react';
import {Table, Button, Input, Checkbox} from 'antd';
import qs from 'qs';
import API from "../../../service/service";
import useUserContext from "../../../hooks/useUserContext";
import useNotificationContext from "../../../hooks/useNotificationContext";

// eslint-disable-next-line react/prop-types
const Products = ({ onProductSelect }) => {
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
    const [searchParams, setSearchParams] = useState({
        searchText: '',
    })
    const { userData, logout } = useUserContext();
    const { openErrorNotification } = useNotificationContext();
    const [selectedProduct, setSelectedProduct] = useState([]);

    const fetchData = () => {
        setLoading(true);
        const params = qs.stringify(getProductParams(tableParams));
        API.get(`product/list/?${params}`, {
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

    const onSelectChange = (record) => (e) => {
        if (e.target.checked) {
            setSelectedProduct((prev) => [...prev, record]);
        } else {
            setSelectedProduct((prev) => prev.filter((p) => p.id !== record.id));
        }
    }

    const columns = [
        {
            title: 'Select',
            key: 'select',
            width: '5%',
            render: (record) => (
                <Checkbox onChange={onSelectChange(record)}></Checkbox>
            ),
        },
        {
            title: 'Image',
            dataIndex: 'main_image_url',
            key: 'main_image',
            width: '10%',
            render: (text, record) => (
                record.images ? (
                    <img
                        src={record.images[0].image}
                        alt={record.images[0].caption}
                        style={{ width: '60px', height: '60px', objectFit: 'cover'}}
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
            width: '35%',
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
            width: '20%',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            width: '10%',
        }
    ];

    const getProductParams = (params) => ({
        page_size: params.pagination?.pageSize,
        page: params.pagination?.current,
        ordering: params.sortField ? `${params.sortOrder === 'descend' ? '-' : ''}${params.sortField}` : undefined,
        search: searchParams.searchText,
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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleResetFilters = () => {
        setSearchParams({
            searchText: '',
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

    const handleSearch = () => {
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: 1,
            },
        });
        fetchData();
    };

    return (
        <div className="row m-3">
            <div className="col-md-6">
                <Input
                    id="searchText"
                    name="searchText"
                    value={searchParams.searchText}
                    onChange={handleInputChange}
                    placeholder="Search by first name, last name or email"
                />
            </div>
            <div className="col-md-6">
                <Button type="default" onClick={handleResetFilters} style={{marginRight: '10px'}}>Reset Filters</Button>
                <Button type="primary" onClick={handleSearch}>Perform Search</Button>
            </div>
            <div className="table-responsive text-nowrap mt-4">
                <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={data}
                    pagination={tableParams.pagination}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </div>
            <div className="col-md-12 mt-3 text-center">
                <Button
                    type="primary"
                    onClick={() => onProductSelect(selectedProduct)}
                    disabled={selectedProduct.length === 0}
                >
                    Confirm Selection
                </Button>
            </div>
        </div>
    );
};

export default Products;
