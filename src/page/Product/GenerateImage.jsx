// src/components/Products/GenerateImage.jsx
import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Typography,
    Space,
    Modal,
} from 'antd';
import API from "../../service/service";
import useUserContext from "../../hooks/useUserContext";
import useNotificationContext from "../../hooks/useNotificationContext";
import { useNavigate } from 'react-router-dom';
import {
    PictureOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import formatCurrency from "../../constant/formatCurrency.js";

const { Text, Title } = Typography;
const { confirm } = Modal;

const GenerateImage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]); // State cho danh sách danh mục
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [generating, setGenerating] = useState(false);

    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchFeaturedProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCategories = () => {
        API.get('categories/', {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                setCategories(response.data.results);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                openErrorNotification('There was an error fetching the categories.');
            });
    };

    const fetchFeaturedProducts = () => {
        setLoading(true);
        API.get('product/list/?is_featured=true', {
            headers: {
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then((response) => {
                setFeaturedProducts(response.data.results);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error fetching featured products:', error);
                if (error.response && error.response.status === 401) {
                    openErrorNotification('Unauthorized access. Please log in again.');
                    logout();
                } else {
                    openErrorNotification('There was an error fetching the featured products.');
                }
            });
    };

    const handleGenerateImage = () => {
        if (!selectedProduct) {
            openErrorNotification('Please select a featured product.');
            return;
        }

        confirm({
            title: 'Bạn có chắc chắn muốn tạo ảnh mới cho sản phẩm này?',
            icon: <ExclamationCircleOutlined />,
            content: `Sản phẩm: ${selectedProduct.name}`,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                setGenerating(true);
                API.post('product/generate-image/', { product_id: selectedProduct.id }, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                    },
                })
                    .then((response) => {
                        setGenerating(false);
                        const newProduct = response.data;
                        openSuccessNotification('Image generated and product cloned successfully.');
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

    const columns = [
        {
            title: 'Image',
            key: 'image',
            width: '10%',
            render: (text, record) => {
                const firstImage = record.images && record.images.length > 0 ? record.images[0].image : null;
                const imageUrl = firstImage ? firstImage : null;
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
                return category ? category.name : 'N/A';
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
    ];

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
                    <Title level={5} style={{ margin: 0 }}>Generate Product Image</Title>
                </div>
                <div style={{ padding: '20px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text>Select a featured product to generate a new image:</Text>
                        <Table
                            columns={columns}
                            rowKey={(record) => record.id}
                            dataSource={featuredProducts}
                            loading={loading}
                            pagination={{ pageSize: 5 }}
                            bordered
                            onRow={(record) => ({
                                onClick: () => setSelectedProduct(record),
                            })}
                            rowClassName={(record) => (record.id === selectedProduct?.id ? 'selected-row' : '')}
                            scroll={{ x: 'max-content' }}
                        />
                    </Space>
                    <Button
                        type="primary"
                        icon={<PictureOutlined />}
                        onClick={handleGenerateImage}
                        disabled={!selectedProduct}
                        loading={generating}
                        style={{ marginTop: '20px' }}
                    >
                        Generate Image
                    </Button>
                </div>
            </div>
            <hr className="my-5" />
        </div>
    );

};

export default GenerateImage;
