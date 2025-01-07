// components/ImageManagement.jsx
import React from 'react';
import { Row, Col, Card, Image, Button, Upload, Typography, message } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * ImageManagement Component
 * Handles displaying, adding, replacing, and deleting product images.
 *
 * @param {Array} productImages - List of product images.
 * @param {Function} handleReplaceImage - Function to handle image replacement.
 * @param {Function} handleDeleteImage - Function to handle image deletion.
 * @param {Function} handleAddImage - Function to handle adding new images.
 * @param {boolean} isDisabled - Flag to disable actions.
 */
const ImageManagement = ({ productImages, handleReplaceImage, handleDeleteImage, handleAddImage, isDisabled }) => {
    return (
        <div>
            <Row justify="center" align="middle" gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                {productImages.map((img, index) => (
                    <Col key={img.id} xs={24} sm={12} md={8} lg={4}>
                        <Card
                            hoverable={!isDisabled}
                            cover={
                                <Image
                                    src={img.newFile ? URL.createObjectURL(img.newFile) : img.url}
                                    alt={`Product Image ${index + 1}`}
                                    style={{ height: '150px', objectFit: 'cover' }}
                                    preview={false}
                                />
                            }
                            actions={
                                !isDisabled
                                    ? [
                                        <Upload
                                            beforeUpload={(file) => {
                                                handleReplaceImage(file, img.id);
                                                return false;
                                            }}
                                            showUploadList={false}
                                        >
                                            <UploadOutlined key="replace" />
                                        </Upload>,
                                        <DeleteOutlined
                                            key="delete"
                                            onClick={() => handleDeleteImage(img.id)}
                                        />,
                                    ]
                                    : []
                            }
                        >
                            <div style={{ textAlign: 'center' }}>
                                <Text strong>Image {index + 1}</Text>
                            </div>
                        </Card>
                    </Col>
                ))}
                {productImages.length < 5 && !isDisabled && (
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Card
                            hoverable
                            style={{ borderStyle: 'dashed', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Upload
                                beforeUpload={handleAddImage}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button type="dashed" icon={<PlusOutlined />} style={{ width: '100%' }}>
                                    Add Image
                                </Button>
                            </Upload>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default ImageManagement;
