import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, message, Typography, Input, Button, Form, Tooltip, Space, Modal} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PictureOutlined, CheckCircleOutlined, CloseCircleOutlined, SettingFilled, ProductFilled, SmileOutlined} from '@ant-design/icons';
import API from "../../service/service.jsx";
import {convertToSlug} from '../../utils/Function.jsx';
import {BE_URL} from "../../service/config.jsx";
import formatCurrency from '../../constant/formatCurrency.js';
const { confirm } = Modal;
import useUserContext from '../../hooks/useUserContext.jsx';
import useNotificationContext from '../../hooks/useNotificationContext.jsx';
const { Text, Title } = Typography;

const CategoryDetail = () =>{
    const {id, name} = useParams();
    const [subCategories, setSubCategories] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
    const [subCategoryCount, setSubCategoryCount] = useState(0);
    const [isRootCategory, setRootCategory] = useState(false);
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const [loading, setLoading] = useState(false);
    const [subCategoryName, setSubCategoryName] = useState('');
    const {userData} = useUserContext();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);

    const [importModalVisible, setImportModalVisible] = useState(false);
    const [file, setFile] = useState(null);

    const handleImportProduct = () => {
        setImportModalVisible(true);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/json') {
                setFile(selectedFile);
            } else {
                message.error('Please upload a valid JSON file');
            }
        }
    };

    const handleImportFile = async () => {
        if (!file) {
            message.warning('Please choose a JSON file to import');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileContent = e.target.result;
            try {
                const jsonData = JSON.parse(fileContent);
                if (Array.isArray(jsonData)) {
                    console.log('Imported JSON Data:', jsonData);
    
                    const productRequests = jsonData.map(async (productData) => {
                        const formDataToSend = new FormData();
                        formDataToSend.append('slug', convertToSlug(productData['name']));
                        formDataToSend.append('user', userData.id);
    
                        for (let key of Object.keys(productData)) {
                            if (key === 'category') {
                                try {
                                    const response = await API.get(`categories/${productData[key]}/id/`);
                                    productData[key] = response.data.id;
                                } catch (error) {
                                    console.error(`Failed to fetch parent ID for slug: ${productData[key]}`, error);
                                    message.error(`Failed to find parent with slug: ${productData[key]}`);
                                    return null; // Bỏ qua sản phẩm này
                                }
                            }
    
                            if (key === 'sizes') {
                                if (!productData[key] || productData[key].length === 0) {
                                    formDataToSend.append('sizes', 'Normal'); // Gán giá trị mặc định "Normal" nếu không có sizes
                                } else {
                                    formDataToSend.append('sizes', productData[key].join(',').toUpperCase());
                                }
                            } else if (key === 'colors') {
                                formDataToSend.append('colors', productData[key].join(',').toUpperCase());
                            } else {
                                formDataToSend.append(key, productData[key]);
                            }
                        }
    
                        try {
                            const response = await API.post('product/create/', formDataToSend, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': `Bearer ${userData.access}`,
                                },
                            });
    
                            if (response.status === 201) {
                                console.log(`Product "${productData.name}" added successfully`);
                                return response.data; // Trả về dữ liệu sản phẩm đã thêm
                            }
                        } catch (error) {
                            console.error(`There was an error adding the product: "${productData.name}"`, error);
                            return null; // Bỏ qua sản phẩm này
                        }
                    });
    
                    // Gửi các yêu cầu API song song
                    const results = await Promise.all(productRequests);
                    const successfulProducts = results.filter((result) => result !== null);
    
                    // Hiển thị thông báo tổng kết
                    if (successfulProducts.length > 0) {
                        openSuccessNotification(
                            `${successfulProducts.length} products imported successfully`
                        );
                    }
                    if (successfulProducts.length < jsonData.length) {
                        openErrorNotification(
                            `${jsonData.length - successfulProducts.length} products failed to import`
                        );
                    }
    
                    fetchProducts();
                    setImportModalVisible(false);
                    setFile(null);
                } else {
                    message.error('Invalid JSON format');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                message.error('Failed to read the JSON file');
            }
        };
    
        reader.readAsText(file);
    };
    
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

    const fetchCategoryDetail = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/categories/${id}/`);
            if (response.data && response.data.is_root !== undefined) {
                setRootCategory(response.data.is_root);
            }
        } catch (error) {
            console.error('Error fetching category details:', error);
            message.error('Failed to fetch category details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCategoryDetail();
    }, [id]);

    const convertUrl = (url) => {
        return url.replace("/api/media/", "/media/");
    }

    const columnsProducts = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'designation',
            width: '80%',
            render: (text, record) => {
                const firstImage = record.images && record.images.length > 0 ? record.images[0].image : null;
                const imageUrl = firstImage ? convertUrl(firstImage) : null;
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                {imageUrl ? (
                    <img
                        src={convertUrl(BE_URL + imageUrl)}
                        alt={record.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '20px' }}
                    />
                ) : (
                    <PictureOutlined style={{ fontSize: '50px', marginRight: '10px' }} /> 
                )}
                <Link to={`/edit-product/${record.id}?recommend=true`} style={{ color: record.status === 'INACTIVE' ? '#ff4d4f' : 'inherit', fontWeight: '500' }}>{record.name}</Link>
            </div>
            },
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true,
            width: '10%',
            render: (price) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {formatCurrency(price)}
                </Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                status ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />
            ),
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            render: (brand) => (
                <Text strong>
                    {brand}
                </Text>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => {
                const date = new Date(created_at);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            },
        },
    ];


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
                            src={BE_URL + record.image}
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
                setSelectedRowKeys([]);
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
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('Failed to add category');
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCreateSubCategory();
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-category/${id}/`);
    };

    const onRowClick = (record) => {
        const selectedKeys = [...selectedRowKeys];
        const index = selectedKeys.indexOf(record.id);
        if (index === -1) {
            selectedKeys.push(record.id);
        } else {
            selectedKeys.splice(index, 1);
        }
        setSelectedRowKeys(selectedKeys);
    };



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
                {subCategoryCount > 0 ? (
                    <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
                        <Table
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={subCategories}
                            pagination={{
                                pageSize: 6,
                            }}
                            rowKey={(record) => record.id}
                            loading={loading}
                            locale={{
                                emptyText: (
                                    <div style={{ textAlign: 'center' }}>
                                        <SmileOutlined
                                            style={{
                                                fontSize: '48px',
                                                marginTop: '10px',
                                                marginBottom: '8px',
                                                color: '#7d818a',
                                            }}
                                        />
                                        <h5>No sub-categories available</h5>
                                    </div>
                                ),
                            }}
                            onRow={(record) => ({
                                onClick: () => onRowClick(record),
                            })}
                        />
                    </div>
                ) : null}
                    <div style={{backgroundColor: '#eeeeee'}} className='mx-3 mb-3' >
                        <div className="d-flex justify-content-between align-items-center" style={{ padding: '20px' }}>
                            <div>
                                {selectedRowKeys.length > 0 && subCategoryCount > 0 && (
                                    <Space>
                                        <Button onClick={handleActive}>Active</Button>
                                        <Button onClick={handleUnactive}>Unactive</Button>
                                        <Button onClick={showDeleteConfirm}>Delete</Button>
                                        {/* <Button onClick={handleExport} style={{ marginRight: '10px' }}>Export</Button> */}
                                    </Space>
                                )}
                            </div>
                            <div className="d-flex align-items-center">
                                <Input 
                                    placeholder="New Sub-Category" 
                                    value={subCategoryName}
                                    required
                                    onChange={(e) => setSubCategoryName(e.target.value)}
                                    style={{ marginRight: '10px' }}
                                    onKeyDown={handleKeyDown}
                                />
                                <Button type="primary" className='mx-2' onClick={handleCreateSubCategory}>Add</Button>
                                <Button type="primary" onClick={handleCreateSubCategory}>Add + </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className="card-header">Products ({productCount}) </h3>
                {productCount > 0 ? 
                    <div className="card">
                        <div className="table-responsive text-nowrap" style={{ padding: '20px' }}>
                            <Table
                                columns={columnsProducts}
                                dataSource={products}
                                rowKey={(record) => record.id}
                                loading={loading}
                                pagination={{
                                    pageSize: 6,
                                }}
                                bordered
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
                    :
                    null
                }
                {isRootCategory == false  ? (<>
                            <div style={{backgroundColor: '#eeeeee'}} className='mx-3 mb-3'>
                                <div className="d-flex justify-content-between align-items-center" style={{ padding: '20px' }}>
                                    <div>
                                        <Button onClick={handleImportProduct} style={{ marginRight: '10px' }}>Import</Button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Button type="primary" onClick={() => navigate(`/add-product/${id}/`)}>Add + </Button>
                                    </div>
                                </div>
                            </div>
                                <Modal
                                title="Import Products"
                                open={importModalVisible}
                                onCancel={() => setImportModalVisible(false)}
                                footer={[
                                    <Button key="cancel" onClick={() => setImportModalVisible(false)}>
                                        Cancel
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={handleImportFile}>
                                        Import
                                    </Button>,
                                ]}
                            >
                                <div>
                                    <Input
                                        type="file"
                                        accept=".json"
                                        onChange={handleFileChange}
                                        style={{ marginBottom: '20px' }}
                                    />
                                    {file && (
                                        <div>
                                            <strong>Selected file:</strong> {file.name}
                                        </div>
                                    )}
                                </div>
                            </Modal>
                            </>
                            )
                        : null }
            </div>
        </div>

    );
};

export default CategoryDetail;
