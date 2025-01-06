// EditProduct.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    Button,
    Tabs,
    Input,
    Modal,
    Space,
    Typography,
    Row,
    Col,
    Card,
    Select,
    message,
} from 'antd';
import {
    ArrowLeftOutlined,
} from '@ant-design/icons';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";

import BasicInformation from './components/BasicInformation.jsx';
import InventoryDetails from './components/InventoryDetails.jsx';
import SalesDetails from './components/SalesDetails.jsx';
import ImageManagement from './components/EditImageManagement.jsx';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

/**
 * Custom function to generate a URL-friendly slug from a string.
 * @param {string} str - The input string.
 * @returns {string} - The slugified string.
 */
function customSlugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const EditProduct = () => {
    const {id} = useParams();
    const {userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || '1';

    const [activeKey, setActiveKey] = useState(initialTab);

    const [loading, setLoading] = useState(false);
    const [loadingStocks, setLoadingStocks] = useState(true);
    const [categories, setCategories] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [originalSizes, setOriginalSizes] = useState([]);
    const [originalColors, setOriginalColors] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [variants, setVariants] = useState([]);
    const [filterSizes, setFilterSizes] = useState([]);
    const [filterColors, setFilterColors] = useState([]);

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
        sizes: [],
        colors: [],
        status: 'ACTIVE',
        is_featured: false,
        is_new_arrival: false,
        is_on_sale: false,
        video_url: '',
        meta_title: '',
        meta_description: '',
        category: '',
    });

    useEffect(() => {
        fetchProduct();
        fetchCategories();
        fetchStocks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, userData.access]);

    /**
     * Fetch product details from the API.
     */
    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await API.get(`product/detail/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            const productData = response.data;
            const sizes = productData.sizes
                ? productData.sizes.split(',').map(s => s.trim().toUpperCase())
                : [];
            const colors = productData.colors
                ? productData.colors.split(',').map(c => c.trim().toUpperCase())
                : [];

            setOriginalSizes([...sizes]);
            setOriginalColors([...colors]);

            const generatedSlug = productData.name
                ? customSlugify(productData.name)
                : productData.slug || '';

            setFormData({
                name: productData.name || '',
                slug: generatedSlug || '',
                sku: productData.sku || '',
                barcode: productData.barcode || '',
                brand: productData.brand || '',
                description: productData.description || '',
                material: productData.material || '',
                care_instructions: productData.care_instructions || '',
                price: productData.price || '',
                sale_price: productData.sale_price || '',
                start_sale_date: productData.start_sale_date
                    ? productData.start_sale_date.split('T')[0]
                    : '',
                end_sale_date: productData.end_sale_date
                    ? productData.end_sale_date.split('T')[0]
                    : '',
                stock: productData.stock || 0,
                weight: productData.weight || '',
                dimensions: productData.dimensions || '',
                sizes: sizes,
                colors: colors,
                status: productData.status || 'ACTIVE',
                is_featured: productData.is_featured || false,
                is_new_arrival: productData.is_new_arrival || false,
                is_on_sale: productData.is_on_sale || false,
                video_url: productData.video_url || '',
                meta_title: productData.meta_title || '',
                meta_description: productData.meta_description || '',
                category: productData.category || '',
            });

            const imgs = productData.images || [];
            setProductImages(
                imgs.map(img => ({
                    id: img.id,
                    url: img.image,
                    newFile: null,
                }))
            );

            const stockVariants = productData.stock_variants || [];
            const variantsArray = stockVariants.map(variant => {
                const [size, color] = variant.variant_name.split(' - ');
                return {
                    key: variant.id,
                    variant_id: variant.id,
                    size: size.trim().toUpperCase(),
                    color: color.trim().toUpperCase(),
                    stock_id: variant.stock.id,
                    stock_name: variant.stock.name,
                    quantity: variant.quantity,
                    image: variant.image || null,
                    newImageFile: null, // Initialize for potential image updates
                };
            });
            setVariants(variantsArray);

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

    /**
     * Fetch categories from the API.
     */
    const fetchCategories = async () => {
        try {
            const response = await API.get('categories/leaf-with-parent/?is_active=1');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            openErrorNotification('There was an error fetching the categories.');
        }
    };

    /**
     * Fetch stocks from the API.
     */
    const fetchStocks = async () => {
        try {
            const response = await API.get('stocks/', {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            setStocks(response.data.results);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            openErrorNotification('There was an error fetching the stock data.');
        } finally {
            setLoadingStocks(false);
        }
    };

    /**
     * Handle input changes for form fields.
     * @param {Object} e - The event object.
     */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (name === 'name') {
            const generatedSlug = customSlugify(newValue || '');
            setFormData(prev => ({
                ...prev,
                name: newValue,
                slug: generatedSlug,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: newValue,
            }));
        }
    };

    /**
     * Handle changes to the sizes selection.
     * @param {Array} newSizes - The new sizes selected.
     */
    const handleSizesChange = (newSizes) => {
        const upperNewSizes = newSizes.map(size => size.toUpperCase());
        const removedSizes = originalSizes.filter(size => !upperNewSizes.includes(size));
        if (removedSizes.length > 0) {
            Modal.confirm({
                title: 'Confirm Size Changes',
                content: `You are about to remove the following sizes: ${removedSizes.join(', ')}. This will remove related variants from the stock.`,
                okText: 'Confirm',
                cancelText: 'Cancel',
                onOk() {
                    setFormData(prev => ({
                        ...prev,
                        sizes: upperNewSizes,
                    }));
                    setOriginalSizes([...upperNewSizes]);
                    setVariants(prevVariants => prevVariants.filter(variant => !removedSizes.includes(variant.size)));
                },
            });
        } else {
            setFormData(prev => ({
                ...prev,
                sizes: upperNewSizes,
            }));
            setOriginalSizes([...upperNewSizes]);
        }
    };

    /**
     * Handle changes to the colors selection.
     * @param {Array} newColors - The new colors selected.
     */
    const handleColorsChange = (newColors) => {
        const upperNewColors = newColors.map(color => color.toUpperCase());
        const removedColors = originalColors.filter(color => !upperNewColors.includes(color));
        if (removedColors.length > 0) {
            Modal.confirm({
                title: 'Confirm Color Changes',
                content: `You are about to remove the following colors: ${removedColors.join(', ')}. This will remove related variants from the stock.`,
                okText: 'Confirm',
                cancelText: 'Cancel',
                onOk() {
                    setFormData(prev => ({
                        ...prev,
                        colors: upperNewColors,
                    }));
                    setOriginalColors([...upperNewColors]);
                    setVariants(prevVariants => prevVariants.filter(variant => !removedColors.includes(variant.color)));
                },
            });
        } else {
            setFormData(prev => ({
                ...prev,
                colors: upperNewColors,
            }));
            setOriginalColors([...upperNewColors]);
        }
    };

    /**
     * Handle replacing an existing product image.
     * @param {File} file - The new image file.
     * @param {number|string} imageId - The ID of the image to replace.
     */
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

    /**
     * Handle deleting a product image.
     * @param {number|string} imageId - The ID of the image to delete.
     */
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

    /**
     * Handle adding a new image to the product.
     * @param {File} file - The new image file.
     * @returns {boolean} - False to prevent automatic upload.
     */
    const handleAddImage = (file) => {
        if (productImages.length >= 6) {
            openErrorNotification("You can only upload a maximum of 5 images");
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setProductImages(prev => [
                ...prev,
                { id: Date.now(), url: e.target.result, newFile: file },
            ]);
            message.success('Image added successfully');
        };
        reader.readAsDataURL(file);
        return false;
    };

    /**
     * Group variants by size and color.
     */
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
                variant_id: variant.variant_id,
                image: variant.image,
            });
        });
        return Object.values(groupMap);
    }, [variants]);

    /**
     * Filter grouped variants based on selected sizes and colors.
     */
    const filteredGroupedVariants = useMemo(() => {
        return groupedVariants.filter(variant => {
            const sizeMatch = filterSizes.length > 0 ? filterSizes.includes(variant.size) : true;
            const colorMatch = filterColors.length > 0 ? filterColors.includes(variant.color) : true;
            return sizeMatch && colorMatch;
        });
    }, [groupedVariants, filterSizes, filterColors]);

    /**
     * Calculate the total quantity of all filtered variants.
     */
    const totalQuantity = useMemo(() => {
        return filteredGroupedVariants.reduce((acc, variant) => acc + variant.totalQuantity, 0);
    }, [filteredGroupedVariants]);

    /**
     * Handle changes to the quantity of a specific stock variant.
     * @param {number} value - The new quantity value.
     * @param {Object} record - The stock record.
     * @param {string} parentKey - The key of the parent variant group.
     */
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

    /**
     * Update variant quantities in the backend.
     */
    const updateVariants = async () => {
        if (variants.length === 0) return;
        const variantsToUpdate = variants.map(variant => ({
            id: variant.variant_id,
            quantity: variant.quantity,
        }));
        try {
            const response = await API.put('product/update_stock_variants/', variantsToUpdate, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                message.success('Variants updated successfully.');
            }
        } catch (error) {
            console.error('Error updating variants:', error);
            if (error.response && error.response.data) {
                const filteredErrors = error.response.data.filter(err => {
                    return !err.id || !err.id.includes("StockVariant with this ID does not exist.");
                });
                if (filteredErrors.length > 0) {
                    message.error(`Error: ${JSON.stringify(filteredErrors)}`);
                }
            } else {
                message.error('There was an error updating the variants.');
            }
        }
    };

    /**
     * Update variant images in the backend.
     */
    const updateVariantImages = async () => {
        const variantsToUpdateImage = variants.filter(v => v.newImageFile);
        for (const variant of variantsToUpdateImage) {
            const fd = new FormData();
            fd.append('image', variant.newImageFile);
            fd.append('quantity', variant.quantity);
            try {
                await API.put(`product/stock-variants/${variant.variant_id}/`, fd, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } catch (err) {
                console.error('Error updating variant image:', err);
            }
        }
    };

    /**
     * Handle form submission to update the product.
     */
    const handleSubmit = async () => {
        setLoading(true);
        const requiredFields = ['name', 'slug', 'category', 'price', 'status'];
        for (let field of requiredFields) {
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
            } else if (key === 'tags') {
                if (formData[key] && formData[key].length > 0) {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                }
            } else {
                if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });

        const formattedVariants = groupedVariants.map(group => ({
            size: group.size,
            color: group.color,
            stocks: group.stocks.map(stock => ({
                stock_id: stock.stock_id,
                quantity: stock.quantity,
            })),
        }));
        formDataToSend.append('variants', JSON.stringify(formattedVariants));

        productImages.forEach((img) => {
            if (img.newFile && img.id) {
                formDataToSend.append('replaced_image_id[]', img.id);
                formDataToSend.append('images', img.newFile);
            }
            if (img.newFile && !img.id) {
                formDataToSend.append('images', img.newFile);
            }
        });

        try {
            const response = await API.put(`product/detail/${id}/`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                await updateVariants();
                await updateVariantImages();
                openSuccessNotification('Product updated successfully');
                navigate(-1);
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

    const isDisabled = formData.status === 'INACTIVE';

    const tabItems = [
        {
            key: '1',
            label: 'Basic Information',
            children: (
                <BasicInformation
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSizesChange={handleSizesChange}
                    handleColorsChange={handleColorsChange}
                    isDisabled={isDisabled}
                />
            ),
        },
        {
            key: '2',
            label: 'Inventory Details',
            children: (
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
                    isDisabled={isDisabled}
                />
            ),
        },
        {
            key: '3',
            label: 'Sales Details',
            children: (
                <SalesDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                    isDisabled={isDisabled}
                />
            ),
        },
        {
            key: '4',
            label: 'Image Management',
            children: (
                <ImageManagement
                    productImages={productImages}
                    handleReplaceImage={handleReplaceImage}
                    handleDeleteImage={handleDeleteImage}
                    handleAddImage={handleAddImage}
                    isDisabled={isDisabled}
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
                        <Col span={24}>
                            <Row gutter={[16, 16]} justify="center">
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>
                                        Product Name<span style={{ color: 'red' }}>*</span>
                                    </Title>
                                    <Input
                                        value={formData.name}
                                        name="name"
                                        onChange={handleInputChange}
                                        placeholder="Enter product name"
                                        size="middle"
                                        disabled={isDisabled}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>
                                        Slug<span style={{ color: 'red' }}>*</span>
                                    </Title>
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
                                        disabled={isDisabled}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>
                                        Category<span style={{ color: 'red' }}>*</span>
                                    </Title>
                                    <Select
                                        value={formData.category}
                                        onChange={(value) => setFormData({ ...formData, category: value })}
                                        placeholder="Select Category"
                                        style={{ width: '100%' }}
                                        size="middle"
                                        disabled={isDisabled}
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

                    <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} items={tabItems} />

                    <Row justify="end" style={{ marginTop: '20px' }}>
                        <Space>
                            <Button type="primary" onClick={handleSubmit} loading={loading}>
                                Update Product
                            </Button>
                            <Button
                                type="default"
                                onClick={() => navigate(-1)}
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
