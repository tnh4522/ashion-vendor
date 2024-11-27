import { useEffect, useState } from 'react';
import { Input, Button, Form, message, Upload, Card, Checkbox, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import { useNavigate, useParams } from 'react-router-dom';

const EditCategory = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const { logout } = useUserContext();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const response = await API.get(`categories/${id}/`);
                setCategory(response.data);

                if (response.data.image) {
                    setFileList([{ url: convertUrl(response.data.image) }]);
                }
            } catch (error) {
                if (error.status === 401) {
                    logout();
                    return;
                }
                console.error('There was an error fetching the category:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id, logout]);

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('slug', values.slug);
        formData.append('description', values.description);
        formData.append('is_active', values.is_active);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('image', fileList[0].originFileObj);
        }

        try {
            const response = await API.put(`categories/${id}/update/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Category updated successfully!');
            navigate('/categories');
        } catch (error) {
            console.error('There was an error updating the category:', error);
            message.error('Failed to update category.');
        }
    };

    const handleCancel = () => {
        navigate('/categories');
    };

    if (loading || !category) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <Card title="Edit Category" bordered={false} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Form
                    initialValues={{
                        name: category.name,
                        slug: category.slug,
                        description: category.description,
                        is_active: category.is_active,
                    }}
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[{ required: true, message: 'Please input the category slug!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Is Active"
                        name="is_active"
                        valuePropName="checked"
                    >
                        <Checkbox />
                    </Form.Item>
                    <Form.Item
                        label="Category Image"
                        name="image"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                            beforeUpload={() => false}
                        >
                            {fileList.length < 1 && <div><UploadOutlined /> Upload</div>}
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={16}>
                            <Col>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Update Category
                                </Button>
                            </Col>
                            <Col>
                                <Button onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditCategory;