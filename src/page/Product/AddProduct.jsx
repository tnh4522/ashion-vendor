import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import API from "../../service/service";
import useUserContext from "../../hooks/useUserContext";
import useNotificationContext from "../../hooks/useNotificationContext";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Input,
    Typography,
    Select,
    Space,
    Row,
    Col,
    Modal,
    Card,
    Progress,
    message
} from 'antd';
import { ArrowLeftOutlined } from "@ant-design/icons";

import BasicInformation from './components/BasicInformation.jsx';
import InventoryDetails from './components/InventoryDetails.jsx';
import SalesDetails from './components/SalesDetails.jsx';
import ImageManagement from './components/ImageManagement.jsx';

const { Text, Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

function customSlugify(str) {
    return str
        .toLowerCase()
        .trim()

        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const AddProduct = () => {
    const {id_category } = useParams();
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loadingStocks, setLoadingStocks] = useState(true);

    const [originalSizes, setOriginalSizes] = useState([]);
    const [originalColors, setOriginalColors] = useState([]);

    const [productImages, setProductImages] = useState([]);
    const [variants, setVariants] = useState([]);

    const [filterSizes, setFilterSizes] = useState([]);
    const [filterColors, setFilterColors] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        user: userData.id,
        slug: '',
        sku: '',
        barcode: '',
        brand: '',
        description: '',
        material: '',
        care_instructions: '',
        category: id_category || '',
        price: '',
        sale_price: '',
        start_sale_date: '',
        end_sale_date: '',
        stock: 0,
        weight: '',
        dimensions: '',
        sizes: [],
        colors: [],
        status: 'ACTIVE',
        is_featured: false,
        is_new_arrival: false,
        is_on_sale: false,
        video_url: '',
        meta_title: '',
        meta_description: '',
    });

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        fetchCategories();
        fetchStocks();
    }, [userData.access]);

    useEffect(() => {
        if (id_category && categories.length) {
            const selectedCategory = categories.find(category => category.id === parseInt(id_category));
            if (selectedCategory) {
                setFormData(prev => ({
                    ...prev,
                    category: selectedCategory.id
                }));
            }
        }
    }, [categories, id_category]);

    const fetchCategories = async () => {
        try {
            const response = await API.get('categories/leaf-with-parent/?is_active=1');
            setCategories(response.data);
        } catch (error) {
            console.error('There was an error fetching the categories:', error);
        }
    };

    const fetchStocks = async () => {
        try {
            const response = await API.get('stocks/', {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            setStocks(response.data.results);
            setLoadingStocks(false);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            openErrorNotification('There was an error fetching the stock data.');
            setLoadingStocks(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = (type === 'checkbox' ? checked : value);

        // Nếu field name thay đổi, tự sinh slug từ name
        if (name === 'name') {
            const generatedSlug = customSlugify(newValue || '');
            setFormData(prev => ({
                ...prev,
                name: newValue,
                slug: generatedSlug
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: newValue
            }));
        }
    };

    const handleSizesChange = (newSizes) => {
        const upperNewSizes = newSizes.map(size => size.toUpperCase());
        setFormData(prev => ({
            ...prev,
            sizes: upperNewSizes
        }));
        setOriginalSizes([...upperNewSizes]);
    };

    const handleColorsChange = (newColors) => {
        const upperNewColors = newColors.map(color => color.toUpperCase());
        setFormData(prev => ({
            ...prev,
            colors: upperNewColors
        }));
        setOriginalColors([...upperNewColors]);
    };

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
        });
    };

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
        return false;
    };

    const groupedVariants = useMemo(() => {
        const groupMap = {};
        variants.forEach(variant => {
            const key = `${variant.size} - ${variant.color}`;
            if (!groupMap[key]) {
                groupMap[key] = {
                    key,
                    size: variant.size,
                    color: variant.color,
                    totalQuantity: 0,
                    stocks: [],
                };
            }
            groupMap[key].totalQuantity += variant.quantity;
            groupMap[key].stocks.push({
                stock_id: variant.stock_id,
                stock_name: variant.stock_name,
                quantity: variant.quantity,
            });
        });
        return Object.values(groupMap);
    }, [variants]);

    const filteredGroupedVariants = useMemo(() => {
        return groupedVariants.filter(variant => {
            const sizeMatch = filterSizes.length > 0 ? filterSizes.includes(variant.size) : true;
            const colorMatch = filterColors.length > 0 ? filterColors.includes(variant.color) : true;
            return sizeMatch && colorMatch;
        });
    }, [groupedVariants, filterSizes, filterColors]);

    const totalQuantity = useMemo(() => {
        return filteredGroupedVariants.reduce((acc, variant) => acc + variant.totalQuantity, 0);
    }, [filteredGroupedVariants]);

    const handleStockQuantityChange = (value, record, parentKey) => {
        setVariants(prevVariants =>
            prevVariants.map(variant => {
                if (
                    `${variant.size} - ${variant.color}` === parentKey &&
                    variant.stock_id === record.stock_id
                ) {
                    return { ...variant, quantity: value };
                }
                return variant;
            })
        );
    };

    const steps = [
        {
            title: 'Basic Information',
            content: (
                <BasicInformation
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSizesChange={handleSizesChange}
                    handleColorsChange={handleColorsChange}
                />
            ),
            requiredFields: ['name', 'category']
        },
        {
            title: 'Inventory Details',
            content: (
                <InventoryDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    variants={variants}
                    setVariants={setVariants}
                    originalSizes={originalSizes}
                    originalColors={originalColors}
                    filterSizes={filterSizes}
                    setFilterSizes={setFilterSizes}
                    filterColors={filterColors}
                    setFilterColors={setFilterColors}
                    filteredGroupedVariants={filteredGroupedVariants}
                    totalQuantity={totalQuantity}
                    handleStockQuantityChange={handleStockQuantityChange}
                />
            ),
            requiredFields: []
        },
        {
            title: 'Sales Details',
            content: (
                <SalesDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
            ),
            requiredFields: []
        },
        {
            title: 'Image Management',
            content: (
                <ImageManagement
                    productImages={productImages}
                    handleReplaceImage={handleReplaceImage}
                    handleDeleteImage={handleDeleteImage}
                    handleAddImage={handleAddImage}
                />
            ),
            requiredFields: ['price', 'status']
        },
    ];

    const total = steps.length;
    const current = currentStep + 1;
    const progressPercent = Math.round((current / total) * 100);

    const handleNext = () => {
        const requiredFields = steps[currentStep].requiredFields;
        const alwaysRequired = ['name', 'category'];

        const allRequired = [...new Set([...requiredFields, ...alwaysRequired])];

        for (let field of allRequired) {
            if (!formData[field] || formData[field] === '') {
                openErrorNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);

        const requiredFields = steps[currentStep].requiredFields;
        const alwaysRequired = ['name', 'category', 'price', 'status'];
        const allRequired = [...new Set([...requiredFields, ...alwaysRequired])];

        for (let field of allRequired) {
            if (!formData[field] || formData[field] === '') {
                openErrorNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
                setLoading(false);
                return;
            }
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'sizes' || key === 'colors') {
                formDataToSend.append(key, formData[key].join(','));
            } else {
                if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });
        productImages.forEach((img) => {
            if (img.newFile) {
                formDataToSend.append('images', img.newFile);
            }
        });

        try {
            const response = await API.post('product/create/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userData.access}`,
                },
            });

            if (response.status === 201) {
                openSuccessNotification('Product added successfully');
                navigate(-1);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('There was an error adding the product:', error);
            openErrorNotification('There was an error adding the product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            {loadingStocks ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Text>Loading...</Text>
                </div>
            ) : (
                <Card bordered={false} style={{ borderRadius: '8px' }}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Button
                                type="link"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>
                        </Col>
                    </Row>

                    {/* Luôn hiển thị 4 trường trên cùng */}
                    <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '20px' }}>
                        <Col xs={24} sm={24} md={6}>
                            <Title level={4}>Product Name<span style={{color: 'red'}}>*</span></Title>
                            <Input
                                value={formData.name}
                                name="name"
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                size="middle"
                            />
                        </Col>
                        <Col xs={24} sm={24} md={6}>
                            <Title level={4}>Slug</Title>
                            <Input
                                value={formData.slug}
                                name="slug"
                                placeholder="Slug auto-generated"
                                size="middle"
                                disabled
                            />
                        </Col>
                        <Col xs={24} sm={24} md={6}>
                            <Title level={4}>SKU</Title>
                            <Input
                                value={formData.sku}
                                name="sku"
                                onChange={handleInputChange}
                                placeholder="Enter SKU (optional)"
                                size="middle"
                            />
                        </Col>
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

                    <Progress
                        percent={progressPercent}
                        format={() => `${current}/${total}`}
                    />
                    <Title level={4} style={{ marginTop: '10px' }}>
                        Step {current}: {steps[currentStep].title}
                    </Title>

                    <div style={{ marginTop: '20px' }}>
                        {steps[currentStep].content}
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        {currentStep > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button type="primary" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button type="primary" loading={loading} onClick={handleSubmit}>
                                Add Product
                            </Button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AddProduct;
