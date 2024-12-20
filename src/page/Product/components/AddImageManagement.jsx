import React from 'react';
import { Row, Col, Card, Image, Button, Upload, Typography, Modal, message } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;

const AddImageManagement = ({
                                productImages,
                                handleReplaceImage,
                                handleDeleteImage,
                                handleAddImage,
                                variantImages,
                                handleReplaceVariantImage,
                                handleDeleteVariantImage,
                                handleAddVariantImage,
                                originalColors,
                                isDisabled,
                            }) => {
    return (
        <div className="row">
            <Row justify="center" align="middle" gutter={[16, 16]} style={{ marginBottom: '40px' }}>
                <Col span={24}>
                    <Text strong>Product Images</Text>
                </Col>
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
                            onClick={() => { /* ... */ }}
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

            {/* Variant Images */}
            <Row justify="center" align="middle" gutter={[16, 16]}>
                <Col span={24}>
                    <Text strong>Variant Images</Text>
                </Col>
                {originalColors.map((color, index) => {
                    const img = variantImages[color];
                    return (
                        <Col key={color} xs={24} sm={12} md={8} lg={4}>
                            <Card
                                hoverable={!isDisabled}
                                cover={
                                    img && (img.newFile || img.url) ? (
                                        <Image
                                            src={img.newFile ? URL.createObjectURL(img.newFile) : img.url}
                                            alt={`Variant Image - ${color}`}
                                            style={{ height: '150px', objectFit: 'cover' }}
                                            preview={false}
                                        />
                                    ) : (
                                        <div style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f0f0' }}>
                                            <Text>No Image</Text>
                                        </div>
                                    )
                                }
                                actions={
                                    !isDisabled
                                        ? [
                                            <Upload
                                                beforeUpload={(file) => {
                                                    handleReplaceVariantImage(file, color);
                                                    return false;
                                                }}
                                                showUploadList={false}
                                            >
                                                <UploadOutlined key={`replace-${color}`} />
                                            </Upload>,
                                            <DeleteOutlined
                                                key={`delete-${color}`}
                                                onClick={() => handleDeleteVariantImage(color)}
                                            />,
                                        ]
                                        : []
                                }
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Text strong>{color}</Text>
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};
export default AddImageManagement;
