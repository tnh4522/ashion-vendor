// src/components/Products/Products.jsx
import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Typography,
    Input,
    Space,
    Select,
    Drawer,
    Checkbox,
    Form,
    Slider,
    Badge,
} from 'antd';
import qs from 'qs';
import API from "../../service/service";
import useUserContext from "../../hooks/useUserContext";
import useNotificationContext from "../../hooks/useNotificationContext";
import { useNavigate } from 'react-router-dom';
import {
    SearchOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    UploadOutlined,
    FilterOutlined,
    PictureOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import formatCurrency from "../../constant/formatCurrency.js";

const { Text, Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Products = () => {
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]); // State cho gợi ý giảm giá

    // State cho bộ lọc nâng cao
    const [form] = Form.useForm();
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5, // Giữ nguyên pageSize là 5
        },
        sortOrder: null,
        sortField: null,
        searchName: '',
        searchCategories: [],
        filterStatus: '',
        filterPrice: [0, 1000], // Giữ nguyên filterPrice là [0, 1000]
        exactMatch: false, // Thêm thuộc tính exactMatch
    });

    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();

    // State để kiểm soát hiển thị Drawer
    const [drawerVisible, setDrawerVisible] = useState(false);

    // State để kiểm soát hiển thị Modal Generate Image
    const [generateModalVisible, setGenerateModalVisible] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [selectedFeaturedProduct, setSelectedFeaturedProduct] = useState(null);
    const [generating, setGenerating] = useState(false);

    const fetchData = () => {
        setLoading(true);
        const params = qs.stringify(getProductParams(tableParams), { arrayFormat: 'repeat', skipNulls: true });
        console.log('Fetching products with params:', params); // Để kiểm tra
        API.get(`product/list/?${params}`, { // Đảm bảo đường dẫn đúng
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

    // Hàm mới để fetch recommendations
    const fetchRecommendations = () => {
        API.get('product/recommendations/', { // Đường dẫn API gợi ý
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                setRecommendations(response.data.results); // Chỉ lấy mảng 'results'
                console.log('Recommendations:', response.data.results); // In ra mảng 'results'
            })
            .catch((error) => {
                console.error('Error fetching recommendations:', error);
                // Không cần thông báo lỗi vì gợi ý không phải là chức năng chính
            });
    };

    // Hàm để fetch các sản phẩm được đánh dấu là featured
    const fetchFeaturedProducts = () => {
        API.get('product/list/?is_featured=true', { // Đảm bảo backend hỗ trợ filter is_featured
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                setFeaturedProducts(response.data.results);
            })
            .catch((error) => {
                console.error('Error fetching featured products:', error);
                openErrorNotification('There was an error fetching the featured products.');
            });
    };

    useEffect(() => {
        fetchData();
        fetchCategories();
        fetchRecommendations(); // Gọi hàm fetchRecommendations khi component mount
        fetchFeaturedProducts(); // Fetch featured products
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(tableParams)]);

    useEffect(() => {
        console.log('Recommendations:', recommendations);
    }, [recommendations]);

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
                API.delete(`product/detail/${id}/`, { // Đảm bảo đường dẫn đúng
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                })
                    .then(() => {
                        openSuccessNotification('Product deleted successfully');
                        fetchData();
                        fetchRecommendations(); // Cập nhật lại recommendations
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
            ordering: sortField ? `${params.sortOrder === 'descend' ? '-' : ''}${sortField}` : undefined,
        };

        if (params.exactMatch && params.searchName.trim() !== '') {
            queryObj['name_exact'] = params.searchName.trim();
        } else if (params.searchName.trim() !== '') {
            queryObj['search'] = params.searchName.trim();
        }

        if (params.searchCategories && params.searchCategories.length > 0) {
            queryObj['category__name'] = params.searchCategories;
        }

        if (params.filterStatus && params.filterStatus !== '') {
            queryObj['status'] = params.filterStatus;
        }

        // Điều chỉnh filterPrice để phù hợp với backend
        queryObj['price__gte'] = params.filterPrice[0];
        queryObj['price__lte'] = params.filterPrice[1];

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
            exactMatch: values.exactMatch || false,
        }));
        setDrawerVisible(false);
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
            exactMatch: false,
        }));
        setDrawerVisible(false);
    };

    const handleOpenGenerateModal = () => {
        setGenerateModalVisible(true);
    };

    const handleGenerateImage = () => {
        if (!selectedFeaturedProduct) {
            openErrorNotification('Please select a featured product.');
            return;
        }

        confirm({
            title: 'Bạn có chắc chắn muốn tạo ảnh mới cho sản phẩm này?',
            icon: <ExclamationCircleOutlined />,
            content: `Sản phẩm: ${selectedFeaturedProduct.name}`,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                setGenerating(true);
                API.post('product/generate-image/', { product_id: selectedFeaturedProduct.id }, { // Đảm bảo đường dẫn đúng
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                })
                    .then((response) => {
                        setGenerating(false);
                        const newProduct = response.data;
                        openSuccessNotification('Image generated and product cloned successfully.');
                        setGenerateModalVisible(false);
                        fetchData();
                        fetchRecommendations();
                        // Điều hướng tới trang thêm sản phẩm với dữ liệu đã được clone
                        navigate('/add-product', { state: { preloadedProduct: newProduct } });
                    })
                    .catch((error) => {
                        setGenerating(false);
                        console.error('Error generating image:', error);
                        if (error.response && error.response.status === 401) {
                            openErrorNotification('Unauthorized access. Please log in again.');
                            logout();
                        } else if (error.response && error.response.data.detail) {
                            openErrorNotification(error.response.data.detail);
                        } else {
                            openErrorNotification('There was an error generating the image.');
                        }
                    });
            },
            onCancel() {
                // Do nothing
            },
        });
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div
                    className="card-header"
                    style={{
                        backgroundColor: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}
                >
                    <Title level={5} style={{ margin: 0 }}>List Products</Title>
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/add-product')}
                        >
                            Add Product
                        </Button>
                        <Button
                            type="default"
                            icon={<UploadOutlined />}
                            onClick={() => navigate('/products/image-search')}
                        >
                            Image Search
                        </Button>
                        <Button
                            type="default"
                            icon={<FilterOutlined />}
                            onClick={() => setDrawerVisible(true)} // Mở Drawer
                        >
                            Filter & Search
                        </Button>
                        <Button
                            type="default"
                            icon={<PictureOutlined />} // Icon mới
                            onClick={handleOpenGenerateModal} // Mở Modal Generate Image
                        >
                            Generate Image
                        </Button>
                    </Space>
                </div>
                <div style={{ padding: '20px' }}>
                    <Drawer
                        title="Filter & Search Products"
                        placement="right"
                        width={350}
                        onClose={() => setDrawerVisible(false)}
                        visible={drawerVisible}
                        destroyOnClose
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                searchName: tableParams.searchName,
                                searchCategories: tableParams.searchCategories,
                                filterStatus: tableParams.filterStatus,
                                filterPrice: tableParams.filterPrice,
                                exactMatch: tableParams.exactMatch,
                            }}
                        >
                            <Form.Item name="searchName" label="Search by Product Name">
                                <Input
                                    placeholder="Enter product name"
                                    allowClear
                                    prefix={<SearchOutlined />}
                                />
                            </Form.Item>
                            <Form.Item name="exactMatch" valuePropName="checked">
                                <Checkbox>Exact Match</Checkbox>
                            </Form.Item>
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
                            <Form.Item name="filterPrice" label="Filter by Price Range">
                                <Slider
                                    range
                                    min={0}
                                    max={1000}
                                    step={50}
                                    marks={{
                                        0: '$0',
                                        250: '$250',
                                        500: '$500',
                                        750: '$750',
                                        1000: '$1,000',
                                    }}
                                    tipFormatter={(value) => `$${value}`}
                                    defaultValue={[0, 1000]}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                        Apply Filters
                                    </Button>
                                    <Button onClick={onReset} icon={<ReloadOutlined />}>
                                        Reset Filters
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Drawer>

                    {/* Hiển thị bảng sản phẩm */}
                    <div style={{ marginTop: '20px' }}>
                        <Table
                            columns={columns}
                            rowKey={(record) => record.id}
                            dataSource={data}
                            pagination={tableParams.pagination}
                            loading={loading}
                            onChange={handleTableChange}
                            bordered
                            scroll={{ x: 'max-content' }}
                        />
                    </div>

                    {/* Hiển thị gợi ý giảm giá */}
                    {recommendations.length > 0 ? (
                        <div style={{ marginTop: 20, padding: 20, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '4px' }}>
                            <Title level={5}>Recommendation</Title>
                            <Text>
                                Some products have not been ordered in the past week, have not been updated for over a week, and are not discounted. Consider applying a discount to boost sales:
                            </Text>
                            <ul style={{ marginTop: 10 }}>
                                {recommendations.map(p => (
                                    <li key={p.id} style={{ marginBottom: 10 }}>
                                        <span>
                                            <strong>{p.name}</strong> has not been updated or ordered recently.
                                        </span>
                                        <Button
                                            type="link"
                                            style={{ marginLeft: 10 }}
                                            onClick={() => navigate(`/edit-product/${p.id}?recommend=true`)}
                                        >
                                            Apply Discount
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div style={{ marginTop: 20, padding: 20, background: '#f5f5f5', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                            <Title level={5}>Recommendation</Title>
                            <Text type="secondary">
                                There are currently no product recommendations available.
                            </Text>
                        </div>
                    )}

                    {/* Modal Generate Image */}
                    <Modal
                        title="Generate Image for Featured Product"
                        visible={generateModalVisible}
                        onCancel={() => setGenerateModalVisible(false)}
                        footer={[
                            <Button key="back" onClick={() => setGenerateModalVisible(false)}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleGenerateImage} disabled={!selectedFeaturedProduct} loading={generating}>
                                Generate
                            </Button>,
                        ]}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Select a featured product to generate a new image:</Text>
                            <Table
                                columns={[
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
                                ]}
                                rowKey={(record) => record.id}
                                dataSource={featuredProducts}
                                pagination={{ pageSize: 5 }}
                                loading={loading}
                                onRow={(record) => ({
                                    onClick: () => setSelectedFeaturedProduct(record),
                                })}
                                rowClassName={(record) => (record.id === selectedFeaturedProduct?.id ? 'selected-row' : '')}
                                scroll={{ x: 'max-content' }}
                            />
                        </Space>
                    </Modal>
                </div>
            </div>
            <hr className="my-5" />
        </div>
    );

};

export default Products;
