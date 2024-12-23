// src/components/Products/ImageSearch.jsx

import React, { useState } from 'react';
import {
    Upload,
    Button,
    Typography,
    Spin,
    List,
    Card,
    Row,
    Col,
    message
} from 'antd';
import { UploadOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import API from "../../service/service"; // Sử dụng API abstraction
import useUserContext from "../../hooks/useUserContext";
import useNotificationContext from "../../hooks/useNotificationContext";
import { Link } from 'react-router-dom';

const { Title } = Typography;

const ImageSearch = () => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [category, setCategory] = useState('');
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();

    const handleChange = ({ fileList }) => {
        setFileList(fileList.slice(-1)); // Chỉ giữ lại 1 file
    };

    const handleUpload = () => {
        if (fileList.length === 0) {
            message.error('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', fileList[0].originFileObj);

        setLoading(true);
        API.post(`search/image-search/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userData.access}`,
            },
        })
            .then(response => {
                setLoading(false);
                setCategory(response.data.category);
                setResults(response.data.products);
                openSuccessNotification('Image search completed successfully.');
            })
            .catch(error => {
                setLoading(false);
                console.error('Error during image search:', error);
                if (error.response && error.response.status === 401) {
                    openErrorNotification('Unauthorized access. Please log in again.');
                    logout();
                } else {
                    openErrorNotification('There was an error during image search.');
                }
            });
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <Card
                title={<Title level={4}>Image Search</Title>}
                bordered={false}
                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12}>
                        <Upload
                            listType="picture"
                            beforeUpload={() => false} // Ngăn Upload tự động
                            onChange={handleChange}
                            fileList={fileList}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Select Image</Button>
                        </Upload>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={handleUpload}
                            style={{ marginTop: '16px' }}
                            disabled={fileList.length === 0}
                        >
                            Search
                        </Button>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        {loading ? (
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        ) : (
                            category && (
                                <div>
                                    <Title level={5}>Predicted Category: {category}</Title>
                                    <List
                                        grid={{ gutter: 16, column: 2 }}
                                        dataSource={results}
                                        locale={{ emptyText: 'No similar products found.' }}
                                        renderItem={product => (
                                            <List.Item>
                                                <Card
                                                    hoverable
                                                    cover={
                                                        <img
                                                            alt={product.name}
                                                            src={product.main_image}
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/200';
                                                            }}
                                                        />
                                                    }
                                                >
                                                    <Card.Meta
                                                        title={<Link to={`/product/${product.slug}`}>{product.name}</Link>}
                                                        description={`Price: ${product.sale_price ? `$${product.sale_price}` : `$${product.price}`}`}
                                                    />
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )
                        )}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ImageSearch;
