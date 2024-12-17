// Products.jsx
import { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Typography,
    Input,
    Space,
    Select,
    Row,
    Col,
    Form,
    Slider,
    Badge
} from 'antd';
import qs from 'qs';
import API from "../../service/service";
import useUserContext from "../../hooks/useUserContext";
import useNotificationContext from "../../hooks/useNotificationContext";
import { useNavigate } from 'react-router-dom';
import {
    SearchOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Products = () => {
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho bộ lọc nâng cao
    const [form] = Form.useForm();
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        sortOrder: null,
        sortField: null,
        searchName: '',
        searchCategories: [],
        filterStatus: '',
        filterPrice: [0, 1000],
    });

    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();

    // State để lưu sp cần decision support
    const [staleProducts, setStaleProducts] = useState([]);
    const thresholdDays = 30; // quá 30 ngày chưa update

    const fetchData = () => {
        setLoading(true);
        const params = qs.stringify(getProductParams(tableParams), { arrayFormat: 'repeat', skipNulls: true });
        API.get(`product/list/?${params}`, {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                const { results, count } = response.data;
                setData(results);
                setLoading(false);
                setTableParams(prev => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: count,
                    },
                }));
                checkStaleProducts(results);
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
        API.get('categories/')
            .then((response) => {
                setCategories(response.data.results);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                openErrorNotification('There was an error fetching the categories.');
            });
    };

    useEffect(() => {
        fetchData();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(tableParams)]);

    const handleEdit = (id) => {
        navigate(`/edit-product/${id}`);
    };

    const handleDelete = (id) => {
        confirm({
            title: 'Are you sure you want to delete this product?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                API.delete(`product/detail/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                })
                    .then(() => {
                        openSuccessNotification('Product deleted successfully');
                        fetchData();
                    })
                    .catch((error) => {
                        console.error('Error deleting the product:', error);
                        if (error.response && error.response.status === 403) {
                            openErrorNotification('You do not have permission to delete this product.');
                        } else if (error.response && error.response.status === 404) {
                            openErrorNotification('Product not found.');
                        } else if (error.response && error.response.status === 401) {
                            openErrorNotification('Unauthorized access. Please log in again.');
                            logout();
                        } else {
                            openErrorNotification('There was an error deleting the product.');
                        }
                    });
            },
        });
    };

    const convertUrl = (url) => {
        return url;
    };

    const columns = [
        {
            title: 'Image',
            key: 'image',
            width: '10%',
            render: (text, record) => {
                const firstImage = record.images && record.images.length > 0 ? record.images[0].image : null;
                const imageUrl = firstImage ? convertUrl(firstImage) : null;
                return imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={record.name}
                        style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #f0f0f0'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50';
                        }}
                    />
                ) : (
                    <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px'
                    }} />
                );
            },
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            sorter: true,
            width: '20%',
            render: (text, record) => (
                <span style={{ color: record.status === 'INACTIVE' ? '#ff4d4f' : 'inherit', fontWeight: '500' }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            sorter: true,
            width: '15%',
            render: (categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return category ? category.name : '';
            },
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true,
            width: '10%',
            render: (price) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {formatCurrency(price)}
                </Text>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'stock',
            sorter: true,
            width: '10%',
            render: (stock) => <Text>{stock}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            width: '10%',
            render: (status) => (
                <Badge
                    status={
                        status === 'ACTIVE'
                            ? 'success'
                            : status === 'INACTIVE'
                                ? 'error'
                                : 'processing'
                    }
                    text={status.charAt(0) + status.slice(1).toLowerCase()}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<i className="fa-solid fa-pen-to-square" style={{ color: '#1890ff' }}></i>}
                        onClick={() => handleEdit(record.id)}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<i className="fa-solid fa-trash" style={{ color: '#ff4d4f' }}></i>}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const getProductParams = (params) => {
        let sortField = params.sortField;
        if (sortField === 'category') {
            sortField = 'category__name';
        }

        const queryObj = {
            page_size: params.pagination?.pageSize,
            page: params.pagination?.current,
            search: params.searchName && params.searchName.trim() !== '' ? params.searchName.trim() : undefined,
            ordering: sortField ? `${params.sortOrder === 'descend' ? '-' : ''}${sortField}` : undefined,
        };

        if (params.searchCategories && params.searchCategories.length > 0) {
            queryObj['categories__name'] = params.searchCategories;
        }

        if (params.filterStatus && params.filterStatus !== '') {
            queryObj['status'] = params.filterStatus;
        }

        // if (params.filterPrice && params.filterPrice.length === 2) {
        //     const [minPrice, maxPrice] = params.filterPrice;
        //     if (minPrice !== null && minPrice !== undefined) {
        //         queryObj['price__gte'] = minPrice;
        //     }
        //     if (maxPrice !== null && maxPrice !== undefined) {
        //         queryObj['price__lte'] = maxPrice;
        //     }
        // }

        return queryObj;
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams(prev => ({
            ...prev,
            pagination,
            sortOrder: sorter.order,
            sortField: sorter.field,
        }));
    };

    const onFinish = (values) => {
        setTableParams(prev => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
            searchName: values.searchName || '',
            searchCategories: values.searchCategories || [],
            filterStatus: values.filterStatus || '',
            filterPrice: values.filterPrice || [0, 1000],
        }));
    };

    const onReset = () => {
        form.resetFields();
        setTableParams(prev => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
            searchName: '',
            searchCategories: [],
            filterStatus: '',
            filterPrice: [0, 1000],
        }));
    };

    // Hàm kiểm tra sp cũ
    const checkStaleProducts = (products) => {
        const now = moment();
        const filtered = products.filter(prod => {
            if (prod.status !== 'ACTIVE') return false;
            if (!prod.stock_variants || prod.stock_variants.length === 0) return false;

            const totalQty = prod.stock_variants.reduce((acc, v) => acc + v.quantity, 0);
            if (totalQty <= 10) return false;

            const oldestUpdate = prod.stock_variants.reduce((oldest, v) => {
                const variantDate = moment(v.updated_at);
                if (!oldest || variantDate.isBefore(oldest)) {
                    return variantDate;
                }
                return oldest;
            }, null);

            if (!oldestUpdate) return false;

            const diffDays = now.diff(oldestUpdate, 'days');
            return diffDays > thresholdDays;
        });

        setStaleProducts(filtered);
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h5 className="card-header" style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>List Products</h5>
                <div style={{ padding: '20px' }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            searchName: tableParams.searchName,
                            searchCategories: tableParams.searchCategories,
                            filterStatus: tableParams.filterStatus,
                            filterPrice: tableParams.filterPrice,
                        }}
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item name="searchName" label="Search by Product Name">
                                    <Input
                                        placeholder="Enter product name"
                                        allowClear
                                        prefix={<SearchOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item name="searchCategories" label="Search by Category">
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Select categories"
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {categories.map(cat => (
                                            <Option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item name="filterStatus" label="Filter by Status">
                                    <Select
                                        allowClear
                                        placeholder="Select status"
                                    >
                                        <Option value="ACTIVE">Active</Option>
                                        <Option value="INACTIVE">Inactive</Option>
                                        <Option value="DRAFT">Draft</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item name="filterPrice" label="Filter by Price Range">
                                    <Slider
                                        range
                                        min={0}
                                        max={10000}
                                        step={50}
                                        marks={{
                                            0: '$0',
                                            2500: '$2,500',
                                            5000: '$5,000',
                                            7500: '$7,500',
                                            10000: '$10,000',
                                        }}
                                        tipFormatter={(value) => `$${value}`}
                                        defaultValue={[0, 10000]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16} justify="end">
                            <Col>
                                <Space>
                                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                        Apply Filters
                                    </Button>
                                    <Button onClick={onReset} icon={<ReloadOutlined />}>
                                        Reset Filters
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>

                    <div style={{ marginTop: '20px' }}>
                        <Table
                            columns={columns}
                            rowKey={(record) => record.id}
                            dataSource={data}
                            pagination={tableParams.pagination}
                            loading={loading}
                            onChange={handleTableChange}
                            onRow={(record) => ({
                                style: {
                                    backgroundColor: record.status === 'INACTIVE' ? '#fff1f0' : 'inherit',
                                },
                            })}
                            bordered
                            scroll={{ x: 'max-content' }}
                        />
                    </div>

                    {staleProducts.length > 0 && (
                        <div style={{ marginTop: 20, padding: 20, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '4px' }}>
                            <Title level={5}>Decision Support</Title>
                            <Text>
                                Some products have not been updated for over {thresholdDays} days. Consider applying a discount to boost sales:
                            </Text>
                            <ul style={{ marginTop: 10 }}>
                                {staleProducts.map(p => (
                                    <li key={p.id} style={{ marginBottom: 10 }}>
                                        <span>
                                            <strong>{p.name}</strong> was last updated over {thresholdDays} days ago.
                                        </span>
                                        <Button
                                            type="link"
                                            style={{ marginLeft: 10 }}
                                            onClick={() => navigate(`/edit-product/${p.id}?tab=3`)}
                                        >
                                            Apply Discount
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <hr className="my-5" />
        </div>
    );
};

export default Products;
