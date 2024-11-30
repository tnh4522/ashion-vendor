import { useEffect, useState } from 'react';
import { Input, Button, Form, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import { useNavigate, useParams } from 'react-router-dom';

const EditCategory = () => {
    const {id} = useParams();
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
                    // 'Authorization': `Bearer ${userData.access}`,
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

    // If the category is not fetched yet, show a loading message
    if (loading || !category) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <h5 className="card-header">Edit Category</h5>
                <div className="card-body">
                    <Form
                        initialValues={{
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            is_active: category.is_active,
                        }}
                        onFinish={handleSubmit}
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
                            rules={[{ required: true, message: 'Please select if the category is active!' }]}
                        >
                            <Input type="checkbox" />
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
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update Category
                            </Button>
                            <Button type="primary" loading={loading} onClick={() => handleCancel()}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;