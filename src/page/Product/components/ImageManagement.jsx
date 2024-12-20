import React from 'react';
import { Row, Col, Card, Image, Button, Upload, Typography } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ImageManagement = ({ productImages, handleReplaceImage, handleDeleteImage, handleAddImage, isDisabled }) => {
    return (
        <div className="row">
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
                            onClick={() => { /* Do nothing */ }}
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
