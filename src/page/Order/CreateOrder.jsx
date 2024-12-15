import {useState, useEffect} from 'react';
import API from "../../service/service.jsx";
import useUserContext from "../../hooks/useUserContext.jsx";
import useNotificationContext from "../../hooks/useNotificationContext.jsx";
import {useNavigate} from "react-router-dom";
import {Modal, Button, Select} from 'antd';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import SelectProduct from "./SelectProduct.jsx";
import SelectCustomer from "./SelectCustomer.jsx";
import {paymentMethods, shippingMethods} from '../../utils/Constant';
import CreateCustomer from "./CreateCustomer.jsx";
import {getDistrictInformation, getWardInformation, GTTK_TOKEN, SHOP_ID} from "../../component/Helper.jsx";
import provincesData from "../../constant/province.json";
import axios from "axios";
import formatCurrency from "../../constant/formatCurrency.js";
import processPayment from "../../constant/processPayment.js";

const {Option} = Select;

const CreateOrder = () => {
    const {userData, logout} = useUserContext();
    const {openSuccessNotification, openErrorNotification} = useNotificationContext();
    const navigate = useNavigate();
    const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);
    const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        province: '',
        district: '',
        ward: '',
        street_address: '',
    });
    const [billingAddress, setBillingAddress] = useState({
        city: '',
        country: 'Vietnam',
        postal_code: '',
        street_address: '',
    });

    const [orderData, setOrderData] = useState({
        customer: '',
        subtotal_price: 0,
        shipping_cost: 0,
        discount_amount: 0,
        tax_amount: 0,
        total_price: 0,
        total_weight: 0,
        shipping_address: '',
        billing_address: '',
        shipping_method: 'EXPRESS',
        payment_method: 'BANK_TRANSFER',
        note: '',
        items: [
            {
                product: '',
                quantity: 1,
                price: 0,
                total_price: 0,
                size: '',
                color: ''
            }
        ],
    });



    const [shippingTotal, setShippingTotal] = useState(0);
    const [serviceID, setServiceID] = useState(null);

    useEffect(() => {
        const haveProduct = orderData.items.some(item => item.product !== '');

        const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const discount = orderData.discount_amount || 0;

        if (orderData.shipping_method !== 'NONE' && shippingAddress.district && haveProduct) {
            axios.get('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', {
                headers: {
                    'token': GTTK_TOKEN,
                },
                params: {
                    shop_id: SHOP_ID,
                    from_district: 1530,
                    to_district: parseInt(shippingAddress.district),
                },
            }).then(response => {
                setServiceID(response.data.data[0].service_id)
            }).catch(error => {
                console.error('Error fetching available service:', error);
            });

            if (serviceID) {
                axios.post(
                    'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                    {
                        "service_id": serviceID,
                        "insurance_value": subtotal,
                        "coupon": null,
                        "from_district_id": 1530,
                        "to_district_id": parseInt(shippingAddress.district),
                        "to_ward_code": shippingAddress.ward,
                        "height": 10,
                        "length": 15,
                        "weight": 200,
                        "width": 15
                    },
                    {
                        headers: {
                            'token': GTTK_TOKEN,
                            'shop_id': SHOP_ID
                        }
                    }
                ).then(response => {
                    setShippingTotal(response.data.data.total)
                }).catch(error => {
                    console.error('Error fetching available service:', error);
                });
            }
        } else {
            setShippingTotal(0);
        }

        setOrderData(prev => ({
            ...prev,
            subtotal_price: subtotal,
            tax_amount: tax,
            shipping_cost: shippingTotal,
            total_price: subtotal + tax + shippingTotal - discount
        }));

    }, [orderData.items, selectedCustomer, orderData.shipping_method, shippingAddress.district, orderData.discount_amount, shippingAddress.ward, serviceID, shippingTotal]);

    const showCustomerModal = async () => {
        setIsCustomerModalVisible(true);
    };

    const showProductModal = async (index) => {
        setSelectedProductIndex(index);
        setIsProductModalVisible(true);
    }

    const showAddCustomerModal = async () => {
        setIsAddCustomerModalVisible(true);
    }

    const handleCustomerSelect = async (customer) => {
        setSelectedCustomer(customer);
        setOrderData(prev => ({
            ...prev,
            customer: customer.id,
            shipping_address: customer.address.id,
            billing_address: customer.address.id
        }));

        setShippingAddress(customer.address);
        setBillingAddress(customer.address);

        setIsCustomerModalVisible(false);
        setIsAddCustomerModalVisible(false);
    };

    const handleProductSelect = (products) => {
        if (Array.isArray(products)) {
            const updatedItems = [...orderData.items];

            products.forEach((product, index) => {
                const targetIndex = selectedProductIndex + index;
                updatedItems[targetIndex] = {
                    ...updatedItems[targetIndex] || {},
                    product: product.id,
                    productName: product.name,
                    price: product.price,
                    total_price: product.price * (updatedItems[targetIndex]?.quantity || 1),
                    main_image: product.images[0]?.image || "",
                    variants: product.stock_variants || [],
                };
            });

            setOrderData({...orderData, items: updatedItems});
        }
        setIsProductModalVisible(false);
    };

    const renderVariant = (item, type) => {
        const result = [];

        item.variants.forEach(variant => {
            if (variant.variant_name) {
                const [size, color] = variant.variant_name.split(' - ');
                result[size] = [...result[size] || [], color];
            }
        });

        if (type === 'size') {
            return Object.keys(result);
        }

        return result[item.size] || [];
    }

    const handleOrderChange = (e) => {
        const {name, value} = e.target;
        setOrderData({
            ...orderData,
            [name]: value,
        });
    };

    const handleItemChange = (index, e) => {
        const {name, value} = e.target;
        const updatedItems = [...orderData.items];
        updatedItems[index][name] = value;

        if (name === 'quantity' || name === 'price') {
            updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].price;
        }

        setOrderData({...orderData, items: updatedItems});
    };

    const addItem = () => {
        setOrderData({
            ...orderData,
            items: [...orderData.items, {product: '', quantity: 1, price: ''}]
        });
    };

    const handlePayment = async (data) => {
        try {
            const paymentDetails = {
                amount: data.total_price,
                customer: {
                    email: selectedCustomer.email,
                    fullName: selectedCustomer.first_name + ' ' + selectedCustomer.last_name,
                    phone: selectedCustomer.phone_number,
                    countryCode: 'VN',
                    requestLang: 'vi-VN',
                },
                sourceCode: '4715',
                merchantTrns: data.order_number,
            };

            const response = await processPayment(paymentDetails);

            if (response.orderCode) {
                window.location.href = 'https://demo.vivapayments.com/web2?ref=' + response.orderCode;
            }
        } catch (err) {
            console.error('Error processing payment:', err);
            openErrorNotification('Error processing payment.');
        }
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('orders/create/', orderData, {
                headers: {
                    'Authorization': `Bearer ${userData.access}`,
                },
            });
            if (response.status === 201) {
                await handlePayment(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                openErrorNotification("Unauthorized access");
                logout();
                return;
            }
            openErrorNotification('There was an error creating the order');
        }
    };

    const removeItem = (index) => {
        const updatedItems = [...orderData.items];
        updatedItems.splice(index, 1);
        setOrderData({...orderData, items: updatedItems});
    };


    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');

    useEffect(() => {
        if (selectedCustomer) {
            const province = provincesData.data.find(
                item => item.ProvinceID === parseInt(shippingAddress.province, 10)
            );
            setProvinceName(province ? province.ProvinceName : 'Unknown');

            getDistrictInformation(shippingAddress.province)
                .then(districts => {
                    const district = districts.find(
                        item => item.DistrictID === parseInt(shippingAddress.district, 10)
                    );
                    setDistrictName(district ? district.DistrictName : 'Unknown');
                })
                .catch(err => {
                    console.error('Error fetching district:', err);
                    setDistrictName('Unknown');
                });

            getWardInformation(shippingAddress.district)
                .then(wards => {
                    const ward = wards.find(
                        item => item.WardCode === shippingAddress.ward
                    );
                    setWardName(ward ? ward.WardName : 'Unknown');
                })
                .catch(err => {
                    console.error('Error fetching ward:', err);
                    setWardName('Unknown');
                });
        } else {
            setProvinceName('');
            setDistrictName('');
            setWardName('');
        }
    }, [selectedCustomer, shippingAddress.province, shippingAddress.district, shippingAddress.ward]);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form id="formCreateOrder" method="POST" onSubmit={handleOrderSubmit}>
                                <div className="row">
                                    {/* Customer Selection */}
                                    <div className="mb-3 col-md-6">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label className="form-label"><i
                                                className="fa-solid fa-user mx-1"></i> Customer</label>
                                            <div>
                                                <Button type="button" className="btn-link"
                                                        onClick={showCustomerModal} icon={<SearchOutlined/>}>
                                                    Select Customer
                                                </Button>
                                                <Button type="button" className="btn-link"
                                                        onClick={showAddCustomerModal} icon={<PlusOutlined/>}>
                                                    Add Customer
                                                </Button>
                                            </div>
                                        </div>
                                        {selectedCustomer && (
                                            <div className="selected-customer-info mt-2 p-2 border rounded">
                                                <p className="mb-1">
                                                    Name: <strong>{selectedCustomer.first_name + ' ' + selectedCustomer.last_name}</strong>
                                                </p>
                                                <p className="mb-1">Email: <strong>{selectedCustomer.email}</strong></p>
                                                <p className="mb-1">Phone: <strong>{selectedCustomer.phone_number}</strong>
                                                </p>
                                                <p className="mb-0">Status: <strong>New Customer</strong></p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Addresses */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label"><i className="fa-solid fa-truck m-1"></i> Shipping
                                            Address</label>
                                        {selectedCustomer ? (
                                            <div className="selected-customer-info mt-2 p-2 border rounded">
                                                <p className="mb-1">
                                                    Province / City :<strong> {provinceName}</strong>
                                                </p>
                                                <p className="mb-1">
                                                    District / County :<strong> {districtName}</strong>
                                                </p>
                                                <p className="mb-1">
                                                    Ward / Village:<strong> {wardName}</strong>
                                                </p>
                                                <p className="mb-0">
                                                    Address :<strong> {shippingAddress.street_address}</strong>
                                                </p>
                                            </div>
                                        ) : (
                                            <textarea
                                                className="form-control"
                                                name="shipping_address"
                                                value={orderData.shipping_address}
                                                onChange={handleOrderChange}
                                                rows="3"
                                                required
                                            />
                                        )}
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label"><i
                                            className="fa-solid fa-cart-shopping m-1"></i> Order Items</label>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm ms-2"
                                            onClick={addItem}
                                        >
                                            + Add Item
                                        </button>
                                        {orderData.items.map((item, index) => (
                                            <div key={index} className="row mt-4">
                                                {item.main_image && (<div className="col-md-1">
                                                    <img
                                                        src={item.main_image}
                                                        alt="Product"
                                                        className="img-fluid rounded img-order-item"
                                                    />
                                                </div>)}
                                                <div className="col-md-3">
                                                    <label className="form-label">Product</label>
                                                    {item.productName ? (
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={item.productName}
                                                                readOnly
                                                            />
                                                        ) :
                                                        <Button icon={<SearchOutlined/>} type="button"
                                                                className="btn-link"
                                                                onClick={() => showProductModal(index)}>
                                                            Select Product From Inventory
                                                        </Button>
                                                    }
                                                </div>

                                                <div className="col-md-1">
                                                    <label className="form-label">Size</label>
                                                    <select
                                                        className="form-select"
                                                        name="size"
                                                        value={item.size}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                        required
                                                    >
                                                        <option value="">Select Size</option>
                                                        {item.variants && renderVariant(item, 'size').map((size, index) => (
                                                            <option key={index} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-1">
                                                    <label className="form-label">Color</label>
                                                    <select
                                                        className="form-select"
                                                        name="color"
                                                        value={item.color}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                        required
                                                    >

                                                        {item.variants && renderVariant(item, 'color').map((color, index) => (
                                                            <option key={index} value={color}>{color}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-1">
                                                    <label className="form-label">Qty</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        name="quantity"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Price</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        name="price"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                        required
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Total</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        value={item.total_price}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="col-md-1">
                                                    <label className="form-label">Remove</label>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping */}
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Shipping Method</label>
                                        <Select
                                            className="w-100"
                                            name="shipping_method"
                                            value={orderData.shipping_method}
                                            onChange={(value) => handleOrderChange({
                                                target: {
                                                    name: 'shipping_method',
                                                    value
                                                }
                                            })}
                                            required
                                        >
                                            {shippingMethods.map(method => (
                                                <Option key={method.value} value={method.value}>
                                                    {method.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>

                                    {orderData.shipping_method !== 'NONE' ? (
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Shipping Service</label>
                                            <Select
                                                className="w-100"
                                                name="shipping_service"
                                                required
                                                defaultValue="1"
                                            >
                                                <Option value="1">Giao hàng tiết kiệm</Option>
                                                <Option value="2">Giao hàng nhanh</Option>
                                                <Option value="3">Viettel Post</Option>
                                            </Select>
                                        </div>) : (
                                        <div className="mb-3 col-md-6"></div>
                                    )}

                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">Payment Method</label>
                                        <Select
                                            className="w-100"
                                            name='payment_method'
                                            value={orderData.payment_method}
                                            onChange={(value) => handleOrderChange({
                                                target: {
                                                    name: 'payment_method',
                                                    value
                                                }
                                            })}
                                            required
                                        >
                                            {paymentMethods.map(method => (
                                                <Option key={method.value} value={method.value}>
                                                    {method.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>

                                    {orderData.payment_method !== 'COD' ? (
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Module Payment</label>
                                            <Select
                                                className="w-100"
                                                name="module_payment"
                                                required
                                                defaultValue="1"
                                            >
                                                <Option value="1">Viva</Option>
                                            </Select>
                                        </div>
                                    ) : (<div className="mb-3 col-md-6"></div>)}

                                    {/* Order Summary */}
                                    <div className="col-md-12 m-2">
                                        <div className="row justify-content-end">
                                            <div className="col-md-6 mt-2">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h6 className="card-title">Order Summary</h6>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Subtotal:</span>
                                                            <span>{formatCurrency(orderData.subtotal_price)}</span>
                                                        </div>
                                                        {orderData.shipping_method !== 'NONE' && (
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <span>Shipping:</span>
                                                                <span>{formatCurrency(orderData.shipping_cost)}</span>
                                                            </div>)
                                                        }
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Tax:</span>
                                                            <span>{formatCurrency(orderData.tax_amount)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Discount:</span>
                                                            <span>{formatCurrency(orderData.discount_amount)}</span>
                                                        </div>
                                                        <hr/>
                                                        <div className="d-flex justify-content-between">
                                                            <strong>Total:</strong>
                                                            <strong>{formatCurrency(orderData.total_price)}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label">Order Note</label>
                                        <textarea
                                            className="form-control"
                                            name="note"
                                            value={orderData.note}
                                            onChange={handleOrderChange}
                                            rows="3"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 text-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary me-2"
                                            onClick={() => navigate('/orders')}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">Create Order</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                open={isCustomerModalVisible}
                onCancel={() => setIsCustomerModalVisible(false)}
                footer={null}
                width={1000}
            >
                <SelectCustomer
                    onCustomerSelect={handleCustomerSelect}
                />
            </Modal>


            <Modal
                open={isProductModalVisible}
                onCancel={() => setIsProductModalVisible(false)}
                footer={null}
                width={1000}
            >
                <SelectProduct
                    onProductSelect={handleProductSelect}
                />
            </Modal>

            <Modal
                open={isAddCustomerModalVisible}
                onCancel={() => setIsAddCustomerModalVisible(false)}
                footer={null}
                width={1000}
            >
                <CreateCustomer
                    onCustomerAdd={handleCustomerSelect}
                    closeModal={() => setIsAddCustomerModalVisible(false)}
                />
            </Modal>
        </div>
    );
};

export default CreateOrder;