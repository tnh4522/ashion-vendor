// AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Steps,
    Modal,
    Typography,
    Row,
    Col,
    Card,
    Select,
    message,
    Spin,
    Input, // Đã thêm Input vào import
} from 'antd';
import {
    ArrowLeftOutlined,
} from '@ant-design/icons';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";

import BasicInformation from './components/BasicInformation.jsx';
import AddInventoryDetails from './components/AddInventoryDetails.jsx';
import SalesDetails from './components/SalesDetails.jsx';
import AddImageManagement from './components/AddImageManagement.jsx';

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const { Step } = Steps;

// Hàm chuyển đổi chuỗi thành slug
function customSlugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const AddProduct = () => {
    const { userData, logout } = useUserContext();
    const { openSuccessNotification, openErrorNotification } = useNotificationContext();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
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

    // State cho hình ảnh biến thể, key là tên biến thể (color)
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

    const [createdProduct, setCreatedProduct] = useState(null); // Lưu thông tin sản phẩm đã tạo

    useEffect(() => {
        fetchCategories();
        fetchStocks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData.access]);

    // Hàm lấy danh mục sản phẩm
    const fetchCategories = async () => {
        try {
            const response = await API.get('categories/');
            setCategories(response.data.results);
        } catch (error) {
            console.error('Error fetching categories:', error);
            openErrorNotification('Có lỗi xảy ra khi lấy danh mục.');
        }
    };

    // Hàm lấy dữ liệu kho hàng
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
            openErrorNotification('Có lỗi xảy ra khi lấy dữ liệu kho.');
            setLoadingStocks(false);
        }
    };

    // Hàm xử lý thay đổi input
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

    // Hàm xử lý thay đổi sizes
    const handleSizesChange = (newSizes) => {
        const upperNewSizes = newSizes.map(size => size.toUpperCase());
        const removedSizes = originalSizes.filter(size => !upperNewSizes.includes(size));
        if (removedSizes.length > 0) {
            Modal.confirm({
                title: 'Xác Nhận Thay Đổi Kích Thước',
                content: `Bạn sắp xóa các kích thước: ${removedSizes.join(', ')}. Điều này sẽ xóa các biến thể liên quan trong kho.`,
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

    // Hàm xử lý thay đổi colors
    const handleColorsChange = (newColors) => {
        const upperNewColors = newColors.map(color => color.toUpperCase());
        const removedColors = originalColors.filter(color => !upperNewColors.includes(color));
        if (removedColors.length > 0) {
            Modal.confirm({
                title: 'Xác Nhận Thay Đổi Màu Sắc',
                content: `Bạn sắp xóa các màu sắc: ${removedColors.join(', ')}. Điều này sẽ xóa các biến thể liên quan trong kho.`,
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

    // Hàm xử lý thay thế hình ảnh sản phẩm
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

    // Hàm xử lý xóa hình ảnh sản phẩm
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

    // Hàm xử lý thêm hình ảnh sản phẩm
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

    // Hàm xử lý thay thế hình ảnh biến thể
    const handleReplaceVariantImage = (file, color) => {
        if (!file) return;
        setVariantImages(prev => ({
            ...prev,
            [color]: {
                ...prev[color],
                newFile: file,
                url: URL.createObjectURL(file)
            }
        }));
        message.success(`Hình ảnh cho ${color} đã được thay thế thành công`);
    };

    // Hàm xử lý xóa hình ảnh biến thể
    const handleDeleteVariantImage = (color) => {
        confirm({
            title: `Bạn có chắc chắn muốn xóa hình ảnh cho ${color}?`,
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk() {
                setVariantImages(prev => ({
                    ...prev,
                    [color]: {
                        ...prev[color],
                        url: '',
                        newFile: null,
                        id: null
                    }
                }));
                message.success(`Hình ảnh cho ${color} đã được xóa thành công`);
            },
        });
    };

    // Hàm xử lý thêm hình ảnh cho biến thể
    const handleAddVariantImage = (file, color) => {
        if (variantImages[color]) {
            message.error(`Biến thể ${color} đã có hình ảnh. Vui lòng thay thế hình ảnh hiện tại.`);
            return false;
        }
        setVariantImages(prev => ({
            ...prev,
            [color]: {
                id: Date.now(), // Temporary ID for frontend
                url: URL.createObjectURL(file),
                newFile: file
            }
        }));
        message.success(`Hình ảnh cho ${color} đã được thêm thành công`);
        return false; // Ngăn không upload tự động
    };

    // Các bước trong quy trình thêm sản phẩm
    const steps = [
        {
            title: 'Thông Tin Cơ Bản',
            content: (
                <BasicInformation
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSizesChange={handleSizesChange}
                    handleColorsChange={handleColorsChange}
                    isDisabled={false}
                />
            ),
        },
        {
            title: 'Chi Tiết Kho Hàng',
            content: (
                <AddInventoryDetails
                    variants={variants}
                    setVariants={setVariants}
                    variantImages={variantImages}
                    setVariantImages={setVariantImages}
                    isDisabled={false}
                />
            ),
        },
        {
            title: 'Chi Tiết Bán Hàng',
            content: (
                <SalesDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                    isDisabled={false}
                />
            ),
        },
        {
            title: 'Quản Lý Hình Ảnh',
            content: (
                <AddImageManagement
                    productImages={productImages}
                    handleReplaceImage={handleReplaceImage}
                    handleDeleteImage={handleDeleteImage}
                    handleAddImage={handleAddImage}
                    variantImages={variantImages}
                    handleReplaceVariantImage={handleReplaceVariantImage}
                    handleDeleteVariantImage={handleDeleteVariantImage}
                    handleAddVariantImage={handleAddVariantImage}
                    originalColors={originalColors}
                    isDisabled={false}
                />
            ),
        },
    ];

    // Hàm tiếp theo
    const next = async () => {
        // Validate bước hiện tại trước khi tiếp tục
        if (await validateStep(currentStep)) {
            if (currentStep === 0) {
                // Tạo sản phẩm khi ở bước 1
                setLoading(true);
                try {
                    const payload = {
                        ...formData,
                        sizes: formData.sizes.join(','),
                        colors: formData.colors.join(','),
                    };
                    const response = await API.post('product/create/', payload, {
                        headers: {
                            'Authorization': `Bearer ${userData.access}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.status === 201) {
                        setCreatedProduct(response.data);
                        setVariants(response.data.stock_variants || []); // Giả định backend trả về stock_variants
                        message.success('Sản phẩm đã được tạo thành công. Bây giờ hãy cấu hình các biến thể.');
                        setCurrentStep(currentStep + 1);
                    }
                } catch (error) {
                    console.error('Lỗi khi tạo sản phẩm:', error);
                    openErrorNotification('Có lỗi xảy ra khi tạo sản phẩm.');
                } finally {
                    setLoading(false);
                }
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    // Hàm quay lại
    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    // Hàm validate mỗi bước
    const validateStep = async (step) => {
        // Implement validation logic based on step
        switch (step) {
            case 0:
                // Validation cho Thông Tin Cơ Bản
                if (
                    !formData.name ||
                    !formData.slug ||
                    !formData.category ||
                    formData.sizes.length === 0 ||
                    formData.colors.length === 0
                ) {
                    openErrorNotification('Vui lòng điền đầy đủ các trường bắt buộc trong Thông Tin Cơ Bản.');
                    return false;
                }
                return true;
            case 1:
                // Validation cho Chi Tiết Kho Hàng
                // Đảm bảo rằng các biến thể có số lượng hợp lệ
                if (variants.length === 0) {
                    openErrorNotification('Không có biến thể nào để cấu hình.');
                    return false;
                }
                for (let variant of variants) {
                    if (variant.quantity === undefined || variant.quantity === null || variant.quantity < 0) {
                        openErrorNotification(`Vui lòng nhập số lượng hợp lệ cho biến thể ${variant.size} - ${variant.color}.`);
                        return false;
                    }
                }
                return true;
            case 2:
                // Validation cho Chi Tiết Bán Hàng
                if (!formData.price) {
                    openErrorNotification('Vui lòng nhập giá bán trong Chi Tiết Bán Hàng.');
                    return false;
                }
                if (formData.sale_price && parseFloat(formData.sale_price) >= parseFloat(formData.price)) {
                    openErrorNotification('Giá khuyến mãi phải nhỏ hơn giá bán.');
                    return false;
                }
                return true;
            case 3:
                // Validation cho Quản Lý Hình Ảnh
                if (productImages.length === 0) {
                    openErrorNotification('Vui lòng thêm ít nhất một hình ảnh sản phẩm.');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    // Hàm xử lý gửi dữ liệu cuối cùng
    const handleSubmit = async () => {
        // Validate bước hiện tại
        if (await validateStep(currentStep)) {
            setLoading(true);
            try {
                const formDataToSend = new FormData();

                // Append tất cả các trường formData
                Object.keys(formData).forEach((key) => {
                    if (key === 'sizes' || key === 'colors') {
                        formDataToSend.append(key, formData[key].join(','));
                    } else {
                        if (formData[key] !== null && formData[key] !== '') {
                            formDataToSend.append(key, formData[key]);
                        }
                    }
                });

                // Append hình ảnh sản phẩm
                productImages.forEach((img) => {
                    if (img.newFile) {
                        formDataToSend.append('images', img.newFile);
                        if (img.id) {
                            formDataToSend.append('replaced_image_id', img.id);
                        }
                    }
                });

                // Append hình ảnh biến thể
                Object.entries(variantImages).forEach(([color, img]) => {
                    if (img.newFile) {
                        formDataToSend.append('variant_images', img.newFile);
                        if (img.id) {
                            formDataToSend.append('variant_replaced_image_id', img.id);
                        }
                    }
                });

                // Append các biến thể với số lượng đã cập nhật
                const updatedVariants = variants.map(variant => ({
                    id: variant.variant_id,
                    quantity: variant.quantity,
                }));
                formDataToSend.append('variants', JSON.stringify(updatedVariants));

                // Gửi yêu cầu cập nhật sản phẩm
                const response = await API.put(`product/detail/${createdProduct.id}/`, formDataToSend, {
                    headers: {
                        'Authorization': `Bearer ${userData.access}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });

                if (response.status === 200) {
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
        }
    };

    // Kiểm tra trạng thái có bị vô hiệu hóa không
    const isDisabled = formData.status === 'INACTIVE';

    // Các bước trong quy trình thêm sản phẩm
    const stepsContent = [
        {
            title: 'Thông Tin Cơ Bản',
            content: (
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
            title: 'Chi Tiết Kho Hàng',
            content: (
                <AddInventoryDetails
                    variants={variants}
                    setVariants={setVariants}
                    variantImages={variantImages}
                    setVariantImages={setVariantImages}
                    isDisabled={isDisabled}
                />
            ),
        },
        {
            title: 'Chi Tiết Bán Hàng',
            content: (
                <SalesDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                    isDisabled={isDisabled}
                />
            ),
        },
        {
            title: 'Quản Lý Hình Ảnh',
            content: (
                <AddImageManagement
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
            <Card bordered={false} style={{ borderRadius: '8px' }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                    <Col>
                        <Button
                            type="link"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/products')}
                        >
                            Quay lại Sản phẩm
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
                                    disabled={currentStep > 0}
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
                                    disabled={currentStep > 0}
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
                                    disabled={currentStep > 0}
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

                <Steps current={currentStep} style={{ marginBottom: '20px' }}>
                    {stepsContent.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div className="steps-content" style={{ minHeight: '300px' }}>
                    {stepsContent[currentStep].content}
                </div>

                <div className="steps-action" style={{ marginTop: '20px' }}>
                    {currentStep > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Quay lại
                        </Button>
                    )}
                    {currentStep < stepsContent.length - 1 && (
                        <Button type="primary" onClick={() => next()} disabled={loading}>
                            Tiếp theo
                        </Button>
                    )}
                    {currentStep === stepsContent.length - 1 && (
                        <Button type="primary" loading={loading} onClick={handleSubmit}>
                            Hoàn tất
                        </Button>
                    )}
                    {loading && <Spin style={{ marginLeft: '10px' }} />}
                </div>
            </Card>
        </div>
    );

};

export default AddProduct;
