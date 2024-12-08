import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Tabs,
    Upload,
    InputNumber,
    Table,
    Input,
    Modal,
    Space,
    Typography,
    Row,
    Col,
    Image,
    message,
    Card,
    Select
} from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    UploadOutlined,
    DeleteOutlined,
    PlusOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import API from "../../service/service";
import useUserContext from "../../hooks/useUserContext";
import useNotificationContext from "../../hooks/useNotificationContext";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const EditProduct = () => {
    const { id } = useParams();
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [loadingStocks, setLoadingStocks] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sku: '',
        barcode: '',
        brand: '',
        description: '',
        material: '',
        care_instructions: '',
        price: '',
        sale_price: '',
        start_sale_date: '',
        end_sale_date: '',
        stock: 0,
        weight: '',
        dimensions: '',
        sizes: '',
        colors: '',
        status: 'ACTIVE',
        is_featured: false,
        is_new_arrival: false,
        is_on_sale: false,
        video_url: '',
        meta_title: '',
        meta_description: '',
        category: '', // Moved to header
    });

    const [productImages, setProductImages] = useState([]); // [{id, url, newFile}]
    const [loadingImages, setLoadingImages] = useState(false);

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [variants, setVariants] = useState([]);

    // Hàm tạo biến thể
    const generateVariants = (sizes, colors) => {
        const variants = [];
        sizes.forEach(size => {
            colors.forEach(color => {
                variants.push({
                    key: `${size}-${color}-${Date.now()}`, // Unique key
                    size,
                    color,
                    stock: 0, // Mặc định số lượng tồn kho là 0
                });
            });
        });
        return variants;
    };

    // Khi sizes hoặc colors thay đổi, tạo lại biến thể
    useEffect(() => {
        if (sizes.length > 0 && colors.length > 0) {
            const newVariants = generateVariants(sizes, colors);
            setVariants(newVariants);
        } else {
            setVariants([]);
        }
    }, [sizes, colors]);

    // Fetch product details
    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await API.get(`product/detail/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            const productData = response.data;
            setFormData({
                name: productData.name || '',
                slug: productData.slug || '',
                sku: productData.sku || '',
                barcode: productData.barcode || '',
                brand: productData.brand || '',
                description: productData.description || '',
                material: productData.material || '',
                care_instructions: productData.care_instructions || '',
                price: productData.price || '',
                sale_price: productData.sale_price || '',
                start_sale_date: productData.start_sale_date ? productData.start_sale_date.split('T')[0] : '',
                end_sale_date: productData.end_sale_date ? productData.end_sale_date.split('T')[0] : '',
                stock: productData.stock || 0,
                weight: productData.weight || '',
                dimensions: productData.dimensions || '',
                sizes: productData.sizes ? productData.sizes.split(',').map(s => s.trim()) : [],
                colors: productData.colors ? productData.colors.split(',').map(c => c.trim()) : [],
                status: productData.status || 'ACTIVE',
                is_featured: productData.is_featured || false,
                is_new_arrival: productData.is_new_arrival || false,
                is_on_sale: productData.is_on_sale || false,
                video_url: productData.video_url || '',
                meta_title: productData.meta_title || '',
                meta_description: productData.meta_description || '',
                category: productData.category || '',
            });

            // Load images
            const imgs = productData.images || [];
            setProductImages(imgs.map(img => ({
                id: img.id,
                url: img.image,
                newFile: null  // Placeholder for new files
            })));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('Error fetching product:', error);
            openErrorNotification('There was an error fetching the product.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await API.get('categories/');
            setCategories(response.data.results);
        } catch (error) {
            console.error('Error fetching categories:', error);
            openErrorNotification('There was an error fetching the categories.');
        }
    };

    // Fetch stocks
    const fetchStocks = async () => {
        try {
            const response = await API.get('stocks/', {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            setStocks(response.data.results);
            // Initialize stockData
            const initialStockData = response.data.results.map(stock => ({
                stockId: stock.id,
                stockName: stock.name,
                quantity: 0,
            }));
            setStockData(initialStockData);
            setLoadingStocks(false);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            openErrorNotification('There was an error fetching the stock data.');
            setLoadingStocks(false);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchCategories();
        fetchStocks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, userData.access]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle Select changes for size and color
    const handleSizesChange = (value) => {
        setFormData(prev => ({
            ...prev,
            sizes: value,
        }));
        setSizes(value);
    };

    const handleColorsChange = (value) => {
        setFormData(prev => ({
            ...prev,
            colors: value,
        }));
        setColors(value);
    };

    // Handle stock quantity changes for variants
    const handleVariantStockChange = (value, key) => {
        const updatedVariants = variants.map(variant => {
            if (variant.key === key) {
                return { ...variant, stock: value };
            }
            return variant;
        });
        setVariants(updatedVariants);
    };

    // Handle image replacement
    const handleReplaceImage = (file, imageId) => {
        if (!file) return;
        const updatedImages = productImages.map(img => {
            if (img.id === imageId) {
                return { ...img, newFile: file };
            }
            return img;
        });
        setProductImages(updatedImages);
        message.success('Image replaced successfully');
    };

    // Handle image deletion
    const handleDeleteImage = (imageId) => {
        confirm({
            title: 'Are you sure you want to delete this image?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                setProductImages(prevImages => prevImages.filter(img => img.id !== imageId));
                message.success('Image deleted successfully');
            },
            onCancel() {
                // Do nothing
            },
        });
    };

    // Handle adding new image
    const handleAddImage = (file) => {
        if (productImages.length >= 5) {
            openErrorNotification("You can only upload a maximum of 5 images");
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setProductImages(prev => [...prev, { id: Date.now(), url: e.target.result, newFile: file }]);
            message.success('Image added successfully');
        };
        reader.readAsDataURL(file);
        return false; // Prevent upload
    };

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        // Basic validation
        const requiredFields = ['name', 'slug', 'category', 'sku', 'price', 'status'];
        for (let field of requiredFields) {
            if (!formData[field] || formData[field] === '') {
                openErrorNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
                setLoading(false);
                return;
            }
        }

        // Validate variants
        if (variants.length === 0) {
            openErrorNotification(`Please add at least one size and one color to generate variants.`);
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== '') {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append variants as JSON string
        formDataToSend.append('variants', JSON.stringify(variants));

        // Handle image replacements and additions
        productImages.forEach((img) => {
            if (img.newFile && img.id) {
                formDataToSend.append('images', img.newFile);
                formDataToSend.append('replaced_image_id', img.id);
            }
            if (img.newFile && !img.id) { // New images without ID
                formDataToSend.append('images', img.newFile);
                // Backend should handle these as new images
            }
        });

        try {
            const response = await API.put(`product/detail/${id}/`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            if (response.status === 200) {
                openSuccessNotification('Product updated successfully');
                navigate('/products');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('There was an error updating the product:', error);
            openErrorNotification('There was an error updating the product.');
        } finally {
            setLoading(false);
        }
    };

    // Tabs for product details
    const basicInfoTab = (
        <div className="row">
            {/* Basic Information */}
            <div className="mb-3 col-md-12">
                <label htmlFor="care_instructions" className="form-label">Care Instructions</label>
                <TextArea
                    className="form-control"
                    id="care_instructions"
                    name="care_instructions"
                    rows={3}
                    value={formData.care_instructions}
                    onChange={handleInputChange}
                    placeholder="Enter care instructions"
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="sizes" className="form-label">Sizes<span style={{color: 'red'}}>*</span></label>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Enter sizes (e.g., S, M, L, XL)"
                    value={formData.sizes}
                    onChange={handleSizesChange}
                >
                    {sizes.map(size => (
                        <Option key={size} value={size}>
                            {size}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="colors" className="form-label">Colors<span style={{color: 'red'}}>*</span></label>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Enter colors (e.g., Xanh, Đỏ, Tím)"
                    value={formData.colors}
                    onChange={handleColorsChange}
                >
                    {colors.map(color => (
                        <Option key={color} value={color}>
                            {color}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="mb-3 col-md-12">
                <label htmlFor="description" className="form-label">Description</label>
                <TextArea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="brand" className="form-label">Brand</label>
                <Input
                    className="form-control"
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="material" className="form-label">Material</label>
                <Input
                    className="form-control"
                    type="text"
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="Enter material"
                />
            </div>
        </div>
    );

    const inventoryTab = (
        <div className="row">
            <div className="mb-3 col-md-6">
                <label htmlFor="weight" className="form-label">Weight</label>
                <Input
                    className="form-control"
                    type="number"
                    step="0.01"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter weight"
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="dimensions" className="form-label">Dimensions</label>
                <Input
                    className="form-control"
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="Enter dimensions"
                />
            </div>
            <div className="mb-3 col-md-12">
                <label className="form-label">Stock Quantities</label>
                <Table
                    dataSource={stockData}
                    columns={[
                        {
                            title: 'Warehouse',
                            dataIndex: 'stockName',
                            key: 'stockName',
                        },
                        {
                            title: 'Quantity',
                            dataIndex: 'quantity',
                            key: 'quantity',
                            render: (text, record) => (
                                <InputNumber
                                    min={0}
                                    value={record.quantity}
                                    onChange={(value) => handleStockQuantityChange(value, record.stockId)}
                                />
                            ),
                        },
                    ]}
                    rowKey="stockId"
                    pagination={{ pageSize: 4 }}
                />
            </div>
        </div>
    );

    const salesTab = (
        <div className="row">
            <div className="mb-3 col-md-6">
                <label htmlFor="price" className="form-label">Price<span style={{color: 'red'}}>*</span></label>
                <Input
                    className="form-control"
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="sale_price" className="form-label">Sale Price</label>
                <Input
                    className="form-control"
                    type="number"
                    id="sale_price"
                    name="sale_price"
                    value={formData.sale_price}
                    onChange={handleInputChange}
                    placeholder="Enter sale price"
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="start_sale_date" className="form-label">Start Sale Date</label>
                <Input
                    className="form-control"
                    type="date"
                    id="start_sale_date"
                    name="start_sale_date"
                    value={formData.start_sale_date}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="end_sale_date" className="form-label">End Sale Date</label>
                <Input
                    className="form-control"
                    type="date"
                    id="end_sale_date"
                    name="end_sale_date"
                    value={formData.end_sale_date}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="status" className="form-label">Status<span style={{color: 'red'}}>*</span></label>
                <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                    style={{ width: '100%' }}
                    size="middle"
                >
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                    <Option value="DRAFT">Draft</Option>
                </Select>
            </div>
            <div className="mb-3 col-md-6">
                <label className="form-label">Is Featured</label>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_featured">
                        Featured Product
                    </label>
                </div>
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="video_url" className="form-label">Video URL</label>
                <Input
                    className="form-control"
                    type="url"
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="Enter video URL"
                />
            </div>
            <div className="mb-3 col-md-6">
                <label htmlFor="meta_title" className="form-label">Meta Title</label>
                <Input
                    className="form-control"
                    type="text"
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="Enter meta title"
                />
            </div>
            <div className="mb-3 col-md-12">
                <label htmlFor="meta_description" className="form-label">Meta Description</label>
                <TextArea
                    className="form-control"
                    id="meta_description"
                    name="meta_description"
                    rows={3}
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    placeholder="Enter meta description"
                />
            </div>
        </div>
    );

    const tabItems = [
        {
            key: '1',
            label: 'Basic Information',
            children: basicInfoTab,
        },
        {
            key: '2',
            label: 'Inventory Details',
            children: inventoryTab,
        },
        {
            key: '3',
            label: 'Sales Details',
            children: salesTab,
        },
    ];

    const variantColumns = [
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: text => <Text>{text}</Text>,
        },
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
            render: text => <Text>{text}</Text>,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (text, record) => (
                <InputNumber
                    min={0}
                    value={record.stock}
                    onChange={(value) => handleVariantStockChange(value, record.key)}
                />
            ),
        },
    ];

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            {loading || loadingStocks ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Text>Loading...</Text>
                </div>
            ) : (
                <Card bordered={false} style={{ borderRadius: '8px' }}>
                    {/* Header with Back button, Product Name, Slug, SKU, Category */}
                    <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Button
                                type="link"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/products')}
                            >
                                Back
                            </Button>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[16, 16]} justify="center">
                                {/* Product Name */}
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>Product Name<span style={{color: 'red'}}>*</span></Title>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter product name"
                                        size="middle"
                                    />
                                </Col>
                                {/* Slug */}
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>Slug<span style={{color: 'red'}}>*</span></Title>
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="Enter slug"
                                        size="middle"
                                    />
                                </Col>
                                {/* SKU */}
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>SKU<span style={{color: 'red'}}>*</span></Title>
                                    <Input
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        placeholder="Enter SKU"
                                        size="middle"
                                    />
                                </Col>
                                {/* Category */}
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>Category<span style={{color: 'red'}}>*</span></Title>
                                    <Select
                                        value={formData.category}
                                        onChange={(value) => setFormData({ ...formData, category: value })}
                                        placeholder="Select Category"
                                        style={{ width: '100%' }}
                                        size="middle"
                                    >
                                        {categories.map((category) => (
                                            <Option key={category.id} value={category.id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Image Gallery */}
                    <Row justify="center" align="middle" gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                        {productImages.map((img, index) => (
                            <Col key={img.id} xs={24} sm={12} md={8} lg={4}>
                                <Card
                                    hoverable
                                    cover={
                                        <Image
                                            src={img.newFile ? URL.createObjectURL(img.newFile) : img.url}
                                            alt={`Product Image ${index + 1}`}
                                            style={{ height: '150px', objectFit: 'cover' }}
                                            preview={false}
                                        />
                                    }
                                    actions={[
                                        <Upload
                                            beforeUpload={(file) => {
                                                handleReplaceImage(file, img.id);
                                                return false; // Prevent automatic upload
                                            }}
                                            showUploadList={false}
                                        >
                                            <UploadOutlined key="replace" />
                                        </Upload>,
                                        <DeleteOutlined
                                            key="delete"
                                            onClick={() => handleDeleteImage(img.id)}
                                        />,
                                    ]}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <Text strong>Image {index + 1}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                        {/* Add Image Card */}
                        {productImages.length < 5 && (
                            <Col xs={24} sm={12} md={8} lg={4}>
                                <Card
                                    hoverable
                                    style={{ borderStyle: 'dashed', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    onClick={() => { /* Do nothing, handled by Upload */ }}
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

                    {/* Variants Management */}
                    <Card title="Product Variants" bordered={false} style={{ marginBottom: '20px' }}>
                        <Table
                            dataSource={variants}
                            columns={variantColumns}
                            pagination={false}
                            bordered
                        />
                    </Card>

                    {/* Tabs for product details */}
                    <Tabs defaultActiveKey="1" items={tabItems} />

                    {/* Submit and Cancel Buttons */}
                    <Row justify="end" style={{ marginTop: '20px' }}>
                        <Space>
                            <Button type="primary" onClick={handleSubmit} loading={loading}>
                                Update Product
                            </Button>
                            <Button
                                type="default"
                                onClick={() => navigate('/products')}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Row>
                </Card>
            )}
        </div>
    );
};

export default EditProduct;
