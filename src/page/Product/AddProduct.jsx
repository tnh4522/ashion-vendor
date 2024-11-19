import {useEffect, useState} from 'react';
import {Table, Input, Button, Card, Form} from 'antd';
import {CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons'; // Import các biểu tượng từ Ant Design
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {useNavigate} from "react-router-dom";

const AddProduct = () => {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        user: userData.id,
        sku: '',
        barcode: '',
        brand: '',
        description: '',
        material: '',
        care_instructions: '',
        category: '',
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
        main_image: null,
        video_url: '',
        meta_title: '',
        meta_description: '',
    });

    const [categories, setCategories] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loadingStocks, setLoadingStocks] = useState(true);
    const [stockPagination, setStockPagination] = useState({
        current: 1,
        pageSize: 3,
    });

    // State để kiểm soát việc thu gọn/mở rộng các card
    const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
    const [isInventoryDetailsOpen, setIsInventoryDetailsOpen] = useState(true);
    const [isSalesDetailsOpen, setIsSalesDetailsOpen] = useState(true);

    const handleToggleSection = (section) => {
        if (section === 'basicInfo') {
            setIsBasicInfoOpen(!isBasicInfoOpen);
        } else if (section === 'inventoryDetails') {
            setIsInventoryDetailsOpen(!isInventoryDetailsOpen);
        } else if (section === 'salesDetails') {
            setIsSalesDetailsOpen(!isSalesDetailsOpen);
        }
    };

    const handleChange = (e) => {
        const {name, value, type, checked, multiple, options} = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if (multiple) {
            const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
            setFormData({
                ...formData,
                [name]: selectedOptions,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleImageChange = (e) => {
        setFormData({...formData, main_image: e.target.files[0]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== '') {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await API.post('products/create/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            if (response.status === 201) {
                openSuccessNotification('Product added successfully');
                navigate('/products');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            console.error('There was an error adding the product:', error);
            openErrorNotification('There was an error adding the product');
        }
    };

    const handleStockUpdate = async (record, field, value) => {
        const updatedStocks = stocks.map((stock) =>
            stock.id === record.id ? {...stock, [field]: value} : stock
        );
        setStocks(updatedStocks);

        try {
            await API.patch(`stocks/${record.id}/`, {[field]: value}, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            openSuccessNotification('Stock updated successfully');
        } catch (error) {
            console.error('Error updating stock:', error);
            openErrorNotification('There was an error updating the stock');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('categories/');
                setCategories(response.data.results);
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
                setStocks(response.data.results.sort((a, b) => b.quantity - a.quantity));
                setLoadingStocks(false);
            } catch (error) {
                console.error('Error fetching stocks:', error);
                openErrorNotification('There was an error fetching the stock data.');
                setLoadingStocks(false);
            }
        };

        fetchCategories();
        fetchStocks();
    }, []);

    const stockColumns = [
        {
            title: 'Stock Name',
            dataIndex: 'name',
            width: '25%',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '25%',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            width: '15%',
            render: (text, record) => (
                <Input
                    type="number"
                    value={record.quantity}
                    onChange={(e) => handleStockUpdate(record, 'quantity', e.target.value)}
                />
            ),
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            width: '25%',
            render: (text, record) => (
                <Input
                    type="text"
                    value={record.notes}
                    onChange={(e) => handleStockUpdate(record, 'notes', e.target.value)}
                />
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        setStockPagination(pagination);
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <Card
                        title={
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="text-primary">Basic Information</h2>
                                <Button
                                    type="link"
                                    onClick={() => handleToggleSection('basicInfo')}
                                    icon={isBasicInfoOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                />
                            </div>
                        }
                        bordered={false}
                        style={{ marginBottom: '20px' }}
                    >
                        {isBasicInfoOpen && (
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="name" className="form-label">Product Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="main_image" className="form-label">Main Image</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="main_image"
                                        name="main_image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card
                        title={
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="text-primary">Inventory Details</h2>
                                <Button
                                    type="link"
                                    onClick={() => handleToggleSection('inventoryDetails')}
                                    icon={isInventoryDetailsOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                />
                            </div>
                        }
                        bordered={false}
                        style={{ marginBottom: '20px' }}
                    >
                        {isInventoryDetailsOpen && (
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="sku" className="form-label">SKU</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="sku"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="weight" className="form-label">Weight (kg)</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        step="0.01"
                                        id="weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="dimensions" className="form-label">Dimensions</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="dimensions"
                                        name="dimensions"
                                        value={formData.dimensions}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <h6 className="mt-3">Stock Information</h6>
                                    <Table
                                        columns={stockColumns}
                                        dataSource={stocks}
                                        rowKey={(record) => record.id}
                                        loading={loadingStocks}
                                        pagination={{
                                            ...stockPagination,
                                            onChange: handleTableChange,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card
                        title={
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="text-primary">Sales Details</h2>
                                <Button
                                    type="link"
                                    onClick={() => handleToggleSection('salesDetails')}
                                    icon={isSalesDetailsOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                />
                            </div>
                        }
                        bordered={false}
                    >
                        {isSalesDetailsOpen && (
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="sale_price" className="form-label">Sale Price</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        id="sale_price"
                                        name="sale_price"
                                        value={formData.sale_price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="start_sale_date" className="form-label">Start Sale Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        id="start_sale_date"
                                        name="start_sale_date"
                                        value={formData.start_sale_date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="end_sale_date" className="form-label">End Sale Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        id="end_sale_date"
                                        name="end_sale_date"
                                        value={formData.end_sale_date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="DRAFT">Draft</option>
                                    </select>
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
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="is_featured">
                                            Featured Product
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="mt-4 text-end">
                        <button type="submit" className="btn btn-primary me-2">Add Product</button>
                        <button type="reset" className="btn btn-outline-secondary">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
