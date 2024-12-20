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

function customSlugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const EditProduct = () => {
    const { id } = useParams();
    const { userData, logout } = useUserContext();
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

    const [variantImages, setVariantImages] = useState({});

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

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await API.get(`product/detail/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            const productData = response.data;
            const sizes = productData.sizes ? productData.sizes.split(',').map(s => s.trim().toUpperCase()) : [];
            const colors = productData.colors ? productData.colors.split(',').map(c => c.trim().toUpperCase()) : [];

            setOriginalSizes([...sizes]);
            setOriginalColors([...colors]);

            const generatedSlug = productData.name ? customSlugify(productData.name) : productData.slug || '';

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
                start_sale_date: productData.start_sale_date ? productData.start_sale_date.split('T')[0] : '',
                end_sale_date: productData.end_sale_date ? productData.end_sale_date.split('T')[0] : '',
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
            setProductImages(imgs.map(img => ({
                id: img.id,
                url: img.image,
                newFile: null
            })));

            const stockVariants = productData.stock_variants || [];
            const variantsArray = stockVariants.map(variant => {
                if (!variant.variant_name) {
                    return null;
                }
                const parts = variant.variant_name.split(' - ');
                if (parts.length !== 2) {
                    return null;
                }
                const [size, color] = parts;
                return {
                    key: variant.id,
                    variant_id: variant.id,
                    size: size.trim().toUpperCase(),
                    color: color.trim().toUpperCase(),
                    stock_id: variant.stock.id,
                    stock_name: variant.stock.name,
                    quantity: variant.quantity,
                    image: variant.image || null,
                };
            }).filter(variant => variant !== null); 
            setVariants(variantsArray);

            const variantImagesMap = {};
            colors.forEach(color => {
                const variantWithColorAndImage = stockVariants.find(variant => variant.variant_name && variant.variant_name.includes(color) && variant.image);
                if (variantWithColorAndImage) {
                    variantImagesMap[color] = {
                        id: variantWithColorAndImage.image.id,
                        url: variantWithColorAndImage.image.image,
                        newFile: null
                    };
                }
            });
            setVariantImages(variantImagesMap);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('Error fetching product:', error);
            openErrorNotification('Error fetching product.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await API.get('categories/');
            setCategories(response.data.results);
        } catch (error) {
            console.error('Error fetching categories:', error);
            openErrorNotification('Error fetching categories.');
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
            openErrorNotification('Error fetching stocks.');
            setLoadingStocks(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = (type === 'checkbox' ? checked : value);

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
        const removedSizes = originalSizes.filter(size => !upperNewSizes.includes(size));
        if (removedSizes.length > 0) {
            Modal.confirm({
                title: 'Xác Nhận Thay Đổi Sizes',
                content: `Bạn sắp xóa các kích thước: ${removedSizes.join(', ')}. Điều này sẽ xóa các biến thể liên quan khỏi kho.`,
                okText: 'Xác Nhận',
                cancelText: 'Hủy',
                onOk() {
                    setFormData(prev => ({
                        ...prev,
                        sizes: upperNewSizes
                    }));
                    setOriginalSizes([...upperNewSizes]);
                    setVariants(prevVariants => prevVariants.filter(variant => !removedSizes.includes(variant.size)));
                },
            });
        } else {
            setFormData(prev => ({
                ...prev,
                sizes: upperNewSizes
            }));
            setOriginalSizes([...upperNewSizes]);
        }
    };

    const handleColorsChange = (newColors) => {
        const upperNewColors = newColors.map(color => color.toUpperCase());
        const removedColors = originalColors.filter(color => !upperNewColors.includes(color));
        if (removedColors.length > 0) {
            Modal.confirm({
                title: 'Xác Nhận Thay Đổi Colors',
                content: `Bạn sắp xóa các màu sắc: ${removedColors.join(', ')}. Điều này sẽ xóa các biến thể liên quan khỏi kho.`,
                okText: 'Xác Nhận',
                cancelText: 'Hủy',
                onOk() {
                    setFormData(prev => ({
                        ...prev,
                        colors: upperNewColors
                    }));
                    setOriginalColors([...upperNewColors]);
                    setVariants(prevVariants => prevVariants.filter(variant => !removedColors.includes(variant.color)));
                    // Xóa hình ảnh biến thể cho các màu đã xóa
                    setVariantImages(prev => {
                        const updated = { ...prev };
                        removedColors.forEach(color => {
                            delete updated[color];
                        });
                        return updated;
                    });
                },
            });
        } else {
            setFormData(prev => ({
                ...prev,
                colors: upperNewColors
            }));
            setOriginalColors([...upperNewColors]);
        }
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
        message.success('Hình ảnh đã được thay thế thành công');
    };

    const handleDeleteImage = (imageId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa hình ảnh này?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk() {
                setProductImages(prevImages => prevImages.filter(img => img.id !== imageId));
                message.success('Hình ảnh đã được xóa thành công');
            },
        });
    };

    const handleAddImage = (file) => {
        if (productImages.length >= 5) {
            openErrorNotification("Bạn chỉ có thể tải lên tối đa 5 hình ảnh.");
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setProductImages(prev => [...prev, { id: Date.now(), url: e.target.result, newFile: file }]);
            message.success('Hình ảnh đã được thêm thành công');
        };
        reader.readAsDataURL(file);
        return false; // Ngăn không upload tự động
    };

    // Handlers cho variantImages
    const handleReplaceVariantImage = (file, variant) => {
        if (!file) return;
        setVariantImages(prev => ({
            ...prev,
            [variant.variant_name]: {
                ...prev[variant.variant_name],
                newFile: file,
                url: URL.createObjectURL(file)
            }
        }));
        message.success(`Hình ảnh cho ${variant.variant_name} đã được thay thế thành công`);
    };

    const handleDeleteVariantImage = (variant) => {
        confirm({
            title: `Bạn có chắc chắn muốn xóa hình ảnh cho ${variant.variant_name}?`,
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk() {
                setVariantImages(prev => ({
                    ...prev,
                    [variant.variant_name]: {
                        ...prev[variant.variant_name],
                        url: '',
                        newFile: null,
                        id: null
                    }
                }));
                message.success(`Hình ảnh cho ${variant.variant_name} đã được xóa thành công`);
            },
        });
    };

    const handleAddVariantImage = (file, variant) => {
        if (!file) return;
        setVariantImages(prev => ({
            ...prev,
            [variant.variant_name]: {
                id: Date.now(), // Temporary ID for frontend
                url: URL.createObjectURL(file),
                newFile: file
            }
        }));
        message.success(`Hình ảnh cho ${variant.variant_name} đã được thêm thành công`);
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

    const handleSubmit = async () => {
        setLoading(true);
        const requiredFields = ['name', 'slug', 'category', 'price', 'status'];
        for (let field of requiredFields) {
            if (!formData[field] || formData[field] === '') {
                openErrorNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} là bắt buộc.`);
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
                // image: variantImages[group.color]?.id || null, // Image handling deferred to ImageManagement
            })),
        }));
        formDataToSend.append('variants', JSON.stringify(formattedVariants));

        // Append hình ảnh sản phẩm
        productImages.forEach((img) => {
            if (img.newFile && img.id) {
                formDataToSend.append('images', img.newFile);
                formDataToSend.append('replaced_image_id', img.id);
            }
            if (img.newFile && !img.id) {
                formDataToSend.append('images', img.newFile);
            }
        });

        // Append hình ảnh biến thể
        Object.entries(variantImages).forEach(([variantName, img]) => {
            if (img.newFile && img.id) {
                formDataToSend.append('images', img.newFile);
                formDataToSend.append('replaced_image_id', img.id);
                // Optionally, include color information if backend supports it
                // Example: formDataToSend.append(`variant_images[${color}]`, img.newFile);
            }
            if (img.newFile && !img.id) {
                formDataToSend.append('images', img.newFile);
                // Optionally, include color information if backend supports it
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
                // Update variants with new image IDs if applicable
                // This depends on backend handling
                openSuccessNotification('Sản phẩm đã được cập nhật thành công');
                navigate('/products');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('Có lỗi xảy ra khi cập nhật sản phẩm:', error);
            openErrorNotification('Có lỗi xảy ra khi cập nhật sản phẩm.');
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = formData.status === 'INACTIVE';

    const tabItems = [
        {
            key: '1',
            label: 'Thông Tin Cơ Bản',
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
            label: 'Chi Tiết Kho Hàng',
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
            label: 'Chi Tiết Bán Hàng',
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
            label: 'Quản Lý Hình Ảnh',
            children: (
                <ImageManagement
                    productImages={productImages}
                    handleReplaceImage={handleReplaceImage}
                    handleDeleteImage={handleDeleteImage}
                    handleAddImage={handleAddImage}
                    variantImages={variantImages}
                    handleReplaceVariantImage={handleReplaceVariantImage}
                    handleDeleteVariantImage={handleDeleteVariantImage}
                    handleAddVariantImage={handleAddVariantImage}
                    originalColors={originalColors}
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
                                onClick={() => navigate('/products')}
                            >
                                Quay lại
                            </Button>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[16, 16]} justify="center">
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>Tên Sản Phẩm<span style={{color: 'red'}}>*</span></Title>
                                    <Input
                                        value={formData.name}
                                        name="name"
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên sản phẩm"
                                        size="middle"
                                        disabled={isDisabled}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>Slug<span style={{color: 'red'}}>*</span></Title>
                                    <Input
                                        value={formData.slug}
                                        name="slug"
                                        placeholder="Slug được tự động tạo"
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
                                        placeholder="Nhập SKU (tùy chọn)"
                                        size="middle"
                                        disabled={isDisabled}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={6}>
                                    <Title level={4}>Danh Mục<span style={{color: 'red'}}>*</span></Title>
                                    <Select
                                        value={formData.category}
                                        onChange={(value) => setFormData({ ...formData, category: value })}
                                        placeholder="Chọn Danh Mục"
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
                                Cập Nhật Sản Phẩm
                            </Button>
                            <Button
                                type="default"
                                onClick={() => navigate('/products')}
                            >
                                Hủy
                            </Button>
                        </Space>
                    </Row>
                </Card>
            )}
        </div>
    );

};

export default EditProduct;
