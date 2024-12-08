import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, message, Input, Button, Form, Tooltip, Space, Modal} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PictureOutlined, CheckCircleOutlined, CloseCircleOutlined, SettingFilled, ProductFilled, SmileOutlined} from '@ant-design/icons';
import API from "../../service/service.jsx";
import removeAccents from 'remove-accents';

const { confirm } = Modal;

const convertToSlug = (str) => {
    return removeAccents(str).toLowerCase().replace(/\s+/g, '-');
};

const CategoryDetail = () => {
    const {id, name} = useParams();
    const [subCategories, setSubCategories] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
    const [subCategoryCount, setSubCategoryCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [subCategoryName, setSubCategoryName] = useState('');
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await API.get(`categories/${id}/products/`);
            setProducts(response.data);
            setProductCount(response.data.length)
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [id]);

    const columnsProducts = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleDateString(),
        },
    ];

    const fetchSubCategories = async () => {
        setLoading(true);
        try {
            const response = await API.get(`categories/${id}/sub-categories/`);
            setSubCategories(response.data);
            setSubCategoryCount(response.data.length);
        } catch (error) {

            console.error('Error fetching subcategories:', error);
            message.error('Failed to fetch subcategories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubCategories();
    }, [id]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const convertUrl = (url) => {
        return url.replace("/media/", "/api/static/");
    }

    const handleActive = async () => {
        try {
            await API.post('categories/update-active/', {
                ids: selectedRowKeys,
                is_active: true
            });
            message.success('Categories activated successfully');

            setSubCategories(prev =>
                prev.map(item =>
                    selectedRowKeys.includes(item.id)
                        ? { ...item, is_active: true }
                        : item
                )
            );
        } catch (error) {
            console.error('There was an error activating the categories:', error);
            message.error('Failed to activate categories');
        }
    };
    
    const handleUnactive = async () => {
        try {
            await API.post('categories/update-active/', {
                ids: selectedRowKeys,
                is_active: false
            });
            message.success('Categories deactivated successfully');
    
            setSubCategories(prev =>
                prev.map(item =>
                    selectedRowKeys.includes(item.id)
                        ? { ...item, is_active: false }
                        : item
                )
            );
        } catch (error) {
            console.error('There was an error deactivating the categories:', error);
            message.error('Failed to deactivate categories');
        }
    };

    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure you want to delete these categories ?',
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
            fetchSubCategories(); 
        } catch (error) {
            console.error('There was an error deleting the categories:', error);
            message.error('Failed to delete categories');
        }
    };

    const handleImport = () => {
        message.info('This feature is under development.');
    };

    const handleExport = () => {
        message.info('This feature is under development.');
    };

    const handleCreateSubCategory = async () => {
        if (!subCategoryName.trim()) {
            message.warning("Please enter a valid sub-category name !");
            return;
        }
        try {
            const response = await API.post(`categories/${id}/sub-categories/create/`, {
                name: subCategoryName,
                is_active: false,
                slug: convertToSlug(subCategoryName)
            });
            message.success("Sub-category created successfully!");
            setSubCategoryName('');
            setSubCategories([...subCategories, response.data]);
            setSubCategoryCount(subCategoryCount + 1);
        } catch (error) {
            console.error('Error creating subcategory:', error);
            message.error('Failed to create sub-category');
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-category/${id}/`);
    };

    const columns = [
        {
            title: 'Designation',
            dataIndex: 'name',
            key: 'designation',
            width: '80%',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {record.image ? (
                        <img
                            src={convertUrl(`http://127.0.0.1:8000` + record.image)}
                            alt={record.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '20px' }}
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
            title: 'Product',
            dataIndex: 'product_public',
            key: 'product_public',
            align: 'center',
            width: '10%',
        }
    ];

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
                <div className='d-flex align-items-center'>
                    <h2 className="card-header">CATEGORY {name}
                    </h2>
                    <Button 
                        type="link" 
                        icon={<SettingFilled />} 
                        onClick={() => handleEdit(id)} 
                        style={{ display: 'flex', fontSize: '16px', color: '#1478ff' }}
                    >
                        Edit This Category
                    </Button>
                </div>
                <div className="card">
                <div className="d-flex justify-content-between align-items-center mx-3 my-3">
                    <h3 className="mb-0 mx-2">  Sub-Categories ({subCategoryCount})</h3>
                    <Button
                        type="primary"
                        onClick={() => navigate(-1)}
                        style={{ float: 'right' }}
                    >
                        &lt; Back
                    </Button>
                </div>
                    <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
                        <Table
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={subCategories}
                            rowKey={(record) => record.id}
                            loading={loading}
                            locale={{
                                emptyText: (
                                  <div style={{ textAlign: 'center' }}>
                                    <SmileOutlined style={{ fontSize: '48px', marginTop:'10px', marginBottom: '8px', color: '#7d818a' }} />
                                    <h5>No sub-categories available</h5>
                                  </div>
                                ),
                              }}
                        />
                        
                    </div>
                    <div style={{backgroundColor: '#eeeeee'}} className='mx-3 mb-3' >
                        <div className="d-flex justify-content-between align-items-center" style={{ padding: '20px' }}>
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
                                    placeholder="New Sub-Category" 
                                    value={subCategoryName}
                                    required
                                    onChange={(e) => setSubCategoryName(e.target.value)}
                                    style={{ marginRight: '10px' }} 
                                />
                                <Button type="primary" onClick={handleCreateSubCategory}>Create</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className="card-header">Products ({productCount}) </h3>
                <div className="card">
                    <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
                        <Table
                            columns={columnsProducts}
                            dataSource={products}
                            rowKey={(record) => record.id}
                            loading={loading}
                            locale={{
                                emptyText: (
                                  <div style={{ textAlign: 'center' }}>
                                    <ProductFilled style={{ fontSize: '48px',marginTop:'10px', marginBottom: '8px', color: '#7d818a' }} />
                                    <h5>No products available in this category</h5>
                                  </div>
                                ),
                              }}
                        />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CategoryDetail;
