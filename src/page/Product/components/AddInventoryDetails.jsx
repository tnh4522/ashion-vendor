import React from 'react';
import { Table, InputNumber, Typography, Button, Upload, Image, Modal, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;

const AddInventoryDetails = ({
                                 variants,
                                 setVariants,
                                 variantImages,
                                 setVariantImages,
                                 isDisabled,
                             }) => {

    const handleQuantityChange = (value, record) => {
        const updatedVariants = variants.map(variant => {
            if (variant.id === record.id) {
                return { ...variant, quantity: value };
            }
            return variant;
        });
        setVariants(updatedVariants);
    };

    const handleReplaceVariantImage = (file, variant) => {
        if (!file) return;
        const updatedImages = { ...variantImages };
        updatedImages[variant.variant_name] = {
            id: variant.id,
            file: file,
            url: URL.createObjectURL(file),
        };
        setVariantImages(updatedImages);
        message.success(`Variant's Image ${variant.variant_name} has just changed successfully!`);
    };

    const handleDeleteVariantImage = (variant) => {
        confirm({
            title: `Do you want to delete this image of ${variant.variant_name}?`,
            content: 'This action cannot be redone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                const updatedImages = { ...variantImages };
                delete updatedImages[variant.variant_name];
                setVariantImages(updatedImages);
                message.success(`Variant's Image ${variant.variant_name} has just deleted successfully!`);
            },
        });
    };

    const handleAddVariantImage = (file, variant) => {
        if (variantImages[variant.variant_name]) {
            message.error(`Please replace the current image of Variant ${variant.variant_name}!`);
            return;
        }
        const updatedImages = { ...variantImages };
        updatedImages[variant.variant_name] = {
            id: variant.id,
            file: file,
            url: URL.createObjectURL(file),
        };
        setVariantImages(updatedImages);
        message.success(`Variant's Image ${variant.variant_name} has just added successfully!`);
    };

    const columns = [
        {
            title: 'Variant Name',
            dataIndex: 'variant_name',
            key: 'variant_name',
            render: text => <Text>{text}</Text>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber
                    min={0}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(value, record)}
                    disabled={isDisabled}
                />
            ),
        },
        {
            title: 'Variatn Image',
            dataIndex: 'variant_image',
            key: 'variant_image',
            render: (text, record) => {
                const image = variantImages[record.variant_name];
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {image ? (
                            <Image
                                src={image.url}
                                alt={record.variant_name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                preview={false}
                            />
                        ) : (
                            <div style={{ width: '50px', height: '50px', background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }}>
                                <Text type="secondary">Chưa có</Text>
                            </div>
                        )}
                        <Upload
                            beforeUpload={(file) => {
                                handleReplaceVariantImage(file, record);
                                return false; 
                            }}
                            showUploadList={false}
                            disabled={isDisabled}
                        >
                            <Button icon={<UploadOutlined />} size="small">Thay Thế</Button>
                        </Upload>
                        {image ? (
                            <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                                onClick={() => handleDeleteVariantImage(record)}
                                disabled={isDisabled}
                                style={{ marginLeft: '5px' }}
                            />
                        ) : (
                            <Upload
                                beforeUpload={(file) => {
                                    handleAddVariantImage(file, record);
                                    return false;
                                }}
                                showUploadList={false}
                                disabled={isDisabled}
                            >
                                <Button icon={<UploadOutlined />} size="small">Thêm</Button>
                            </Upload>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <Table
                dataSource={variants}
                columns={columns}
                rowKey="id"
                pagination={false}
                bordered
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default AddInventoryDetails;
