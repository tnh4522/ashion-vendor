import React, { useState } from 'react';
import { Modal, Input, Button, message, Upload, Select, Switch, Form, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import removeAccents from 'remove-accents';
import API from "../../service/service.jsx";

const convertToSlug = (str) => {
    return removeAccents(str).toLowerCase().replace(/\s+/g, '-');
};

const AddCategoryModal = ({ isVisible, onClose, onAddCategory, categories }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [image, setImage] = useState(null);
    const [parentCategory, setParentCategory] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleImageUpload = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length > 0) {
            setImage(newFileList[0].originFileObj);
        }
    };

    const handleAddCategory = async () => {
        if (!categoryName) {
            message.error('Category name is required');
            return;
        }

        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('slug', convertToSlug(categoryName));
        formData.append('description', categoryDescription);
        formData.append('meta_title', metaTitle);
        formData.append('meta_description', metaDescription);
        formData.append('is_active', isActive);
        if (image) formData.append('image', image);
        console.log(image);
        if (parentCategory) formData.append('parent', parentCategory);
        try {
            const response = await API.post('categories/create/', formData, {
                headers: {
                    // 'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Category added successfully');
        } catch (error) {
            console.error('There was an error adding the category:', error);
            message.error('Failed to add category');
        }
    };

    return (
        <Modal
            title={<div style={{ fontWeight: 'bold', textAlign: 'center' }}>New Category</div>}
            open={isVisible}
            onCancel={onClose}
            footer={null}
        >
            <Form layout="vertical">
                <Form.Item
                    label="Name"
                    required
                    name="name"
                >
                    <Input
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    label="Meta Title"
                    name="meta_title"
                >
                    <Input
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Meta Description"
                    name="meta_description"
                >
                    <Input
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                    />
                </Form.Item>

                <Row gutter={16} justify="center">
                    <Col span={8} style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Form.Item
                            label="Parent"
                            name="parent"
                            style={{ width: '100%' }}
                        >
                            <Select
                                value={parentCategory}
                                onChange={(value) => setParentCategory(value)}
                                placeholder="Select"
                                style={{ width: '100%' }}
                            >
                                {categories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Form.Item
                            label="Image"
                            name="image"
                            style={{ width: '100%' }}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleImageUpload}
                                beforeUpload={() => false}
                                style={{ width: '100%' }}
                            >
                                {fileList.length < 1 && <div><UploadOutlined /> Upload</div>}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Form.Item
                            label="Active"
                            name="is_active"
                            style={{ width: '100%' }}
                        >
                            <Switch
                                checked={isActive}
                                onChange={(checked) => setIsActive(checked)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: '10px' }}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleAddCategory}>
                        Add
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddCategoryModal;
