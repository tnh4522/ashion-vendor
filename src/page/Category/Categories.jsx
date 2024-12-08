import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, message, Radio, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PictureOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import removeAccents from 'remove-accents';

const { confirm } = Modal;

const convertToSlug = (str) => {
    return removeAccents(str).toLowerCase().replace(/\s+/g, '-');
};

const Categories = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryCount, setCategoryCount] = useState(0); 
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
    const [newCategoryName, setNewCategoryName] = useState(''); 
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const { logout } = useUserContext();
    const navigate = useNavigate();

    const handleAdd = async () => {
        if (!newCategoryName) {
            message.error('Category name is required');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', newCategoryName);
        formDataToSend.append('is_active', false);
        formDataToSend.append('slug', convertToSlug(newCategoryName));

        try {
            const response = await API.post('categories/create/', formDataToSend, {
                headers: {
                    // 'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Category added successfully');
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error('There was an error adding the category:', error);
            message.error('Failed to add category');
        }
    };

    const handleImport = () => {
        message.info('This feature is under development.');
    };

    const handleExport = () => {
        message.info('This feature is under development.');
    };

    const handleActive = async () => {
        try {
            await API.post('categories/update-active/', {
                ids: selectedRowKeys,
                is_active: true
            });
            message.success('Categories activated successfully');
            fetchCategories();
        } catch (error) {
            console.error('There was an error activating the categories:', error);
            message.error('Failed to activate categories');
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-category/${id}/`);
    };

    const handleUnactive = async () => {
        try {
            await API.post('categories/update-active/', {
                ids: selectedRowKeys,
                is_active: false
            });
            message.success('Categories deactivated successfully');
            fetchCategories();
        } catch (error) {
            console.error('There was an error deactivating the categories:', error);
            message.error('Failed to deactivate categories');
        }
    };

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure you want to delete these categories?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeleteSelected();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleDeleteSelected = async () => {
        try {
            await API.post('categories/delete/', {
                ids: selectedRowKeys
            });
            message.success('Categories deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('There was an error deleting the categories:', error);
            message.error('Failed to delete categories');
        }
    };

    const columns = [
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            width: '80%',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {record.image ? (
                        <img
                            src={convertUrl(record.image)}
                            alt={record.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                        />
                    ) : (
                        <PictureOutlined style={{ fontSize: '50px', marginRight: '10px' }} /> 
                    )}
                    <Link to={`/categories/${record.id}/products/${record.name}`}>{record.name}</Link>
                </div>
            ),
        },
        {
            title: 'Is Active',
            dataIndex: 'is_active',
            key: 'is_active',
            align: 'center',
            width: '10%',
            render: (isActive) => (
                isActive ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />
            ),
        },
        {
            title: 'Product Public',
            dataIndex: 'product_public',
            key: 'product_public',
            align: 'center',
            width: '10%',
        },
        {
            title: 'Action',
            key: 'x',
            dataIndex: '',
            align: 'center',
            render: (text, record) => (
                <span>
                    <span>
                        <Button
                            type="link"
                            icon={<i className="fa-solid fa-pen-to-square"></i>}
                            onClick={() => handleEdit(record.id)}
                        >
                        </Button>
                    </span>
                </span>
            ),
        }
    ];

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    }

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await API.get(`categories/?sort_by=${sortBy}&order=${order}`);
            setData(response.data.results);
            setCategoryCount(response.data.results.length); 
        } catch (error) {
            if (error.status === 401) {
                logout();
                return;
            };
            console.error('There was an error fetching the categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [sortBy, order]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
            <h5 className="card-header">List Categories ({categoryCount})</h5>
                <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={data}
                        rowKey={(record) => record.id}
                        loading={loading}
                    />
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3" style={{ padding: '20px' }}>
                    <div>
                        {selectedRowKeys.length > 0 && (
                            <Space>
                                <Button onClick={handleActive}>Active</Button>
                                <Button onClick={handleUnactive}>Unactive</Button>
                                <Button onClick={showDeleteConfirm} style={{ marginRight: '10px' }}>Delete</Button>
                            </Space>
                        )}
                        <Button onClick={handleImport} style={{ marginRight: '10px' }}>Import</Button>
                        <Button onClick={handleExport} style={{ marginRight: '10px' }}>Export</Button>
                    </div>
                    <div className="d-flex align-items-center">
                        <Input 
                            placeholder="New Category" 
                            value={newCategoryName}
                            required
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            style={{ marginRight: '10px' }} 
                        />
                        <Button type="primary" onClick={handleAdd}>Add</Button>
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-3" style={{ padding: '20px' }}>
                    <Radio.Group onChange={(e) => setSortBy(e.target.value)} value={sortBy} style={{ marginRight: '10px' }}>
                        <Radio value="name">Sort by Name</Radio>
                        <Radio value="sort_order">Sort by Order</Radio>
                    </Radio.Group>

                </div>
            </div>
            <hr className="my-5" />
        </div>
    );
};

export default Categories;
